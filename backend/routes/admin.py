from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import User, Claim

router = APIRouter()

@router.get("/admin/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users": users}

@router.get("/admin/claims")
def get_all_claims(db: Session = Depends(get_db)):
    claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
    return {"claims": claims}

@router.get("/admin/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_claims = db.query(Claim).count()
    
    # Calculate sum of payouts correctly handling nulls
    payout_tuple = db.query(func.sum(Claim.payout_amount)).first()
    total_payouts = payout_tuple[0] if payout_tuple and payout_tuple[0] else 0.0
    
    # Detect fraud attempts globally 
    fraud_accounts = db.query(User).filter(User.fraud_flag == True).count()
    
    return {
        "total_active_coverage": "₹1300Cr", # PRD Mock
        "total_users": total_users,
        "total_claims": total_claims,
        "total_payouts_distributed": f"₹{total_payouts}",
        "detected_fraud_attempts": fraud_accounts
    }
