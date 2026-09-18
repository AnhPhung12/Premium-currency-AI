from fastapi import APIRouter, HTTPException, Depends
from app.services.currency_service import get_exchange_rates
from app.database.mongodb import get_db

router = APIRouter()

@router.get("/rates")
async def fetch_rates(base: str = "USD"):
    """Lấy danh sách tỷ giá mới nhất"""
    rates_data = await get_exchange_rates(base)
    if not rates_data:
        raise HTTPException(status_code=500, detail="Failed to fetch exchange rates")
    return rates_data

@router.post("/chat/log")
async def log_chat(base: str, target: str, insight: str, db = Depends(get_db)):
    """Lưu lịch sử nhận định vào MongoDB"""
    if db is None:
         raise HTTPException(status_code=500, detail="Database not configured")
    
    chat_log = {
        "base": base,
        "target": target,
        "insight": insight
    }
    
    await db.chat_logs.insert_one(chat_log)
    return {"status": "success", "message": "Log saved to MongoDB"}

@router.get("/chat/logs")
async def get_logs(db = Depends(get_db), limit: int = 10):
    """Lấy lịch sử nhận định từ MongoDB"""
    if db is None:
         raise HTTPException(status_code=500, detail="Database not configured")
    
    cursor = db.chat_logs.find().sort("_id", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    
    # Chuyển đổi ObjectId sang chuỗi
    for log in logs:
        log["_id"] = str(log["_id"])
        
    return logs
