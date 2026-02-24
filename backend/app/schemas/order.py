from pydantic import BaseModel
from typing import List, Any, Optional

# Schema untuk Update Pesanan oleh Kasir
class OrderUpdateItems(BaseModel):
    items: List[Any]        # List makanan yang sudah diedit
    total_price: float      # Harga total baru