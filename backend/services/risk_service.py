import datetime
from services.external_api_service import get_weather_data, get_aqi_data

def calculate_risk(city: str, lat: float, lon: float):
    # Fetch real-time environmental data from external API orchestrator
    weather = get_weather_data(lat, lon)
    aqi = get_aqi_data(lat, lon)
    
    rain = weather["rain_1h"]
    heat = weather["temperature"]
    
    # Traffic (Simulated based on time, per specification)
    hour = datetime.datetime.now().hour
    # Peak hours: 8-10 AM and 5-8 PM
    traffic_level = "High" if (8 <= hour <= 10) or (17 <= hour <= 20) else "Low"
    
    # Calculate Risk
    risk_score = 10.0 # Base environmental risk
    risk_level = "Low"
    claim_eligible = False

    # 1. Weather Logic
    if rain > 10.0: # Heavy rain
        risk_score += 80.0
        risk_level = "High"
        claim_eligible = True
    elif heat > 40.0: # Extreme heat
        risk_score += 65.0
        risk_level = "High"
        claim_eligible = True
    elif rain > 2.0: # Moderate rain
        risk_score += 40.0
        risk_level = "Medium"
    
    # 2. AQI Logic
    if aqi > 150: # Poor Air Quality
        risk_score += 35.0
        if risk_level == "Low":
            risk_level = "Medium"
            
    # 3. Traffic Logic
    if traffic_level == "High":
        risk_score += 15.0

    # Cap Score
    final_score = float(risk_score)
    if final_score > 100.0:
        final_score = 100.0
        
    # Calculate recommended dynamic premium explicitly via standard math
    recommended_premium = float(50.0 + (final_score * 0.6))
    
    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "recommended_premium": recommended_premium,
        "claim_eligible": claim_eligible
    }
