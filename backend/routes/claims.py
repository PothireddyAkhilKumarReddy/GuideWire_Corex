from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Claim, User, Subscription, WalletTransaction
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
    # --- HONOR SCORE AUTO-BLOCK (Below 40) ---
    user = db.query(User).filter(User.id == req.user_id).first()
    if user and (user.trust_score or 100) < 40:
        return {
            "message": "Account Suspended: Honor Score below 40. No claims allowed until score recovers via passive daily recovery (+0.5/day).",
            "claim_id": None,
            "trust_score": round(user.trust_score, 1),
            "honor_score": round(user.trust_score, 1),
            "fraud_score": 0,
            "payout": 0.0,
            "status": "Blocked",
            "subscription_consumed": False
        }

    # --- 24-Hour Cooldown Enforcer ---
    time_24h_ago = datetime.utcnow() - timedelta(hours=24)
    recent_payout = db.query(Claim).filter(
        Claim.user_id == req.user_id,
        Claim.claim_status.in_(["Triggered", "Investigating (Fraud Alert)", "approved"]),
        Claim.created_at >= time_24h_ago
    ).first()

    # --- 7-Day Claim Velocity Enforcer (14 claims/week max) ---
    time_7d_ago = datetime.utcnow() - timedelta(days=7)
    weekly_claim_count = db.query(Claim).filter(
        Claim.user_id == req.user_id,
        Claim.created_at >= time_7d_ago
    ).count()
    velocity_blocked = weekly_claim_count >= 14

    if velocity_blocked:
        status = "Rejected"
        fraud_flag = False
        trust_score = user.trust_score if user else 100
        fraud_score = 0
        req.xai_reason = f"Velocity Breach: {weekly_claim_count} claims filed in 7 days. Maximum 14 per week allowed. Honor Score penalized."
        update_honor_score(db, req.user_id, "fraud_spike")
    elif recent_payout:
        status = "Rejected"
        fraud_flag = False
        trust_score = user.trust_score if user else 100
        fraud_score = 0
        req.xai_reason = "Policy Cooldown: Maximum 1 automated payout allowed per 24 hours to prevent wallet drain."
    elif req.risk_level not in ["High", "Severe", "Extreme"]:
        status = "Rejected"
        fraud_flag = False
        trust_score = user.trust_score if user else 100
        fraud_score = 0
        if req.risk_level == "Low":
            update_honor_score(db, req.user_id, "rejected_false")
            req.xai_reason = f"False Claim Detected: Risk level is '{req.risk_level}'. Honor Score reduced by 5 points."
    else:
        fraud_flag, trust_score, fraud_score = evaluate_fraud_and_update_trust(db, req.user_id)
        status = "Triggered"
        if fraud_flag:
             status = "Investigating (Fraud Alert)"
    
    subscription_consumed = False
    
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
        # --- WALLET CREDIT: Add payout to user's wallet ---
        if user:
            user.wallet_balance = round((user.wallet_balance or 0) + float(req.payout_amount), 2)
            txn = WalletTransaction(
                user_id=req.user_id,
                amount=float(req.payout_amount),
                txn_type="credit",
                description=f"Claim #{new_claim.id} — {req.reason} ({req.city})"
            )
            db.add(txn)
            db.commit()
    elif req.risk_level == "Geofence Mismatch":
        honor_score = update_honor_score(db, req.user_id, "geofence_spoof")
    elif status == "Rejected" and req.xai_reason and "False Claim" in (req.xai_reason or ""):
        honor_score = update_honor_score(db, req.user_id, "rejected_false")
    elif fraud_flag:
        honor_score = update_honor_score(db, req.user_id, "fraud_spike")
    
    if status == "Rejected":
        message = f"Claim not eligible. {req.xai_reason}" if req.xai_reason else "Claim not eligible. Risk level is below threshold."
    elif status == "Blocked":
        message = "Account suspended due to low Honor Score."
    else:
        message = "Claim approved — payout credited to wallet" if not fraud_flag else "Claim halted for fraud review"

    return {
        "message": message,
        "claim_id": new_claim.id,
        "trust_score": round(float(trust_score), 1),
        "honor_score": round(float(honor_score), 1),
        "fraud_score": fraud_score,
        "payout": new_claim.payout_amount,
        "status": status,
        "subscription_consumed": subscription_consumed,
        "wallet_balance": round(user.wallet_balance or 0, 2) if user else 0
    }

@router.get("/{user_id}")
def get_user_claims(user_id: int, db: Session = Depends(get_db)):
    claims = db.query(Claim).filter(Claim.user_id == user_id).order_by(Claim.created_at.desc()).all()
    return {"history": claims}
