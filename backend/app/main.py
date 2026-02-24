from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import engine, Base, get_db
# Import Router
from app.routers import product, user, table, option
# Import Models agar tabel dibuat otomatis
from app.models import product as pm, user as um, table as tm, option as om
from app.models.user import User
from app.core.security import verify_password
from app.routers import product, user, table, option, order # <--- Tambah order
from app.models import product as pm, user as um, table as tm, option as om, order as odm # <--- Tambah 

# --- INISIALISASI DATABASE ---
Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- SETUP STATIC FILES (Agar gambar bisa diakses) ---
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- SETUP CORS (PERBAIKAN UTAMA) ---
# Menggunakan ["*"] mengizinkan semua koneksi (localhost, 127.0.0.1, hp, dll)
# Ini memperbaiki error "Access-Control-Allow-Origin"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DAFTARKAN ROUTER ---
app.include_router(product.router)
app.include_router(user.router)
app.include_router(table.router)
app.include_router(option.router)
app.include_router(order.router) # <--- Daftar Router


# --- ENDPOINT UTAMA ---
@app.get("/")
def read_root():
    return {"message": "Server Cafe Berjalan!"}

# --- ENDPOINT LOGIN ---
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Cari user berdasarkan username
    user = db.query(User).filter(User.username == request.username).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Username tidak ditemukan")
    
    # 2. Verifikasi Password (Hash)
    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Password salah")
    
    # 3. Login Sukses
    return {
        "message": "Login Berhasil",
        "username": user.username,
        "role": user.role,
        "id": user.id # Tambahan info ID jika perlu
    }