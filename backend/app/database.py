from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Gunakan 127.0.0.1 agar Windows tidak bingung
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:0909@127.0.0.1/cafe_db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"options": "-c client_encoding=utf8"} 
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()