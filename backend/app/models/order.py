from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(String)     
    customer_name = Column(String)
    total_price = Column(Float)
    payment_method = Column(String) 
    payment_status = Column(String, default="UNPAID") 
    
    # --- KOLOM BARU ---
    cooking_status = Column(String, default="QUEUED") # QUEUED, COOKING, DONE
    
    items = Column(JSON)          
    created_at = Column(DateTime(timezone=True), server_default=func.now())