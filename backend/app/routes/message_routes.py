from fastapi import APIRouter, HTTPException, Request
from sse_starlette.sse import EventSourceResponse
import json

from ..schemas.message_schema import (
    CreateMessageRequest, CreateMessageResponse,
    UpdateMessageRequest, UpdateMessageResponse,
    GetMessageResponse, DeleteMessageResponse,
    GenerateMessageRequest
)
from ..models import Message, Chat
from ..database import engine
from ..services.generation_service import generate_message_data
from ..services.authorization_service import authorize_token

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

@router.post("/messages/generate-message/{chat_id}")
async def generate_message(request: Request, chat_id: str,message_request: GenerateMessageRequest):
    token = request.headers.get("Authorization")[7:]
    token = await authorize_token(token)
    
    async def event_generator():
        try:
            message_data = {}
            async for message in generate_message_data(
                prompt=message_request.prompt,
                entry_point=message_request.entry_point,
                sample_output=message_request.sample_output,
                api_key=token.api_key,
                n_samples=message_request.n_samples
            ):
                yield {"event": "message", "data": message}
                message_dict = json.loads(message)
                message_type = message_dict["message_type"]
                message_data[message_type] = message_dict["data"]

            new_message = Message(
                prompt=message_request.prompt,
                base_code=message_data["base_code"],
                sample_codes=message_data["sample_codes"],
                test_cases=message_data["test_cases"],
                base_output=message_data["base_output"],
                sample_outputs=message_data["sample_outputs"],
                score=message_data["score"]
            )

            await engine.save(new_message)

            chat = await engine.find_one(Chat, Chat.id == chat_id)
            if not chat:
                raise HTTPException(status_code=404, detail="Chat not found")

            chat.messages.append(new_message.id)
            await engine.save(chat)
        except Exception as e:
            yield {"event": "error", "data": str(e)}

    return EventSourceResponse(event_generator())