from odmantic import Model, Field
from pydantic import EmailStr, field_validator
from typing import List
from datetime import datetime

# ODMantic MongoDB models
class Message(Model):
    prompt: str
    base_response: str
    sampled_responses: List[str]
    test_cases: List[str]
    base_output: str
    sampled_outputs: List[str]
    score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    model_config = {
        'collection': 'messages',
    }

    @field_validator('updated_at')
    def set_updated_at(cls, v):
        return datetime.utcnow()

class Chat(Model):
    title: str
    messages: List[Message]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    model_config = {
        'collection': 'chats',
    }

    @field_validator('updated_at')
    def set_updated_at(cls, v):
        return datetime.utcnow()

class User(Model):
    username: str
    email: EmailStr
    password: str
    api_key: str
    chats: List[Chat]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    model_config = {
        'collection': 'users',
    }

    @field_validator('updated_at')
    def set_updated_at(cls, v):
        return datetime.utcnow()
