from pydantic import BaseModel
from typing import Optional

# Schema untuk response (data yang dikirim ke Frontend)
class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float
    status: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True # Agar kompatibel dengan SQLAlchemy objects