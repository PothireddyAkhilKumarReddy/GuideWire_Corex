import datetime
import os
import pickle
import random
import unicodedata
from services.external_api_service import get_weather_data, get_aqi_data

# 🚀 Load the pre-trained Random Forest ML Model into memory via Joblib/Pickle
MODEL_PATH = os.path.join(os.path.dirname(__file__), "risk_model.pkl")
try:
    with open(MODEL_PATH, 'rb') as f:
        ml_model = pickle.load(f)
        # BUG FIX: Prevent Joblib multithreading deadlocks inside FastAPI by capping workers
        if hasattr(ml_model, 'n_jobs'):
            ml_model.n_jobs = 1
except Exception as e:
    ml_model = None
    print(f"⚠️ Warning: Could not load ML model: {e}")

def calculate_risk(city: str, lat: float, lon: float, claim_reason: str = None):
    # Fetch real-time environmental data from external API orchestrator
    weather = get_weather_data(lat, lon)
    aqi = get_aqi_data(lat, lon)
    
    rain = weather["rain_1h"]
    heat = weather["temperature"]
    actual_city = weather.get("actual_city", "Unknown")
    
    # 0. Anti-Spoofing Geofence Check
    def norm_str(s):
        return "".join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c)).lower().strip()

    if actual_city != "Unknown" and norm_str(city) not in norm_str(actual_city) and norm_str(actual_city) not in norm_str(city):
        return {
            "risk_score": 0.0,
            "risk_level": "Geofence Mismatch", 
            "recommended_premium": 0.0,
            "claim_eligible": False,
            "xai_reason": f"Fraud Alert: Hardware coordinates located near {actual_city}.",
            "telemetry": {
                "traffic": "Idx 0.0",
                "rain": "0.0 mm",
                "city": actual_city,
                "location": f"{lat:.4f}, {lon:.4f}"
            }
        }
    
    # Generate ML Features
    # The Model expects: ['rainfall_mm', 'temperature_c', 'aqi', 'traffic_index', 'demand_drop_pct']
    
    # Simulate dynamic features (Traffic 1-10, Demand Drop 0-100)
    hour = datetime.datetime.now().hour
    is_rush_hour = (8 <= hour <= 10) or (17 <= hour <= 20)
    traffic_index = random.uniform(7.0, 10.0) if is_rush_hour else random.uniform(1.0, 5.0)
    demand_drop_pct = random.uniform(30.0, 80.0) if is_rush_hour else random.uniform(0.0, 20.0)
    
    # 🧠 Run Machine Learning Prediction!
    final_score = 15.0 # fallback
    if ml_model:
        # Pass exact 5 features to the RandomForestRegressor
        features = [[rain, heat, aqi, traffic_index, demand_drop_pct]]
        pred = ml_model.predict(features)[0]
        final_score = float(pred)
    else:
        # Fallback math if .pkl is missing
        if rain > 10.0: final_score = 80.0
        elif heat > 40.0: final_score = 70.0
        elif aqi > 200: final_score = 65.0
        
    final_score = min(100.0, max(0.0, final_score))
    
    # Determine Status
    if final_score > 75:
        risk_level = "High"
        claim_eligible = True
    elif final_score > 45:
        risk_level = "Medium"
        claim_eligible = False
    else:
        risk_level = "Low"
        claim_eligible = False
        
    # 🤖 Explainable AI (XAI) Logic
    # Dynamically generate a human-readable reason for the ML engine's decision
    reason_factors = []
    if rain > 20.0: reason_factors.append(f"Heavy Rain ({rain}mm)")
    elif rain > 5.0: reason_factors.append(f"Moderate Rain ({rain}mm)")
    
    if heat > 40.0: reason_factors.append(f"Extreme Heat ({heat}°C)")
    if aqi > 200: reason_factors.append(f"Hazardous AQI ({aqi})")
    if traffic_index > 7.5: reason_factors.append(f"Gridlock Traffic (Idx: {traffic_index:.1f})")
    
    if final_score > 75 and len(reason_factors) >= 2:
        xai_reason = f"Compound Event ⭐: Combined {reason_factors[0]} and {reason_factors[1]}"
    elif reason_factors:
        xai_reason = f"Primary Trigger: {reason_factors[0]}"
    else:
        # User submitted a specific reason, but ML found NO risk
        if claim_reason:
            if "rain" in claim_reason.lower() and rain < 5.0:
                xai_reason = f"False Claim: Only {rain}mm of rainfall recorded in {city}."
            elif "heat" in claim_reason.lower() and heat < 38.0:
                xai_reason = f"False Claim: Temperature ({heat}°C) is within safe bounds."
            elif "pollution" in claim_reason.lower() and aqi < 150:
                xai_reason = f"False Claim: Air quality is completely acceptable (AQI {aqi})."
            elif "traffic" in claim_reason.lower() and traffic_index < 6.0:
                xai_reason = f"False Claim: Traffic is flowing normally (Idx {traffic_index:.1f})."
            else:
                xai_reason = f"False Claim: Baseline parameters do not support a '{claim_reason}'."
        else:
            xai_reason = "Standard Operating Conditions"

    # Calculate actual dynamic premium structurally via AI scoring
    recommended_premium = float(30.0 + (final_score * 0.75))
    
    return {
        "risk_score": round(final_score, 1),
        "risk_level": risk_level,
        "recommended_premium": round(recommended_premium, 2),
        "claim_eligible": claim_eligible,
        "xai_reason": xai_reason,
        "telemetry": {
            "traffic": f"Idx {traffic_index:.1f}",
            "rain": f"{rain} mm",
            "location": f"{lat:.4f}, {lon:.4f}",
            "city": actual_city if actual_city != "Unknown" else city
        }
    }
