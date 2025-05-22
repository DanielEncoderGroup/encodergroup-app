from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
from app.core.config import settings

# MongoDB client instance
client = None
db = None

async def connect_to_mongo():
    """Connect to MongoDB."""
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        # Extraer el nombre de la base de datos de la URI
        db_name = settings.MONGO_URI.split("/")[-1]
        if not db_name or "?" in db_name:
            db_name = "misviaticos"  # Nombre por defecto si no se especifica en la URI
        
        db = client[db_name]
        print(f"Connected to MongoDB at {settings.MONGO_URI}")
        print(f"Using database: {db_name}")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("Closed connection to MongoDB")

def get_database() -> Database:
    """Get MongoDB database object."""
    return db