from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional
from datetime import datetime
from ..models import Chat

# Request schema for creating a user
class CreateUserRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    api_key: str

# Response schema for creating a user
class CreateUserResponse(BaseModel):
    user_id: str
    username: str
    email: EmailStr

# Request schema for updating a user
class UpdateUserRequest(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
    api_key: Optional[str]

# Response schema for updating a user
class UpdateUserResponse(BaseModel):
    user_id: str
    username: str
    email: EmailStr

# Response schema for retrieving a user
class GetUserResponse(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    chats: List[Chat]
    created_at: datetime
    updated_at: datetime

# Response schema for deleting a user
class DeleteUserResponse(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

class LoginUserRequest(BaseModel):
    email: EmailStr
    password: str

class LoginUserResponse(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    token: str