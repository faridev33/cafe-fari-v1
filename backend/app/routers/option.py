from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.option import ProductOption, OptionChoice
from app.schemas.option import OptionCreate, OptionResponse

router = APIRouter(
    prefix="/options",
    tags=["Product Options"]
)

# 1. GET OPTIONS BY PRODUCT ID
@router.get("/{product_id}", response_model=List[OptionResponse])
def get_options(product_id: int, db: Session = Depends(get_db)):
    options = db.query(ProductOption).filter(ProductOption.product_id == product_id).all()
    return options

# 2. SAVE OPTIONS (Hapus lama, Simpan baru - cara paling mudah untuk update struktur kompleks)
@router.post("/{product_id}")
def save_product_options(product_id: int, options: List[OptionCreate], db: Session = Depends(get_db)):
    # 1. Hapus semua opsi lama untuk produk ini (agar bersih)
    old_options = db.query(ProductOption).filter(ProductOption.product_id == product_id).all()
    for opt in old_options:
        db.delete(opt)
    db.commit()

    # 2. Simpan opsi baru
    for opt_data in options:
        # Buat Header Opsi (Misal: Topping)
        new_option = ProductOption(product_id=product_id, name=opt_data.name)
        db.add(new_option)
        db.commit()
        db.refresh(new_option)

        # Buat Pilihan Opsi (Misal: Keju +2000)
        for choice in opt_data.choices:
            new_choice = OptionChoice(
                option_id=new_option.id,
                name=choice.name,
                extra_price=choice.extra_price
            )
            db.add(new_choice)
        
    db.commit()
    return {"message": "Options saved successfully"}