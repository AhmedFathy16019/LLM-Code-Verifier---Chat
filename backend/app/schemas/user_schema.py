from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..models import Chat

# Request schema for creating a user
class CreateUserRequest(BaseModel):
    username: str
    password: str
    api_key: str

# Response schema for creating a user
class CreateUserResponse(BaseModel):
    user_id: str
    username: str

# Request schema for updating a user
class UpdateUserRequest(BaseModel):
    username: Optional[str]
    password: Optional[str]
    api_key: Optional[str]

# Response schema for updating a user
class UpdateUserResponse(BaseModel):
    user_id: str
    username: str

# Response schema for retrieving a user
class GetUserResponse(BaseModel):
    user_id: str
    username: str
    chats: List[Chat]
    created_at: datetime
    updated_at: datetime

# Response schema for deleting a user
class DeleteUserResponse(BaseModel):
    user_id: str
    username: str
    created_at: datetime
    updated_at: datetime

class RegisterUserRequest(BaseModel):
    username: str
    password: str
    api_key: str

class RegisterUserResponse(BaseModel):
    user_id: str
    username: str
    token: str

class LoginUserRequest(BaseModel):
    username: str
    password: str

class LoginUserResponse(BaseModel):
    user_id: str
    username: str
    token: str