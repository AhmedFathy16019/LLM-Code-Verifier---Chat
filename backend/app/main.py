from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.user_routes import router as user_router
from .routes.chat_routes import router as chat_router
from .routes.message_routes import router as message_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers for user, chat, and message routes
app.include_router(user_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(message_router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the ChatGPT App API"}