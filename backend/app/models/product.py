from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    status = Column(String) # Available / Out of Stock
    image_url = Column(String, nullable=True) # Menyimpan path/url gambar