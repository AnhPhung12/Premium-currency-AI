from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints, ai_router
from app.database.mongodb import connect_to_mongo, close_mongo_connection
import uvicorn

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(title="Currency Converter AI API", lifespan=lifespan)

# Cấu hình CORS để Mobile App có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Thay đổi trong môi trường thực tế
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api", tags=["Currency"])
app.include_router(ai_router.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Currency Converter API with AI Integration!"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
