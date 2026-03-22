from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Claim, User
from services.fraud_service import evaluate_fraud_and_update_trust

router = APIRouter()

class ClaimRequest(BaseModel):
    user_id: int
    risk_level: str
    payout_amount: float

@router.post("/trigger-claim")
def trigger_claim(req: ClaimRequest, db: Session = Depends(get_db)):
    if req.risk_level != "High":
        raise HTTPException(status_code=400, detail="Risk level not severe enough to trigger automated claim")
        
    # Check fraud engine BEFORE issuing payout
    fraud_flag, trust_score = evaluate_fraud_and_update_trust(db, req.user_id)
    
    status = "Triggered"
    if fraud_flag:
        status = "Investigating (Fraud Alert)"
        
    new_claim = Claim(
        user_id=req.user_id,
        risk_level=req.risk_level,
        claim_status=status,
        payout_amount=req.payout_amount if not fraud_flag else 0.0
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    
    return {
        "message": "Claim processed" if not fraud_flag else "Claim halted for fraud review",
        "claim_id": new_claim.id,
        "trust_score": trust_score,
        "payout": new_claim.payout_amount,
        "status": status
    }

@router.get("/claims/{user_id}")
def get_user_claims(user_id: int, db: Session = Depends(get_db)):
    claims = db.query(Claim).filter(Claim.user_id == user_id).order_by(Claim.created_at.desc()).all()
    return {"history": claims}
