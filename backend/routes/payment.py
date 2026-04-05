import os
import stripe
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import User, Subscription
import datetime

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

class CheckoutRequest(BaseModel):
    user_id: int
    plan_name: str
    premium: float
    coverage: float

@router.post("/create-checkout-session")
def create_checkout_session(req: CheckoutRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Frontend URL for redirect after payment
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": f"InsurGig AI — {req.plan_name} Plan",
                        "description": f"Weekly Premium: ₹{int(req.premium)} | Coverage: ₹{int(req.coverage)}",
                    },
                    "unit_amount": int(req.premium * 100),  # Stripe uses paise (smallest currency unit)
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{frontend_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}&plan={req.plan_name}&premium={int(req.premium)}&coverage={int(req.coverage)}&user_id={req.user_id}",
            cancel_url=f"{frontend_url}/plans",
            customer_email=user.email,
            metadata={
                "user_id": str(req.user_id),
                "plan_name": req.plan_name,
                "premium": str(req.premium),
                "coverage": str(req.coverage),
            }
        )
        return {"checkout_url": session.url, "session_id": session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-session")
def verify_session(data: dict, db: Session = Depends(get_db)):
    session_id = data.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == "paid":
            # Stripe v15: StripeObject uses _to_dict_recursive() to convert to plain dict
            try:
                metadata = session.metadata._to_dict_recursive() if session.metadata else {}
            except Exception:
                # Fallback: access keys directly via getattr
                metadata = None
            
            if metadata:
                user_id = int(metadata.get("user_id", 0))
                plan_name = metadata.get("plan_name", "Basic")
                premium = float(metadata.get("premium", 40))
                coverage = float(metadata.get("coverage", 700))
            else:
                user_id = int(getattr(session.metadata, 'user_id', 0))
                plan_name = getattr(session.metadata, 'plan_name', 'Basic')
                premium = float(getattr(session.metadata, 'premium', 40))
                coverage = float(getattr(session.metadata, 'coverage', 700))
            
            # Check if subscription already created for this session
            existing = db.query(Subscription).filter(
                Subscription.user_id == user_id,
                Subscription.active == True
            ).first()
            
            if existing:
                existing.selected_plan = plan_name
                existing.weekly_premium = premium
                existing.coverage_amount = coverage
                existing.expiry_date = datetime.datetime.now() + datetime.timedelta(days=7)
            else:
                new_sub = Subscription(
                    user_id=user_id,
                    selected_plan=plan_name,
                    weekly_premium=premium,
                    coverage_amount=coverage,
                    active=True,
                    expiry_date=datetime.datetime.now() + datetime.timedelta(days=7)
                )
                db.add(new_sub)
            
            db.commit()
            
            return {
                "status": "paid",
                "plan": plan_name,
                "premium": premium,
                "coverage": coverage,
                "message": f"Payment verified! {plan_name} plan activated."
            }
        else:
            return {"status": "unpaid", "message": "Payment not completed yet."}
    except Exception as e:
        import traceback
        with open("error_trace.txt", "w") as f:
            f.write(traceback.format_exc())
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
