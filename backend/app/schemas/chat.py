from pydantic import BaseModel, constr
from typing import List, Optional, Union
from datetime import datetime

# Request schema for creating a chat
class CreateChatRequest(BaseModel):
    title: str

class CreateChatResponse(BaseModel):
    chat_id: str
    title: str
    messages: List[Union[str, dict]]  # Can be a list of IDs or populated message objects
    created_at: datetime
    updated_at: datetime

# Request schema for updating a chat
class UpdateChatRequest(BaseModel):
    title: Optional[str]
    messages: Optional[List[str]]

# Response schema for updating a chat
class UpdateChatResponse(BaseModel):
    chat_id: str
    title: str
    messages: List[Union[str, dict]]  # Can be a list of IDs or populated message objects
    created_at: datetime
    updated_at: datetime

# Response schema for retrieving a chat
class GetChatResponse(BaseModel):
    chat_id: str
    title: str
    messages: List[Union[str, dict]]  # Can be a list of IDs or populated message objects
    created_at: datetime
    updated_at: datetime

# Response schema for deleting a chat
class DeleteChatResponse(BaseModel):
    chat_id: str
    title: str
    messages: List[Union[str, dict]]  # Can be a list of IDs or populated message objects
    created_at: datetime
    updated_at: datetime