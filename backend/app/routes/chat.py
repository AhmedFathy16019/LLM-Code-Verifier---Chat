from fastapi import APIRouter, HTTPException
from ..models import Chat, Message

from ..schemas.chat import (
    CreateChatRequest, CreateChatResponse,
    UpdateChatRequest, UpdateChatResponse,
    GetChatResponse, DeleteChatResponse
)

from ..database import engine

router = APIRouter()


# Chat CRUD operations
@router.post("/chats", response_model=CreateChatResponse)
async def create_chat(chat: CreateChatRequest):
    new_chat = Chat(
        title=chat.title,
        messages=[]
    )
    await engine.save(new_chat)
    return CreateChatResponse(
        chat_id=str(new_chat.id),
        title=new_chat.title,
        messages=[],
        created_at=new_chat.created_at,
        updated_at=new_chat.updated_at
    )

@router.get("/chats/{chat_id}", response_model=GetChatResponse)
async def get_chat(chat_id: str):
    chat = await engine.find_one(Chat, Chat.id == chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    await engine.populate(chat, "messages")
    return GetChatResponse(
        chat_id=str(chat.id),
        title=chat.title,
        messages=[str(message.id) for message in chat.messages],
        created_at=chat.created_at,
        updated_at=chat.updated_at
    )

@router.put("/chats/{chat_id}", response_model=UpdateChatResponse)
async def update_chat(chat_id: str, chat_update: UpdateChatRequest):
    chat = await engine.find_one(Chat, Chat.id == chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    if chat_update.title:
        chat.title = chat_update.title
    if chat_update.messages:
        chat.messages = [await engine.find_one(Message, Message.id == message_id) for message_id in chat_update.messages]
    await engine.save(chat)
    return UpdateChatResponse(
        chat_id=str(chat.id),
        title=chat.title,
        messages=[str(message.id) for message in chat.messages],
        created_at=chat.created_at,
        updated_at=chat.updated_at
    )

@router.delete("/chats/{chat_id}", response_model=DeleteChatResponse)
async def delete_chat(chat_id: str):
    chat = await engine.find_one(Chat, Chat.id == chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    await engine.delete(chat)
    return DeleteChatResponse(
        chat_id=str(chat.id),
        title=chat.title,
        messages=[str(message.id) for message in chat.messages],
        created_at=chat.created_at,
        updated_at=chat.updated_at
    )