import os
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "")
TIMEZONE = os.environ.get("CALENDAR_TIMEZONE", "Europe/London")
SCOPES = ["https://www.googleapis.com/auth/calendar", "openid",
          "https://www.googleapis.com/auth/userinfo.email"]


def is_configured() -> bool:
    return bool(CLIENT_ID and CLIENT_SECRET and REDIRECT_URI)


def build_auth_url(state: str) -> str:
    from google_auth_oauthlib.flow import Flow
    flow = Flow.from_client_config(
        {"web": {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [REDIRECT_URI],
        }},
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )
    url, _ = flow.authorization_url(access_type="offline", prompt="consent",
                                    include_granted_scopes="true", state=state)
    return url


def exchange_code(code: str) -> dict:
    import requests
    resp = requests.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }, timeout=30).json()
    email = None
    if resp.get("access_token"):
        try:
            u = requests.get("https://www.googleapis.com/oauth2/v2/userinfo",
                             headers={"Authorization": f"Bearer {resp['access_token']}"},
                             timeout=30).json()
            email = u.get("email")
        except Exception as e:
            logger.error(f"userinfo failed: {e}")
    return {"tokens": resp, "email": email}


def _creds(tokens: dict):
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request as GoogleRequest
    creds = Credentials(
        token=tokens.get("access_token"),
        refresh_token=tokens.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=SCOPES,
    )
    if creds.expired and creds.refresh_token:
        creds.refresh(GoogleRequest())
    return creds


def create_event(tokens: dict, *, summary: str, description: str, start_dt: datetime,
                 attendee_email: str, minutes: int = 30) -> dict:
    from googleapiclient.discovery import build
    creds = _creds(tokens)
    service = build("calendar", "v3", credentials=creds, cache_discovery=False)
    end_dt = start_dt + timedelta(minutes=minutes)
    body = {
        "summary": summary,
        "description": description,
        "start": {"dateTime": start_dt.isoformat(), "timeZone": TIMEZONE},
        "end": {"dateTime": end_dt.isoformat(), "timeZone": TIMEZONE},
        "attendees": [{"email": attendee_email}],
        "conferenceData": {
            "createRequest": {
                "requestId": f"pp-{int(start_dt.timestamp())}",
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }
    event = service.events().insert(
        calendarId="primary", body=body, conferenceDataVersion=1, sendUpdates="all"
    ).execute()
    return {"id": event.get("id"), "htmlLink": event.get("htmlLink"),
            "meetLink": event.get("hangoutLink"), "refreshed": creds.token}
