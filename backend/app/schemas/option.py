from pydantic import BaseModel
from typing import List, Optional

class ChoiceBase(BaseModel):
    name: str
    extra_price: float = 0

class OptionBase(BaseModel):
    name: str
    choices: List[ChoiceBase]

class OptionCreate(OptionBase):
    pass

class ChoiceResponse(ChoiceBase):
    id: int
    class Config:
        from_attributes = True

class OptionResponse(OptionBase):
    id: int
    product_id: int
    choices: List[ChoiceResponse]
    class Config:
        from_attributes = True