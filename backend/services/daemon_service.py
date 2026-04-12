import datetime
from sqlalchemy.orm import Session
from database.database import SessionLocal
from models.models import User, Subscription, Claim, WalletTransaction
from services.risk_service import calculate_risk
from services.external_api_service import get_seismic_data, get_telematics_data
from services.fraud_service import update_honor_score

def run_autonomous_sweep():
    print(f"[{datetime.datetime.now()}] Overlord Daemon sweeping live users...")
    db: Session = SessionLocal()
    try:
        # Get active subscriptions
        active_subs = db.query(Subscription).filter(
            Subscription.active == True,
            Subscription.expiry_date > datetime.datetime.now()
        ).all()
        
        for sub in active_subs:
            user = db.query(User).filter(User.id == sub.user_id).first()
            if not user or user.trust_score < 40:
                continue # Suspended or missing
            
            # 1. Default to user location or fallback. (Hardcoded Hyderabad for demo safety)
            lat, lon = (17.3850, 78.4867) 
            
            try:
                # 2. Risk check (Heavy API Calls)
                risk_data = calculate_risk(
                    city="Auto",
                    lat=lat,
                    lon=lon,
                    claim_reason="Automated Daemon Probe"
                )
                
                # Check Advanced AI Triggers (Seismic & Telematics)
                seismic_mag, dist = get_seismic_data(lat, lon)
                g_force = get_telematics_data(user.id)
                
                trigger_reason = None
                payout = 0.0
                
                if risk_data["risk_level"] == "High":
                    trigger_reason = f"Severe Environmental Risk - {risk_data.get('xai_reason', 'Threshold Breached')}"
                    payout = sub.coverage_amount
                elif seismic_mag > 5.0 and dist < 50.0:
                    trigger_reason = f"Autonomous Seismic Trigger: {seismic_mag} Mag EQ detected."
                    risk_data["risk_level"] = "High"
                    payout = float(sub.coverage_amount) * 1.5 # Boosted payout for EQ
                elif g_force > 4.5:
                    trigger_reason = f"IoT Telematics Crash Alert (G-Force: {g_force:.1f})"
                    risk_data["risk_level"] = "High"
                    payout = sub.coverage_amount
                    
                if trigger_reason:
                    # Prevent velocity/cooldown breaches
                    time_24h_ago = datetime.datetime.utcnow() - datetime.timedelta(hours=24)
                    recent_payout = db.query(Claim).filter(
                        Claim.user_id == user.id,
                        Claim.claim_status.in_(["Triggered", "approved"]),
                        Claim.created_at >= time_24h_ago
                    ).first()
                    
                    if not recent_payout:
                        print(f"THREAT DETECTED FOR USER {user.id}. TRIGGERING {trigger_reason}")
                        # CREATE CLAIM
                        new_claim = Claim(
                            user_id=user.id,
                            risk_level="High",
                            reason="Autonomous Oracle Interception",
                            city="Auto",
                            claim_status="Triggered",
                            xai_reason=trigger_reason,
                            payout_amount=float(payout)
                        )
                        db.add(new_claim)
                        
                        # Add Wallet Balance
                        user.wallet_balance = float(user.wallet_balance or 0) + float(payout)
                        txn = WalletTransaction(
                            user_id=user.id,
                            amount=float(payout),
                            txn_type="credit",
                            description=f"Autonomous AI Payout: {trigger_reason}"
                        )
                        db.add(txn)
                        
                        # Honor Score Boost for proven autonomous event
                        update_honor_score(db, user.id, "approved")
                        
                        db.commit()
                        print(f"{payout} released to Wallet #{user.id}")
            except Exception as e:
                print(f"Daemon Error checking user {user.id}: {e}")
                
    finally:
        db.close()
    
    print(f"[{datetime.datetime.now()}] Sweep Complete.")
