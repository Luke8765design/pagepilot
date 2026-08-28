from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from fastapi.responses import StreamingResponse, RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import secrets
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
import emailer
import gcal

logger = logging.getLogger(__name__)
ADMIN_PASSCODE = os.environ.get('ADMIN_PASSCODE', '')
FRONTEND_URL = os.environ.get('GOOGLE_REDIRECT_URI', '').split('/api/')[0]


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    business: str
    service: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    message: Optional[str] = None
    calendar_event_id: Optional[str] = None
    meet_link: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    business: str = Field(..., min_length=1, max_length=200)
    service: Optional[str] = Field(None, max_length=80)
    date: str = Field(..., min_length=8, max_length=10)
    time: str = Field(..., min_length=4, max_length=5)
    message: Optional[str] = Field(None, max_length=2000)


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    note: Optional[str] = None
    source: str = "chat"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    note: Optional[str] = Field(None, max_length=2000)


async def require_admin(x_admin_passcode: str = Header(default="")):
    if not ADMIN_PASSCODE or not secrets.compare_digest(x_admin_passcode, ADMIN_PASSCODE):
        raise HTTPException(status_code=401, detail="Invalid passcode")
    return True


def _pretty_when(date: str, time: str) -> str:
    try:
        dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
        return dt.strftime("%A, %d %B %Y at %I:%M %p").replace(" 0", " ")
    except Exception:
        return f"{date} {time}"


async def _get_calendar_settings():
    return await db.settings.find_one({"_id": "google_calendar"})


async def _post_booking_actions(booking: Booking):
    when = _pretty_when(booking.date, booking.time)
    # Emails (visitor + owners)
    try:
        await emailer.send_email(
            to=booking.email,
            subject="Your Page Pilot discovery call is booked",
            html=emailer.booking_visitor_html(booking.name, when, booking.service),
        )
    except Exception as e:
        logger.error(f"visitor email failed: {e}")
    owner_html = emailer.booking_owner_html(
        booking.name, booking.email, booking.business, when, booking.service, booking.message
    )
    for owner in emailer.OWNER_EMAILS:
        try:
            await emailer.send_email(to=owner, subject=f"New call booked — {booking.business}", html=owner_html)
        except Exception as e:
            logger.error(f"owner email failed ({owner}): {e}")
    # Google Calendar event
    settings = await _get_calendar_settings()
    if settings and settings.get("tokens") and gcal.is_configured():
        try:
            start_dt = datetime.strptime(f"{booking.date} {booking.time}", "%Y-%m-%d %H:%M")
            result = await asyncio.to_thread(
                gcal.create_event,
                settings["tokens"],
                summary=f"Discovery Call — {booking.business}",
                description=f"With {booking.name} ({booking.email}).\nService: {booking.service or 'TBD'}\nNotes: {booking.message or '—'}",
                start_dt=start_dt,
                attendee_email=booking.email,
            )
            await db.bookings.update_one(
                {"id": booking.id},
                {"$set": {"calendar_event_id": result.get("id"), "meet_link": result.get("meetLink")}},
            )
            if result.get("refreshed"):
                await db.settings.update_one(
                    {"_id": "google_calendar"},
                    {"$set": {"tokens.access_token": result["refreshed"]}},
                )
        except Exception as e:
            logger.error(f"calendar event failed: {e}")


@api_router.get("/")
async def root():
    return {"message": "Page Pilot API"}


