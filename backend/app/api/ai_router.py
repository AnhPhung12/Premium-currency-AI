from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import get_market_analysis, ask_ai_chat, get_short_insight

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    base: str
    target: str
    language: str

@router.get("/insight")
async def fetch_short_insight(amount: str, target: str, lang: str):
    insight = await get_short_insight(amount, target, lang)
    return {"insight": insight}

@router.get("/market")
async def fetch_market_analysis(base: str, target: str, lang: str):
    insight = await get_market_analysis(base, target, lang)
    return {"analysis": insight}

@router.post("/chat")
async def chat_with_ai_endpoint(req: ChatRequest):
    reply = await ask_ai_chat(req.message, req.base, req.target, req.language)
    return {"reply": reply}
