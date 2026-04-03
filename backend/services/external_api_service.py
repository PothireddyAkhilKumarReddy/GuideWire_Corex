import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "")

def get_traffic_data(lat: float, lon: float):
    """
    Fetches real-time traffic congestion data from TomTom Traffic Flow API.
    Calculates a 0.0 to 10.0 'Traffic Index' based on the difference between 
    current speed and free flow speed.
    """
    fallback_traffic = 2.0
    
    if not TOMTOM_API_KEY or TOMTOM_API_KEY == "YOUR_API_KEY_HERE":
        print("Notice: Missing valid TOMTOM_API_KEY. Using simulated traffic data.")
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
            
        # Calculate congestion ratio: If current is 30mph and free flow is 60mph, ratio is 0.5 (50% slowdown)
        speed_ratio = (free_flow_speed - current_speed) / free_flow_speed
        
        # Convert to a 0-10 index. Ensure it stays between 0.0 and 10.0
        # A 100% crawl (0 mph) equals 10.0 index. Flowing freely equals 0.0 index.
        traffic_idx = speed_ratio * 10.0
        
        # Round and clamp the results
        final_idx = max(0.0, min(10.0, round(traffic_idx, 1)))
        
        # If absolutely no traffic (0.0), return a baseline of 1.0 just to be safe for ML
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
