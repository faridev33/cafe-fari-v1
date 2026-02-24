from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
import uuid

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse

# --- 1. DEFINISI ROUTER ---
router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

# Lokasi simpan gambar
UPLOAD_DIR = "static/images"

# Pastikan folder ada
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- 2. ENDPOINT GET ALL (Lihat Semua) ---
@router.get("/", response_model=List[ProductResponse])
def read_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

# --- 3. ENDPOINT POST (Tambah Produk) ---
@router.post("/", response_model=ProductResponse)
async def create_product(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    status: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_path = None

    if image:
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_location = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        image_path = f"static/images/{unique_filename}"

    new_product = Product(
        name=name,
        category=category,
        price=price,
        status=status,
        image_url=image_path
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product

# --- 4. ENDPOINT GET ONE (Lihat 1 Produk untuk Edit) ---
@router.get("/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# --- 5. ENDPOINT PUT (Update/Edit Produk Lengkap) ---
@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    status: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update Data Text
    product.name = name
    product.category = category
    product.price = price
    product.status = status

    # Logic Ganti Gambar
    if image:
        # Hapus gambar lama jika ada
        if product.image_url:
            old_file_path = product.image_url
            if os.path.exists(old_file_path):
                os.remove(old_file_path)
        
        # Simpan gambar baru
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_location = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        product.image_url = f"static/images/{unique_filename}"

    db.commit()
    db.refresh(product)
    return product

# --- 6. ENDPOINT DELETE (Hapus Produk) ---
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Hapus file gambar dari folder
    if product.image_url:
        file_path = product.image_url
        if os.path.exists(file_path):
            os.remove(file_path)

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}

# --- 7. ENDPOINT PATCH STATUS (KHUSUS UNTUK KITCHEN - MENU HABIS) ---
@router.patch("/{product_id}/status")
def update_product_status(product_id: int, status: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.status = status # 'Available' atau 'Out of Stock'
    db.commit()
    return {"message": "Status updated", "status": product.status}