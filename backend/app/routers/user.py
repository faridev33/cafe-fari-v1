from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
import uuid

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.core.security import get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 1. GET ALL USERS
@router.get("/", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# 2. GET USER BY ID
@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# 3. CREATE USER (Dengan Foto & Hash Password)
@router.post("/", response_model=UserResponse)
async def create_user(
    username: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Cek apakah username sudah ada
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Upload Image Logic
    image_path = None
    if image:
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"user_{uuid.uuid4()}.{file_extension}"
        file_location = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_path = f"static/images/{unique_filename}"

    # Hash Password
    hashed_password = get_password_hash(password)

    new_user = User(
        username=username,
        password=hashed_password,
        role=role,
        image_url=image_path
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 4. UPDATE USER
@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    username: str = Form(...),
    role: str = Form(...),
    password: Optional[str] = Form(None), # Password opsional saat edit
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update info dasar
    user.username = username
    user.role = role

    # Update Password hanya jika diisi
    if password:
        user.password = get_password_hash(password)

    # Update Image
    if image:
        # Hapus gambar lama
        if user.image_url and os.path.exists(user.image_url):
            os.remove(user.image_url)
        
        # Simpan gambar baru
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"user_{uuid.uuid4()}.{file_extension}"
        file_location = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        user.image_url = f"static/images/{unique_filename}"

    db.commit()
    db.refresh(user)
    return user

# 5. DELETE USER
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Hapus file gambar
    if user.image_url and os.path.exists(user.image_url):
        os.remove(user.image_url)

    db.delete(user)
    db.commit()
    return {"message": "User deleted"}