@api_router.get("/bookings/slots")
async def booked_slots(date: str):
    docs = await db.bookings.find({"date": date}, {"_id": 0, "time": 1}).to_list(1000)
    return {"date": date, "taken": [d["time"] for d in docs if d.get("time")]}


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    existing = await db.bookings.find_one({"date": payload.date, "time": payload.time})
    if existing:
        raise HTTPException(status_code=409, detail="That time slot has just been taken. Please choose another.")
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    logger.info(f"New booking from {booking.email} ({booking.business}) on {booking.date} {booking.time}")
    await _post_booking_actions(booking)
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(_: bool = Depends(require_admin)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for b in bookings:
        if isinstance(b.get('created_at'), str):
            b['created_at'] = datetime.fromisoformat(b['created_at'])
    return bookings


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    logger.info(f"New chat lead: {lead.email}")
    owner_html = emailer.lead_owner_html(lead.name, lead.email, lead.note)
    for owner in emailer.OWNER_EMAILS:
        try:
            await emailer.send_email(to=owner, subject=f"New chat lead — {lead.name}", html=owner_html)
        except Exception as e:
            logger.error(f"lead email failed ({owner}): {e}")
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(_: bool = Depends(require_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for l in leads:
        if isinstance(l.get('created_at'), str):
            l['created_at'] = datetime.fromisoformat(l['created_at'])
    return leads


@api_router.post("/admin/verify")
async def admin_verify(_: bool = Depends(require_admin)):
    return {"ok": True}


# ---- Google Calendar OAuth ----
@api_router.get("/calendar/status")
async def calendar_status(_: bool = Depends(require_admin)):
    settings = await _get_calendar_settings()
    return {
        "configured": gcal.is_configured(),
        "connected": bool(settings and settings.get("tokens")),
        "email": settings.get("email") if settings else None,
    }


@api_router.get("/oauth/calendar/login")
async def calendar_login(passcode: str = ""):
    if not ADMIN_PASSCODE or not secrets.compare_digest(passcode, ADMIN_PASSCODE):
        raise HTTPException(status_code=401, detail="Invalid passcode")
    if not gcal.is_configured():
        raise HTTPException(status_code=400, detail="Google credentials not configured on server")
    return {"authorization_url": gcal.build_auth_url(state=passcode)}


@api_router.get("/oauth/calendar/callback")
async def calendar_callback(code: str = "", state: str = "", error: str = ""):
    dest = f"{FRONTEND_URL}/admin"
    if error or not code:
        return RedirectResponse(f"{dest}?calendar=error")
    try:
        result = await asyncio.to_thread(gcal.exchange_code, code)
        tokens = result["tokens"]
        if not tokens.get("access_token"):
            return RedirectResponse(f"{dest}?calendar=error")
        await db.settings.update_one(
            {"_id": "google_calendar"},
            {"$set": {"tokens": tokens, "email": result.get("email"),
                      "connected_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        return RedirectResponse(f"{dest}?calendar=connected")
    except Exception as e:
        logger.error(f"calendar callback failed: {e}")
        return RedirectResponse(f"{dest}?calendar=error")


@api_router.post("/calendar/disconnect")
async def calendar_disconnect(_: bool = Depends(require_admin)):
    await db.settings.delete_one({"_id": "google_calendar"})
    return {"ok": True}


EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

CHAT_SYSTEM_PROMPT = (
    "You are Pilot, the friendly AI assistant for Page Pilot — a modern agency that helps "
    "local businesses grow with affordable AI chatbots, AI receptionists and stunning modern websites. "
    "Answer questions about these three services, typical benefits (24/7 enquiry handling, more booked "
    "appointments, saved admin time, professional online presence), and that pricing is affordable and "
    "tailored per business (no fixed public prices — encourage a free discovery call for a quote). "
    "Keep replies warm, confident and concise (2-4 short sentences). When a visitor shows interest or "
    "asks about price, timelines or getting started, warmly invite them to book a free discovery call. "
    "Never invent specific prices or make guarantees. If asked something unrelated, gently steer back to "
    "how Page Pilot can help their business."
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., max_length=40)
    session_id: Optional[str] = None


@api_router.post("/chat")
async def chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    if not req.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    history = req.messages[-16:]
    latest = history[-1]
    prior = history[:-1]
    transcript = "\n".join(
        f"{'Visitor' if m.role == 'user' else 'Pilot'}: {m.content}" for m in prior
    )
    prompt = latest.content
    if transcript:
        prompt = f"Conversation so far:\n{transcript}\n\nVisitor: {latest.content}"

    session_id = req.session_id or str(uuid.uuid4())

    async def event_generator():
        try:
            chat_client = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message=CHAT_SYSTEM_PROMPT,
            ).with_model("openai", "gpt-5.4-mini")
            async for ev in chat_client.stream_message(UserMessage(text=prompt)):
                if isinstance(ev, TextDelta):
                    yield f"data: {json.dumps({'t': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logger.error(f"Chat stream error: {e}")
            yield f"data: {json.dumps({'error': 'stream_failed'})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
