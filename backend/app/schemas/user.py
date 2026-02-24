from pydantic import BaseModel
from typing import Optional

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True