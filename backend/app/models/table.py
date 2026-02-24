from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Table(Base):
    __tablename__ = "tables"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, unique=True, index=True) # Nomor Meja (1, 2, 3...)
    capacity = Column(Integer) # Kapasitas kursi
    status = Column(String, default="Available") # Available, Occupied
    # Kita tidak perlu menyimpan gambar QR di DB, cukup generate di frontend berdasarkan ID