from app.database import engine, Base
from app.models.user import User  # Import model agar terdeteksi
from sqlalchemy import text

print("--- MEMULAI PERBAIKAN DATABASE ---")

# 1. Hapus Tabel Lama (DROP)
with engine.connect() as conn:
    print("1. Menghapus tabel 'users' lama...")
    conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
    conn.commit()
    print("   -> Tabel berhasil dihapus.")

# 2. Buat Tabel Baru (CREATE)
print("2. Membuat tabel 'users' baru dengan struktur terbaru...")
Base.metadata.create_all(bind=engine)
print("   -> Tabel baru berhasil dibuat (Kolom image_url sudah ada).")

print("--- SELESAI ---")