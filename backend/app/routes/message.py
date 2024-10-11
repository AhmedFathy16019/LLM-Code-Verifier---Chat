from fastapi import APIRouter, HTTPException
from ..models import Message

from ..schemas.message import (
    CreateMessageRequest, CreateMessageResponse,
    UpdateMessageRequest, UpdateMessageResponse,
    GetMessageResponse, DeleteMessageResponse
)
from ..database import engine

router = APIRouter()

# Message CRUD operations
@router.post("/messages", response_model=CreateMessageResponse)
async def create_message(message: CreateMessageRequest):
    new_message = Message(
        prompt=message.prompt,
        base_response=message.base_response,
        sampled_responses=message.sampled_responses,
        test_cases=message.test_cases,
        base_output=message.base_output,
        sampled_outputs=message.sampled_outputs,
        score=message.score
    )
    await engine.save(new_message)
    return CreateMessageResponse(
        id=str(new_message.id),
        prompt=new_message.prompt,
        base_response=new_message.base_response,
        sampled_responses=new_message.sampled_responses,
        test_cases=new_message.test_cases,
        base_output=new_message.base_output,
        sampled_outputs=new_message.sampled_outputs,
        score=new_message.score,
        created_at=new_message.created_at,
        updated_at=new_message.updated_at
    )

@router.get("/messages/{message_id}", response_model=GetMessageResponse)
async def get_message(message_id: str):
    message = await engine.find_one(Message, Message.id == message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return GetMessageResponse(
        id=str(message.id),
        prompt=message.prompt,
        base_response=message.base_response,
        sampled_responses=message.sampled_responses,
        test_cases=message.test_cases,
        base_output=message.base_output,
        sampled_outputs=message.sampled_outputs,
        score=message.score,
        created_at=message.created_at,
        updated_at=message.updated_at
    )

@router.put("/messages/{message_id}", response_model=UpdateMessageResponse)
async def update_message(message_id: str, message_update: UpdateMessageRequest):
    message = await engine.find_one(Message, Message.id == message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    if message_update.prompt:
        message.prompt = message_update.prompt
    if message_update.base_response:
        message.base_response = message_update.base_response
    if message_update.sampled_responses:
        message.sampled_responses = message_update.sampled_responses
    if message_update.test_cases:
        message.test_cases = message_update.test_cases
    if message_update.base_output:
        message.base_output = message_update.base_output
    if message_update.sampled_outputs:
        message.sampled_outputs = message_update.sampled_outputs
    if message_update.score is not None:
        message.score = message_update.score
    await engine.save(message)
    return UpdateMessageResponse(
        id=str(message.id),
        prompt=message.prompt,
        base_response=message.base_response,
        sampled_responses=message.sampled_responses,
        test_cases=message.test_cases,
        base_output=message.base_output,
        sampled_outputs=message.sampled_outputs,
        score=message.score,
        created_at=message.created_at,
        updated_at=message.updated_at
    )

@router.delete("/messages/{message_id}", response_model=DeleteMessageResponse)
async def delete_message(message_id: str):
    message = await engine.find_one(Message, Message.id == message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    await engine.delete(message)
    return DeleteMessageResponse(
        id=str(message.id),
        prompt=message.prompt,
        base_response=message.base_response,
        sampled_responses=message.sampled_responses,
        test_cases=message.test_cases,
        base_output=message.base_output,
        sampled_outputs=message.sampled_outputs,
        score=message.score,
        created_at=message.created_at,
        updated_at=message.updated_at
    )