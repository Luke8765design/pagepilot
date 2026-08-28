import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Page Pilot")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAILS = [e.strip() for e in os.environ.get("OWNER_EMAILS", "").split(",") if e.strip()]

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set; skipping email send")
        return None
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if EMAIL_REPLY_TO:
        payload["contact_email"] = EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _wrap(inner: str) -> str:
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#faf9f5;padding:32px 0;font-family:Arial,Helvetica,sans-serif">'
        '<tr><td align="center"><table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#ffffff;border:1px solid #eee;border-radius:16px;overflow:hidden">'
        '<tr><td style="background:#0A0A0A;padding:22px 32px">'
        '<span style="color:#ffffff;font-size:20px;font-weight:bold">Page <span style="color:#D4AF37">Pilot</span></span>'
        '</td></tr>'
        f'<tr><td style="padding:32px">{inner}'
        '<p style="font-size:12px;color:#999;margin-top:28px">Sent by Page Pilot. We never ask for your password or card details by email.</p>'
        '</td></tr></table></td></tr></table>'
    )


def booking_visitor_html(name: str, when: str, service: str | None) -> str:
    svc = f'<p style="margin:0 0 6px;color:#4a4a4a"><strong>Service:</strong> {escape(service)}</p>' if service else ""
    inner = (
        f'<h1 style="font-size:22px;color:#0A0A0A;margin:0 0 12px">Your call is booked, {escape(name.split(" ")[0])} 🎉</h1>'
        f'<p style="font-size:15px;color:#4a4a4a;line-height:1.6;margin:0 0 18px">Thanks for booking a free discovery call with Page Pilot. Here are your details:</p>'
        f'<div style="background:#faf9f5;border:1px solid #f0ead6;border-radius:12px;padding:18px 20px;margin:0 0 18px">'
        f'<p style="margin:0 0 6px;color:#4a4a4a"><strong>When:</strong> {escape(when)}</p>{svc}</div>'
        f'<p style="font-size:15px;color:#4a4a4a;line-height:1.6;margin:0">We\'ll be in touch shortly to confirm. Looking forward to speaking with you!</p>'
    )
    return _wrap(inner)


def booking_owner_html(name: str, email: str, business: str, when: str, service: str | None, message: str | None) -> str:
    rows = [
        ("Name", name), ("Email", email), ("Business", business),
        ("When", when), ("Service", service or "—"), ("Message", message or "—"),
    ]
    body = "".join(
        f'<tr><td style="padding:8px 0;color:#999;width:110px;vertical-align:top">{escape(k)}</td>'
        f'<td style="padding:8px 0;color:#0A0A0A">{escape(str(v))}</td></tr>'
        for k, v in rows
    )
    inner = (
        '<h1 style="font-size:20px;color:#0A0A0A;margin:0 0 12px">New discovery call booked</h1>'
        f'<table role="presentation" width="100%" style="font-size:14px">{body}</table>'
    )
    return _wrap(inner)


def lead_owner_html(name: str, email: str, note: str | None) -> str:
    inner = (
        '<h1 style="font-size:20px;color:#0A0A0A;margin:0 0 12px">New chat lead 💬</h1>'
        f'<p style="font-size:14px;color:#4a4a4a;margin:0 0 6px"><strong>Name:</strong> {escape(name)}</p>'
        f'<p style="font-size:14px;color:#4a4a4a;margin:0 0 6px"><strong>Email:</strong> {escape(email)}</p>'
        f'<p style="font-size:14px;color:#4a4a4a;margin:0"><strong>Context:</strong> {escape(note or "From live chat")}</p>'
    )
    return _wrap(inner)
