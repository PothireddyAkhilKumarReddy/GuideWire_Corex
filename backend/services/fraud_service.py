from sqlalchemy.orm import Session
from models.models import Claim, User
from datetime import datetime, timedelta

def evaluate_fraud_and_update_trust(db: Session, user_id: int):
    # Fetch user constraints
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False, 100.0
        
    # Basic Fraud Logic: Check if user has triggered > 2 claims in the last 24 hours
    time_threshold = datetime.utcnow() - timedelta(hours=24)
    recent_claims = db.query(Claim).filter(Claim.user_id == user_id, Claim.created_at >= time_threshold).count()
    
    if recent_claims > 2:
        user.fraud_flag = True
        user.trust_score = max(0, user.trust_score - 25.0) # Penalty for rapid consecutive claims
    elif user.trust_score < 100.0:
        # Reward resilience (slow recovery over time)
        user.trust_score = min(100.0, user.trust_score + 1.5)
        
    db.commit()
    return user.fraud_flag, user.trust_score
