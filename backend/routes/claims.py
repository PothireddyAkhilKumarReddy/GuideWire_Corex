from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Claim, User, Subscription
from services.fraud_service import evaluate_fraud_and_update_trust, update_honor_score
from datetime import datetime, timedelta

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
    # --- 24-Hour Cooldown Enforcer ---
    time_24h_ago = datetime.utcnow() - timedelta(hours=24)
    recent_payout = db.query(Claim).filter(
        Claim.user_id == req.user_id,
        Claim.claim_status.in_(["Triggered", "Investigating (Fraud Alert)", "approved"]),
        Claim.created_at >= time_24h_ago
    ).first()

    if recent_payout:
        status = "Rejected"
        fraud_flag = False
        trust_score = 100
        fraud_score = 0
        req.xai_reason = "Policy Cooldown: Maximum 1 automated payout allowed per 24 hours to prevent wallet drain."
    elif req.risk_level not in ["High", "Severe", "Extreme"] and req.risk_level != "High":
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
    
    subscription_consumed = False
    
    # --- CONTINUOUS POLICY FEATURE ---
    if status == "Triggered":
        active_sub = db.query(Subscription).filter(Subscription.user_id == req.user_id, Subscription.active == True).first()
        if active_sub:
            subscription_consumed = False
            
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
    
    # --- HONOR SCORE ADJUSTMENT ---
    honor_score = trust_score
    if status == "Triggered" and not fraud_flag:
        honor_score = update_honor_score(db, req.user_id, "approved")
    elif req.risk_level == "Geofence Mismatch":
        honor_score = update_honor_score(db, req.user_id, "geofence_spoof")
    elif status == "Rejected" and req.xai_reason and "False Claim" in (req.xai_reason or ""):
        honor_score = update_honor_score(db, req.user_id, "rejected_false")
    elif fraud_flag:
        honor_score = update_honor_score(db, req.user_id, "fraud_spike")
    
    if status == "Rejected":
        message = f"Claim not eligible. {req.xai_reason}" if req.xai_reason else "Claim not eligible. Risk level is below threshold."
    else:
        message = "Claim processed and policy consumed" if not fraud_flag else "Claim halted for fraud review"

    return {
        "message": message,
        "claim_id": new_claim.id,
        "trust_score": trust_score,
        "honor_score": honor_score,
        "fraud_score": fraud_score,
        "payout": new_claim.payout_amount,
        "status": status,
        "subscription_consumed": subscription_consumed
    }

@router.get("/{user_id}")
def get_user_claims(user_id: int, db: Session = Depends(get_db)):
    claims = db.query(Claim).filter(Claim.user_id == user_id).order_by(Claim.created_at.desc()).all()
    return {"history": claims}

