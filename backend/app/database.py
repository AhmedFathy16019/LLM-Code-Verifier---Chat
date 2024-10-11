from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

# Create Motor Client and ODMantic engine
client = AsyncIOMotorClient(MONGODB_URL)
engine = AIOEngine(client=client, database="LLM-Code-Verifier-Chat")