import os
import datetime
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "")

# ── Metro Congestion Baselines ──────────────────────────────────────────
# Tier-1 and Tier-2 Indian cities with realistic minimum traffic floors.
# These are applied on top of (or as a floor for) the live TomTom reading
# so that demo results match the reality of Indian urban density.
TIER1_CITIES = [
    "mumbai", "delhi", "new delhi", "bangalore", "bengaluru",
    "chennai", "hyderabad", "kolkata", "pune"
]
TIER2_CITIES = [
    "ahmedabad", "jaipur", "lucknow", "kanpur", "nagpur",
    "indore", "bhopal", "visakhapatnam", "vijayawada",
    "patna", "coimbatore", "kochi", "surat", "vadodara"
]

def _ist_hour_now() -> int:
    """Return the current hour in IST (UTC+5:30)."""
    utc_now = datetime.datetime.utcnow()
    ist_now = utc_now + datetime.timedelta(hours=5, minutes=30)
    return ist_now.hour
# Known metro coordinates for proximity-based matching
# (when OpenWeather returns names like "Konkan Division" instead of "Mumbai")
METRO_COORDS = {
    "mumbai":     (19.076, 72.878),
    "delhi":      (28.614, 77.209),
    "bangalore":  (12.972, 77.595),
    "chennai":    (13.083, 80.271),
    "hyderabad":  (17.385, 78.487),
    "kolkata":    (22.573, 88.364),
    "pune":       (18.520, 73.857),
    "ahmedabad":  (23.023, 72.571),
    "jaipur":     (26.912, 75.787),
    "lucknow":    (26.847, 80.947),
    "vijayawada": (16.506, 80.648),
}

def _resolve_metro(city: str, lat: float, lon: float) -> str:
    """
    Try to resolve the actual metro name.
    1. First check if the city string contains a known metro name.
    2. If not, check proximity to known metro coordinates (within ~50km).
    """
    city_lower = city.lower().strip() if city else ""
    
    # Direct name match
    all_metros = TIER1_CITIES + TIER2_CITIES
    for m in all_metros:
        if m in city_lower:
            return m
    
    # Proximity match (0.5 degree ≈ ~55 km)
    for metro_name, (m_lat, m_lon) in METRO_COORDS.items():
        if abs(lat - m_lat) < 0.5 and abs(lon - m_lon) < 0.5:
            return metro_name
    
    return ""

def _metro_baseline(city: str, lat: float = 0.0, lon: float = 0.0) -> float:
    """
    Returns a minimum congestion floor for known Indian metros,
    scaled by time-of-day so night hours are calmer.
    """
    hour = _ist_hour_now()
    metro = _resolve_metro(city, lat, lon)

    # Determine tier
    if metro in TIER1_CITIES:
        # Peak hours (8-11 AM, 5-9 PM)
        if 8 <= hour <= 11 or 17 <= hour <= 21:
            return 5.5
        # Daytime off-peak
        elif 6 <= hour <= 22:
            return 4.0
        # Late night
        else:
            return 2.0
    elif metro in TIER2_CITIES:
        if 8 <= hour <= 11 or 17 <= hour <= 21:
            return 4.0
        elif 6 <= hour <= 22:
            return 3.0
        else:
            return 1.5
    # Unknown / small city – no floor
    return 0.0

def get_traffic_data(lat: float, lon: float, city: str = "Auto"):
    """
    Fetches real-time traffic congestion data from TomTom Traffic Flow API.
    Calculates a 0.0 to 10.0 'Traffic Index' based on the difference between 
    current speed and free flow speed.
    
    For known Indian metros, a congestion floor is applied so that
    demo results reflect real-world urban density (TomTom's point-based
    API can land on a quiet side-street and return near-zero).
    """
    baseline = _metro_baseline(city, lat, lon)
    fallback_traffic = max(2.0, baseline)
    
    if not TOMTOM_API_KEY or TOMTOM_API_KEY == "YOUR_API_KEY_HERE":
        print("Notice: Missing valid TOMTOM_API_KEY. Using metro-baseline traffic data.")
        return fallback_traffic

    # TomTom Traffic Flow Segment Data API (Zoom Level 10 for city-level data)
    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={TOMTOM_API_KEY}&point={lat},{lon}"
    
    try:
        response = requests.get(url, timeout=5.0)
        response.raise_for_status()
        data = response.json()
        
        flow_data = data.get("flowSegmentData", {})
        current_speed = flow_data.get("currentSpeed")
        free_flow_speed = flow_data.get("freeFlowSpeed")
        
        if current_speed is None or free_flow_speed is None or free_flow_speed == 0:
            return fallback_traffic
            
        # Calculate congestion ratio
        speed_ratio = (free_flow_speed - current_speed) / free_flow_speed
        traffic_idx = speed_ratio * 10.0
        raw_idx = max(0.0, min(10.0, round(traffic_idx, 1)))
        
        # Apply metro congestion floor: use whichever is higher
        final_idx = max(raw_idx, baseline)
        
        # Ensure we never return exactly 0.0 (breaks ML feature range)
        return final_idx if final_idx > 0.0 else 1.0
        
    except Exception as e:
        print(f"Error fetching TomTom Traffic data: {e}. Falling back to baseline.")
        return fallback_traffic

