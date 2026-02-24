from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()

# Cek apakah admin sudah ada
existing_admin = db.query(User).filter(User.username == "admin").first()

if not existing_admin:
    print("Membuat Super Admin...")
    super_admin = User(
        username="admin",
        password=get_password_hash("admin123"), # Password default
        role="SuperAdmin",
        image_url=None
    )
    db.add(super_admin)
    db.commit()
    print("Sukses! Username: admin | Password: admin123")
else:
    print("Admin sudah ada.")

db.close()
