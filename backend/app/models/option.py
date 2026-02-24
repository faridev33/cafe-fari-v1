from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ProductOption(Base):
    __tablename__ = "product_options"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    name = Column(String) # Contoh: "Topping", "Level Pedas"
    
    # Relasi ke Choice
    choices = relationship("OptionChoice", back_populates="option", cascade="all, delete-orphan")

class OptionChoice(Base):
    __tablename__ = "option_choices"

    id = Column(Integer, primary_key=True, index=True)
    option_id = Column(Integer, ForeignKey("product_options.id"))
    name = Column(String) # Contoh: "Keju", "Mozzarella"
    extra_price = Column(Float, default=0) # Contoh: 2000
    
    option = relationship("ProductOption", back_populates="choices")