def get_weather_data(lat: float, lon: float):
    """
    Fetches real-time weather data from OpenWeatherMap.
    Returns simulated fallback data if API key is missing or request fails.
    """
    fallback_data = {
        "rain_1h": 0.0,
        "temperature": 32.0,
        "condition": "Clear",
        "actual_city": "Unknown"
    }

    if not API_KEY or API_KEY == "YOUR_API_KEY_HERE":
        print("Notice: Missing valid OPENWEATHER_API_KEY. Using simulated weather data.")
        return fallback_data

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    
    try:
        response = requests.get(url, timeout=5.0)
        response.raise_for_status()
        data = response.json()
        
        # OpenWeatherMap returns rain in mm for the last 1 hour if available
        rain = data.get("rain", {}).get("1h", 0.0)
        temp = data.get("main", {}).get("temp", 32.0)
        condition = data.get("weather", [{}])[0].get("main", "Clear")
        
        return {
            "rain_1h": float(rain),
            "temperature": float(temp),
            "condition": condition,
            "actual_city": data.get("name", "Unknown")
        }
    except Exception as e:
        print(f"Error fetching weather data: {e}. Falling back to simulated data.")
        return fallback_data


def get_aqi_data(lat: float, lon: float):
    """
    Fetches real-time Air Quality Index from OpenWeatherMap.
    Returns simulated fallback data if API key is missing or request fails.
    AQI scale (1-5 directly from API or converted to US EPA 0-500 scale for our app).
    """
    fallback_aqi = 60 # Moderate

    if not API_KEY or API_KEY == "YOUR_API_KEY_HERE":
        print("Notice: Missing valid OPENWEATHER_API_KEY. Using simulated AQI data.")
        return fallback_aqi

    url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    
    try:
        response = requests.get(url, timeout=5.0)
        response.raise_for_status()
        data = response.json()
        
        # OpenWeather returns an index from 1 to 5. We will convert it roughly to EPA standard (0-500)
        # 1=Good(0-50), 2=Fair(51-100), 3=Moderate(101-150), 4=Poor(151-200), 5=Very Poor(201-500)
        owm_aqi = data_list = data.get("list", [{}])[0].get("main", {}).get("aqi", 2)
        
        conversion_map = {1: 30, 2: 75, 3: 125, 4: 175, 5: 350}
        return conversion_map.get(owm_aqi, 60)
    except Exception as e:
        print(f"Error fetching AQI data: {e}. Falling back to simulated data.")
        return fallback_aqi

def get_seismic_data(lat: float, lon: float):
    """
    Mock: Simulates checking USGS Earthquake endpoints.
    Normally fetches last 1-hour GeoJSON feed and checks proximity.
    Returns: Tuple (magnitude, distance_km)
    """
    import random
    # Let's say 1% chance there's a minor tremor in a demo, 0.1% chance for major
    rand = random.random()
    if rand > 0.999:
        return (6.5, 12.0)  # Major quake nearby (High risk)
    elif rand > 0.98:
        return (4.2, 45.0)  # Minor tremor
    return (0.0, 999.0)     # Safe

def get_telematics_data(user_id: int):
    """
    Mock: Simulates receiving an IoT Webhook from a gig worker's phone accelerometer.
    Returns simulated G-Force peak.
    """
    import random
    # 0.5% chance per scrape that a rider experiences a >4.5 G-force event (crash)
    if random.random() > 0.995:
        return 5.2 # Hard Crash
    return random.uniform(0.1, 1.2) # Normal movement
