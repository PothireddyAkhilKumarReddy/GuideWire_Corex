from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Claim, User, Subscription
from services.fraud_service import evaluate_fraud_and_update_trust

router = APIRouter()

class ClaimRequest(BaseModel):
    user_id: int
    risk_level: str
    payout_amount: float
    reason: str = "Environmental Disruption"
    city: str = "Unregistered"
    xai_reason: str = None

@router.post("/trigger-claim")
def trigger_claim(req: ClaimRequest, db: Session = Depends(get_db)):
    if req.risk_level not in ["High", "Severe", "Extreme"] and req.risk_level != "High":
        status = "Rejected"
        fraud_flag = False
        trust_score = 100
        fraud_score = 0
    else:
        # Check fraud engine BEFORE issuing payout
        fraud_flag, trust_score, fraud_score = evaluate_fraud_and_update_trust(db, req.user_id)
        status = "Triggered"
        if fraud_flag:
             status = "Investigating (Fraud Alert)"
    
    # --- BUG FIX: Removed unconditional override of status ---
        
    subscription_consumed = False
    
    # --- ONE CLAIM PER SUBSCRIPTION FEATURE ---
    if status == "Triggered":
        active_sub = db.query(Subscription).filter(Subscription.user_id == req.user_id, Subscription.active == True).first()
        if active_sub:
            active_sub.active = False
            subscription_consumed = True
            
    new_claim = Claim(
        user_id=req.user_id,
        risk_level=req.risk_level,
        reason=req.reason,
        city=req.city,
        claim_status=status,
        xai_reason=req.xai_reason,
        payout_amount=float(req.payout_amount) if status == "Triggered" else 0.0
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    
    if status == "Rejected":
        message = f"Claim not eligible. {req.xai_reason}" if req.xai_reason else "Claim not eligible. Risk level is below threshold."
    else:
        message = "Claim processed and policy consumed" if not fraud_flag else "Claim halted for fraud review"

    return {
        "message": message,
        "claim_id": new_claim.id,
        "trust_score": trust_score,
        "fraud_score": fraud_score,
        "payout": new_claim.payout_amount,
        "status": status,
        "subscription_consumed": subscription_consumed
    }

@router.get("/{user_id}")
def get_user_claims(user_id: int, db: Session = Depends(get_db)):
    claims = db.query(Claim).filter(Claim.user_id == user_id).order_by(Claim.created_at.desc()).all()
    return {"history": claims}
