from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Request schema for creating a message
class CreateMessageRequest(BaseModel):
    prompt: str

# Response schema for creating a message
class CreateMessageResponse(BaseModel):
    message_id: str
    prompt: str
    base_response: str
    sampled_responses: List[str]
    test_cases: List[str]
    base_output: str
    sampled_outputs: List[str]
    score: float
    created_at: datetime
    updated_at: datetime

# Request schema for updating a message
class UpdateMessageRequest(BaseModel):
    prompt: str

# Response schema for updating a message
class UpdateMessageResponse(BaseModel):
    message_id: str
    prompt: str
    base_response: str
    sampled_responses: List[str]
    test_cases: List[str]
    base_output: str
    sampled_outputs: List[str]
    score: float
    created_at: datetime
    updated_at: datetime

# Response schema for retrieving a message
class GetMessageResponse(BaseModel):
    message_id: str
    prompt: str
    base_response: str
    sampled_responses: List[str]
    test_cases: List[str]
    base_output: str
    sampled_outputs: List[str]
    score: float
    created_at: datetime
    updated_at: datetime

# Response schema for deleting a message
class DeleteMessageResponse(BaseModel):
    message_id: str
    prompt: str
    base_response: str
    sampled_responses: List[str]
    test_cases: List[str]
    base_output: str
    sampled_outputs: List[str]
    score: float
    created_at: datetime
    updated_at: datetime

class GenerateMessageRequest(BaseModel):
    prompt: str
    entry_point: Optional[str] = None
    sample_output: Optional[str] = None
    temperature: Optional[float] = None
    timeout: Optional[int] = None
    exact_matching: Optional[bool] = None
    n_samples: Optional[int] = 5