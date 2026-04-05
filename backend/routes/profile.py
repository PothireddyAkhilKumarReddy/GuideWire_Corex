from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import User
from typing import Optional

router = APIRouter()

class ProfileCompleteRequest(BaseModel):
    user_id: int
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    profile_photo: Optional[str] = None      # Base64 from file upload
    verification_photo: Optional[str] = None  # Base64 from webcam capture

class ProfileUpdateRequest(BaseModel):
    user_id: int
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None

@router.post("/complete")
def complete_profile(req: ProfileCompleteRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if req.phone: user.phone = req.phone
    if req.date_of_birth: user.date_of_birth = req.date_of_birth
    if req.address: user.address = req.address
    if req.pincode: user.pincode = req.pincode
    if req.aadhaar_number: user.aadhaar_number = req.aadhaar_number
    if req.pan_number: user.pan_number = req.pan_number
    if req.profile_photo: user.profile_photo = req.profile_photo
    if req.verification_photo:
        user.verification_photo = req.verification_photo
    
    user.profile_complete = True
    db.commit()
    return {"message": "Profile completed successfully", "profile_complete": True}

@router.put("/update")
def update_profile(req: ProfileUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if req.phone is not None: user.phone = req.phone
    if req.date_of_birth is not None: user.date_of_birth = req.date_of_birth
    if req.address is not None: user.address = req.address
    if req.city is not None: user.city = req.city
    if req.pincode is not None: user.pincode = req.pincode
    if req.aadhaar_number is not None: user.aadhaar_number = req.aadhaar_number
    if req.pan_number is not None: user.pan_number = req.pan_number
    
    db.commit()
    return {"message": "Profile updated successfully"}

@router.get("/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Send a small thumbnail of the photo (first 200 chars of base64 header + enough for a tiny preview)
    # The full photo is only needed rarely, this keeps the response fast
    photo_thumb = None
    if user.profile_photo:
        photo_thumb = user.profile_photo  # Keep full for now since it's used in profile view
    
    return {
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "date_of_birth": user.date_of_birth,
        "address": user.address,
        "pincode": user.pincode,
        "aadhaar_number": user.aadhaar_number,
        "pan_number": user.pan_number,
        "city": user.city,
        "profile_photo": photo_thumb,
        "profile_complete": user.profile_complete,
        "honor_score": round(user.trust_score, 1),
        "wallet_balance": round(user.wallet_balance or 0, 2),
        "created_at": user.created_at.strftime("%d/%m/%Y") if user.created_at else None
    }
