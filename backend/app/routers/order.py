from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order

# Import Schema
from app.schemas.order import OrderUpdateItems 
from pydantic import BaseModel

router = APIRouter(prefix="/orders", tags=["Orders"])

# Schema Input Create
class OrderCreate(BaseModel):
    table_id: str
    customer_name: str
    total_price: float
    payment_method: str
    payment_status: str
    items: List[dict] 

# 1. CREATE ORDER
@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    new_order = Order(
        table_id=order.table_id,
        customer_name=order.customer_name,
        total_price=order.total_price,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        cooking_status="QUEUED", # Default
        items=order.items 
    )
    db.add(new_order)
    db.commit()
    return {"message": "Order created"}

# 2. GET ORDERS
@router.get("/")
def get_orders(status: str = None, db: Session = Depends(get_db)):
    # --- LOGIC AUTO DELETE UNPAID ---
    if status == "UNPAID" or status is None:
        # Hitung waktu 1 jam yang lalu
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        
        # Cari order UNPAID yang dibuat sebelum 1 jam lalu
        expired_orders = db.query(Order).filter(
            Order.payment_status == "UNPAID",
            Order.created_at < one_hour_ago
        ).all()

        # Hapus order kadaluarsa
        if expired_orders:
            print(f"Menghapus {len(expired_orders)} pesanan kadaluarsa...")
            for order in expired_orders:
                db.delete(order)
            db.commit()
    # --------------------------------

    query = db.query(Order)
    if status:
        query = query.filter(Order.payment_status == status)
    return query.order_by(Order.created_at.desc()).all()


# 3. UPDATE ITEMS (Kasir Edit)
@router.put("/{order_id}/items")
def update_order_items(
    order_id: int, 
    payload: OrderUpdateItems, 
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.items = payload.items
    order.total_price = payload.total_price
    
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(order, "items")

    db.commit()
    return {"message": "Order updated successfully"}

# 4. PAY ORDER
@router.put("/{order_id}/pay")
def pay_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.payment_status = "PAID"
    db.commit()
    return {"message": "Payment success"}

# 5. CEK STATUS (Customer)
@router.get("/status/{table_id}")
def get_order_status(table_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.table_id == table_id).order_by(Order.created_at.desc()).first()
    if not order:
        return {"status": "No Order"}
    return order

# 6. UPDATE COOKING STATUS (API BARU UNTUK DAPUR)
@router.put("/{order_id}/cooking")
def update_cooking_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.cooking_status = status
    db.commit()
    return {"message": "Cooking status updated"}