from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_client = MongoDB()

async def connect_to_mongo():
    print("Connecting to MongoDB...")
    db_client.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_client.db = db_client.client[settings.DATABASE_NAME]
    print("Connected to MongoDB!")

async def close_mongo_connection():
    print("Closing MongoDB connection...")
    if db_client.client:
        db_client.client.close()
    print("MongoDB connection closed!")

def get_db():
    return db_client.db
