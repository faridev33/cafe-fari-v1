from app.database import engine
from sqlalchemy import text

# Script untuk menghapus tabel orders agar bisa dibuat ulang dengan kolom baru
def reset_orders_table():
    with engine.connect() as conn:
        print("Menghapus tabel 'orders' lama...")
        conn.execute(text("DROP TABLE IF EXISTS orders CASCADE"))
        conn.commit()
        print("✅ Tabel orders berhasil dihapus.")
        print("Silakan jalankan ulang 'uvicorn' untuk membuat tabel baru secara otomatis.")

if __name__ == "__main__":
    reset_orders_table()