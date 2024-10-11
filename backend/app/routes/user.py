import logging
from fastapi import APIRouter, HTTPException
from ..models import User
from ..schemas.user import (
    CreateUserRequest, CreateUserResponse,
    UpdateUserRequest, UpdateUserResponse,
    GetUserResponse, DeleteUserResponse
)

from ..database import engine

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# User CRUD operations
@router.post("/users", response_model=CreateUserResponse)
async def create_user(user: CreateUserRequest):
    new_user = User(
        username=user.username,
        email=user.email,
        password=user.password,  # Ensure this is hashed
        api_key=user.api_key,  # Ensure this is hashed
        chats=[]
    )
    logger.info(f"Creating user: {new_user}")
    await engine.save(new_user)
    logger.info(f"User created with ID: {new_user.id}")
    return CreateUserResponse(
        user_id=str(new_user.id),
        username=new_user.username,
        email=new_user.email
    )

@router.get("/users/{user_id}", response_model=GetUserResponse)
async def get_user(user_id: str):
    user = await engine.find_one(User, User.id == user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await engine.populate(user, "chats")
    return GetUserResponse(
        user_id=str(user.id),
        username=user.username,
        email=user.email,
        chats=user.chats,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

@router.put("/users/{user_id}", response_model=UpdateUserResponse)
async def update_user(user_id: str, user_update: UpdateUserRequest):
    user = await engine.find_one(User, User.id == user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_update.username:
        user.username = user_update.username
    if user_update.email:
        user.email = user_update.email
    if user_update.password:
        user.password = user_update.password  # Ensure this is hashed
    if user_update.api_key:
        user.api_key = user_update.api_key  # Ensure this is hashed
    await engine.save(user)
    return UpdateUserResponse(
        user_id=str(user.id),
        username=user.username,
        email=user.email
    )

@router.delete("/users/{user_id}", response_model=DeleteUserResponse)
async def delete_user(user_id: str):
    user = await engine.find_one(User, User.id == user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await engine.delete(user)
    return DeleteUserResponse(
        user_id=str(user.id),
        username=user.username,
        email=user.email,
        created_at=user.created_at,
        updated_at=user.updated_at
    )