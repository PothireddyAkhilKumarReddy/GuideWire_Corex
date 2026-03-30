from sqlalchemy.orm import Session
from models.models import Claim, User
from datetime import datetime, timedelta

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
    
    # Evaluate Hard Circuit Breakers
    circuit_breaker_active = fraud_score >= 80

    if circuit_breaker_active:
        user.fraud_flag = True
        user.trust_score = max(0.0, float(user.trust_score - 30.0))
    elif fraud_score > 40:
        user.trust_score = max(0.0, float(user.trust_score - 10.0))
        
    db.commit()
    return user.fraud_flag, round(user.trust_score, 1), fraud_score


def update_honor_score(db: Session, user_id: int, event: str):
    """
    Adjusts the user's Honor Score based on claim outcomes.
    Events: 'approved', 'rejected_false', 'geofence_spoof', 'fraud_spike'
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return 100.0
    
    adjustments = {
        "approved": 3.0,
        "rejected_false": -5.0,
        "geofence_spoof": -15.0,
        "fraud_spike": -10.0
    }
    
    delta = adjustments.get(event, 0.0)
    user.trust_score = max(0.0, min(100.0, float(user.trust_score + delta)))
    db.commit()
    return round(user.trust_score, 1)


def calculate_passive_recovery(db: Session, user_id: int):
    """
    Awards +0.5 per full calendar day since the user's last successful claim (or account creation).
    Called once on login. Capped at 100.0.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.trust_score >= 100.0:
        return round(user.trust_score, 1) if user else 100.0
    
    # Find the user's most recent claim to determine last activity
    last_claim = db.query(Claim).filter(Claim.user_id == user_id).order_by(Claim.created_at.desc()).first()
    last_activity = last_claim.created_at if last_claim else user.created_at
    
    if last_activity:
        days_elapsed = (datetime.utcnow() - last_activity).days
        if days_elapsed > 0:
            recovery = days_elapsed * 0.5
            user.trust_score = min(100.0, float(user.trust_score + recovery))
            db.commit()
    
    return round(user.trust_score, 1)
