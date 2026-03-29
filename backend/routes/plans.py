from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Subscription
import datetime

router = APIRouter()

PLANS_DB = [
    {"name": "Basic", "weekly_premium": 40.0, "coverage_amount": 700.0, "features": ["Low risk locations"]},
    {"name": "Standard", "weekly_premium": 70.0, "coverage_amount": 1200.0, "features": ["Medium risk locations"]},
    {"name": "Premium", "weekly_premium": 100.0, "coverage_amount": 1700.0, "features": ["High risk locations"]},
]

class PlanSelection(BaseModel):
    user_id: int
    plan_name: str

@router.get("/plans")
def get_plans():
    return {"plans": PLANS_DB}

@router.post("/select-plan")
def select_plan(selection: PlanSelection, db: Session = Depends(get_db)):
    plan_meta = next((p for p in PLANS_DB if p["name"].lower() == selection.plan_name.lower()), None)
    if not plan_meta:
        return {"error": "Invalid plan selected"}
        
    sub = Subscription(
        user_id=selection.user_id,
        selected_plan=plan_meta["name"],
        weekly_premium=plan_meta["weekly_premium"],
        coverage_amount=plan_meta["coverage_amount"],
        expiry_date=datetime.datetime.now() + datetime.timedelta(days=7)
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    
    return {"message": f"Successfully enrolled in {plan_meta['name']} plan", "subscription_id": sub.id}
