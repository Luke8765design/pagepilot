import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER", "")
OWNER_PHONES = [p.strip() for p in os.environ.get("OWNER_PHONES", "").split(",") if p.strip()]


def is_configured() -> bool:
    return bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER and OWNER_PHONES)


def _send_one(to: str, body: str) -> str:
    from twilio.rest import Client
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    msg = client.messages.create(to=to, from_=TWILIO_PHONE_NUMBER, body=body)
    return msg.sid


def send_owner_sms(body: str) -> None:
    if not is_configured():
        logger.info("Twilio not configured; skipping SMS")
        return
    for phone in OWNER_PHONES:
        try:
            sid = _send_one(phone, body)
            logger.info(f"SMS sent to {phone}: {sid}")
        except Exception as e:
            logger.error(f"SMS to {phone} failed: {e}")
