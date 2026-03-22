from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import RiskLog
from services.risk_service import calculate_risk

router = APIRouter()

class RiskRequest(BaseModel):
    user_id: int
    city: str
    zone: str
    rain: float
    heat: float
    aqi: int
    traffic_level: str

@router.post("/calculate-risk")
def check_risk(request: RiskRequest, db: Session = Depends(get_db)):
    # Run paramtric analysis
    results = calculate_risk(
        city=request.city,
        zone=request.zone,
        rain=request.rain,
        heat=request.heat,
        aqi=request.aqi,
        traffic_level=request.traffic_level
    )
    
    # Store the telemetry event into the database
    log = RiskLog(
        user_id=request.user_id,
        city=request.city,
        zone=request.zone,
        risk_score=results["risk_score"],
        risk_level=results["risk_level"]
    )
    db.add(log)
    db.commit()
    
    return results
