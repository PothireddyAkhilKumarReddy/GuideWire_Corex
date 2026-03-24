import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

def get_weather_data(lat: float, lon: float):
    """
    Fetches real-time weather data from OpenWeatherMap.
    Returns simulated fallback data if API key is missing or request fails.
    """
    fallback_data = {
        "rain_1h": 0.0,
        "temperature": 32.0,
        "condition": "Clear"
    }

    if not API_KEY or API_KEY == "YOUR_API_KEY_HERE":
        print("Notice: Missing valid OPENWEATHER_API_KEY. Using simulated weather data.")
        return fallback_data

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    
    try:
        response = requests.get(url, timeout=2.0)
        response.raise_for_status()
        data = response.json()
        
        # OpenWeatherMap returns rain in mm for the last 1 hour if available
        rain = data.get("rain", {}).get("1h", 0.0)
        temp = data.get("main", {}).get("temp", 32.0)
        condition = data.get("weather", [{}])[0].get("main", "Clear")
        
        return {
            "rain_1h": float(rain),
            "temperature": float(temp),
            "condition": condition
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
        response = requests.get(url, timeout=2.0)
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
