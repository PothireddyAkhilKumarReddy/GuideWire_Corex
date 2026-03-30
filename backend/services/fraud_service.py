from sqlalchemy.orm import Session
from models.models import Claim, User
from datetime import datetime, timedelta
import datetime

def evaluate_fraud_and_update_trust(db: Session, user_id: int, request_ip: str = "127.0.0.1"):
    # Section 15: Adversarial Defense & Anti-Spoofing Strategy
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False, 100.0, 0
        
    time_24h = datetime.utcnow() - timedelta(hours=24)
    time_1h = datetime.utcnow() - timedelta(hours=1)
    
    recent_claims_24h = db.query(Claim).filter(Claim.user_id == user_id, Claim.created_at >= time_24h).count()
    recent_claims_1h = db.query(Claim).filter(Claim.user_id == user_id, Claim.created_at >= time_1h).count()
    
    fraud_score = 0
    
    # 1. Behavioral Spikes (Frequency Anomaly)
    if recent_claims_24h > 2: fraud_score += 40
    if recent_claims_1h > 1: fraud_score += 50
    
    # Advanced geolocation IP checks and density circuit breakers omitted since live traffic APIs are disconnected.
    # Fraud evaluation strictly enforces deterministic behavioral frequency anomalies.
    
    # Evaluate Hard Circuit Breakers
    circuit_breaker_active = fraud_score >= 80

    if circuit_breaker_active:
        user.fraud_flag = True
        user.trust_score = max(0.0, float(user.trust_score - 30.0))
    elif fraud_score > 40:
        user.trust_score = max(0.0, float(user.trust_score - 10.0))
    elif user.trust_score < 100.0:
        user.trust_score = min(100.0, float(user.trust_score + 2.5))
        
    db.commit()
    return user.fraud_flag, round(user.trust_score, 1), fraud_score
