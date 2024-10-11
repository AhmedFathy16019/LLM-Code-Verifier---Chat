from fastapi import FastAPI
from .routes.user import router as user_router
from .routes.chat import router as chat_router
from .routes.message import router as message_router

app = FastAPI()

# Include the routers for user, chat, and message routes
app.include_router(user_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(message_router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the ChatGPT App API"}