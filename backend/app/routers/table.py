from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.table import Table
from app.schemas.table import TableCreate, TableResponse

router = APIRouter(
    prefix="/tables",
    tags=["Tables"]
)

# 1. GET ALL TABLES
@router.get("/", response_model=List[TableResponse])
def read_tables(db: Session = Depends(get_db)):
    return db.query(Table).order_by(Table.number).all()

# 2. CREATE TABLE
@router.post("/", response_model=TableResponse)
def create_table(table: TableCreate, db: Session = Depends(get_db)):
    # Cek nomor meja duplikat
    existing = db.query(Table).filter(Table.number == table.number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Nomor meja sudah ada")
    
    new_table = Table(
        number=table.number,
        capacity=table.capacity,
        status=table.status
    )
    db.add(new_table)
    db.commit()
    db.refresh(new_table)
    return new_table

# 3. UPDATE STATUS (Misal: Kosongkan Meja)
@router.put("/{table_id}/status")
def update_status(table_id: int, status: str, db: Session = Depends(get_db)):
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Meja tidak ditemukan")
    
    table.status = status
    db.commit()
    return {"message": "Status updated", "status": status}

# 4. DELETE TABLE
@router.delete("/{table_id}")
def delete_table(table_id: int, db: Session = Depends(get_db)):
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Meja tidak ditemukan")
    
    db.delete(table)
    db.commit()
    return {"message": "Table deleted"}