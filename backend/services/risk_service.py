def calculate_risk(city: str, zone: str, rain: float, heat: float, aqi: int, traffic_level: str):
    risk_score = 0.0
    
    # Simple scoring logic per PRD requirements
    if rain > 50: # Heavy rain
        risk_score += 40
    elif rain > 20: 
        risk_score += 20
        
    if heat > 40: # Extreme heat
        risk_score += 35
    elif heat > 35:
        risk_score += 15
        
    if aqi > 300: # Hazardous AQI
        risk_score += 30
    elif aqi > 200:
        risk_score += 15
        
    if traffic_level.lower() == "severe":
        risk_score += 25
    elif traffic_level.lower() == "heavy":
        risk_score += 10
        
    # Baseline modifier for zones
    if zone.lower() == "zone a":
        risk_score += 5
    elif zone.lower() == "zone b":
        risk_score += 10
    elif zone.lower() == "zone c":
        risk_score += 20
        
    # Determine Level based on score
    risk_level = "Low"
    claim_eligible = False
    recommended_premium = 35.0 # Basic baseline
    
    if risk_score > 75:
        risk_level = "High"
        claim_eligible = True
        recommended_premium = 90.0
    elif risk_score > 40:
        risk_level = "Medium"
        recommended_premium = 60.0
        
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "recommended_premium": recommended_premium,
        "claim_eligible": claim_eligible
    }
