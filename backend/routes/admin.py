from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import User, Claim

router = APIRouter()

@router.get("/worker-analytics/{user_id}")
def get_worker_analytics(user_id: int, db: Session = Depends(get_db)):
    from models.models import RiskLog, Subscription
    from datetime import datetime, timedelta
    
    # 1. Risk score history (last 20 entries)
    risk_logs = db.query(RiskLog).filter(
        RiskLog.user_id == user_id
    ).order_by(RiskLog.created_at.desc()).limit(20).all()
    
    risk_history = [
        {"score": log.risk_score, "level": log.risk_level, "city": log.city, 
         "date": log.created_at.strftime("%d %b %H:%M") if log.created_at else "N/A"}
        for log in reversed(risk_logs)
    ]
    
    # 2. Claim statistics
    total_claims = db.query(Claim).filter(Claim.user_id == user_id).count()
    approved_claims = db.query(Claim).filter(Claim.user_id == user_id, Claim.claim_status == "Triggered").count()
    rejected_claims = db.query(Claim).filter(Claim.user_id == user_id, Claim.claim_status == "Rejected").count()
    investigating = db.query(Claim).filter(Claim.user_id == user_id, Claim.claim_status.like("%Fraud%")).count()
    
    payout_tuple = db.query(func.sum(Claim.payout_amount)).filter(Claim.user_id == user_id).first()
    total_payouts = round(payout_tuple[0], 2) if payout_tuple and payout_tuple[0] else 0.0
    
    # 3. 7-day claim velocity
    time_7d = datetime.utcnow() - timedelta(days=7)
    weekly_claims = db.query(Claim).filter(Claim.user_id == user_id, Claim.created_at >= time_7d).count()
    velocity_status = "Safe" if weekly_claims < 10 else ("Warning" if weekly_claims < 14 else "Blocked")
    
    # 4. Honor score
    user = db.query(User).filter(User.id == user_id).first()
    honor_score = round(user.trust_score, 1) if user else 100.0
    
    # 5. Active subscription
    active_sub = db.query(Subscription).filter(Subscription.user_id == user_id, Subscription.active == True).first()
    plan_name = active_sub.selected_plan if active_sub else "None"
    
    return {
        "risk_history": risk_history,
        "claim_stats": {
            "total": total_claims,
            "approved": approved_claims,
            "rejected": rejected_claims,
            "investigating": investigating,
            "total_payouts": total_payouts,
        },
        "velocity": {
            "weekly_count": weekly_claims,
            "max_allowed": 14,
            "status": velocity_status,
        },
        "honor_score": honor_score,
        "plan": plan_name,
    }
