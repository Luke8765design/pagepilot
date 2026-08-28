from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone


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
    date: str
    time: str
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    business: str = Field(..., min_length=1, max_length=200)
    service: Optional[str] = Field(None, max_length=80)
    date: str = Field(..., min_length=8, max_length=10)
    time: str = Field(..., min_length=4, max_length=5)
    message: Optional[str] = Field(None, max_length=2000)


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
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for b in bookings:
        if isinstance(b.get('created_at'), str):
            b['created_at'] = datetime.fromisoformat(b['created_at'])
    return bookings


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
