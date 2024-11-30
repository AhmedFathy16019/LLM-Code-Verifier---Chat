from odmantic import Model, Field, ObjectId
from pydantic import field_validator, BaseModel
from typing import List
from datetime import datetime

# ODMantic MongoDB models
class Message(Model):
    prompt: str
    base_code: str
    sample_codes: List[str]
    test_cases: List[str]
    base_output: List
    sample_outputs: dict
    comparison_results: dict
    score: float
    is_deleted: bool = False
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
    messages: List[ObjectId]
    user_id: ObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_deleted: bool = False
    model_config = {
        'collection': 'chats',
    }

    @field_validator('updated_at')
    def set_updated_at(cls, v):
        return datetime.utcnow()

class User(Model):
    username: str
    password: str
    api_key: str
    chats: List[ObjectId]
    is_deactivated: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    model_config = {
        'collection': 'users',
    }

    @field_validator('updated_at')
    def set_updated_at(cls, v):
        return datetime.utcnow()

class TokenData(BaseModel):
    user_id: str = None
    username: str = None
    api_key: str = None