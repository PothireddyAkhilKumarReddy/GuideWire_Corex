def calculate_risk(city: str, zone: str, rain: float, heat: float, aqi: int, traffic_level: str):
    # Normalized weights based on README
    norm_rain = min(100, (rain / 100) * 100)  
    norm_aqi = min(100, (aqi / 400) * 100)    
    
    traffic_mapping = {"severe": 100, "high": 80, "heavy": 80, "moderate": 50, "light": 20}
    norm_traffic = traffic_mapping.get(traffic_level.lower(), 50)
    
    # Mock demand drop percentage assumption
    norm_demand = 50.0 
    
    # Core AI Logic Formula
    # Risk Score = 0.4 * weather(rain/heat) + 0.3 * pollution(aqi) + 0.2 * traffic + 0.1 * demand
    weather_score = norm_rain if rain > 20 else min(100, max(0, ((heat - 30) / 15) * 100))
    risk_score = (0.4 * weather_score) + (0.3 * norm_aqi) + (0.2 * norm_traffic) + (0.1 * norm_demand)
    
    # Base modifier for hyper-local topological zones
    if zone.lower() == "zone a": risk_score += 5
    elif zone.lower() == "zone b": risk_score += 10
    elif zone.lower() == "zone c": risk_score += 15
    
    risk_level = "Low"
    claim_eligible = False
    recommended_premium = 35.0 
    
    if risk_score > 75:
        risk_level = "High"
        claim_eligible = True
        recommended_premium = 90.0
    elif risk_score > 45:
        risk_level = "Medium"
        recommended_premium = 60.0
        
    return {
        "risk_level": risk_level,
        "risk_score": round(risk_score, 2),
        "recommended_premium": recommended_premium,
        "claim_eligible": claim_eligible
    }
