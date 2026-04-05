from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import User, Subscription
from services.auth_service import get_password_hash, verify_password, create_access_token
from services.fraud_service import calculate_passive_recovery
from pydantic import BaseModel
import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    city: str
    role: str = "worker"

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        city=user.city,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Enforce precise expiration rules    # Check active subscription honoring the new single-use policy flag!
    active_sub = db.query(Subscription).filter(
        Subscription.user_id == db_user.id, 
        Subscription.expiry_date > datetime.datetime.now(),
        Subscription.active == True
    ).order_by(Subscription.id.desc()).first()
    
    sub_data = None
    if active_sub:
        sub_data = {
            "plan": active_sub.selected_plan,
            "premium": active_sub.weekly_premium,
            "coverage": active_sub.coverage_amount,
            "expiry": active_sub.expiry_date.strftime('%d/%m/%Y'),
            "activatedOn": active_sub.created_at.strftime('%d/%m/%Y') if active_sub.created_at else datetime.datetime.now().strftime('%d/%m/%Y')
        }

    # Calculate passive Honor Score recovery
    honor_score = calculate_passive_recovery(db, db_user.id)

    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role, "user_id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer", "name": db_user.name, "role": db_user.role, "user_id": db_user.id, "subscription": sub_data, "honor_score": honor_score, "profile_complete": db_user.profile_complete or False, "wallet_balance": round(db_user.wallet_balance or 0, 2)}

class GoogleToken(BaseModel):
    token: str

@router.post("/google")
def google_auth(data: GoogleToken, db: Session = Depends(get_db)):
    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        idinfo = id_token.verify_oauth2_token(
            data.token, 
            google_requests.Request(), 
            client_id, 
            clock_skew_in_seconds=10
        )
        
        email = idinfo['email']
        name = idinfo.get('name', 'User')
        
        db_user = db.query(User).filter(User.email == email).first()
        if not db_user:
            # Create user automatically if it doesn't exist
            db_user = User(
                name=name,
                email=email,
                password=get_password_hash(str(uuid.uuid4())),
                city="Unknown",
                role="worker"
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
        # Standard login logic
        active_sub = db.query(Subscription).filter(
            Subscription.user_id == db_user.id, 
            Subscription.expiry_date > datetime.datetime.now(),
            Subscription.active == True
        ).order_by(Subscription.id.desc()).first()
        
        sub_data = None
        if active_sub:
            sub_data = {
                "plan": active_sub.selected_plan,
                "premium": active_sub.weekly_premium,
                "coverage": active_sub.coverage_amount,
                "expiry": active_sub.expiry_date.strftime('%d/%m/%Y'),
                "activatedOn": active_sub.created_at.strftime('%d/%m/%Y') if active_sub.created_at else datetime.datetime.now().strftime('%d/%m/%Y')
            }

        honor_score = calculate_passive_recovery(db, db_user.id)
        access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role, "user_id": db_user.id})
        
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "name": db_user.name, 
            "role": db_user.role, 
            "user_id": db_user.id, 
            "subscription": sub_data, 
            "honor_score": honor_score, 
            "profile_complete": db_user.profile_complete or False, 
            "wallet_balance": round(db_user.wallet_balance or 0, 2)
        }
            
    except ValueError as e:
        print("GOOGLE AUTH VALUE ERROR:", e)
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {e}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("GOOGLE AUTH GENERAL ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

