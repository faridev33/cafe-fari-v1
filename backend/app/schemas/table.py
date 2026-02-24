from pydantic import BaseModel
from typing import Optional

class TableCreate(BaseModel):
    number: int
    capacity: int
    status: str = "Available"

class TableResponse(TableCreate):
    id: int

    class Config:
        from_attributes = True