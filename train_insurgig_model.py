import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# -------------------------------------------------------------
# InsurGig AI: Predictive Risk Model Training Script (Google Colab)
# -------------------------------------------------------------
# Instructions:
# 1. Run this in Google Colab or your local environment.
# 2. It synthesizes a mock historical dataset representing gig worker disruptions.
# 3. It trains a Random Forest model using the formula weights from the README.
# 4. Finally, it exports 'risk_model.pkl' which you can drop into the FastAPI backend!
# -------------------------------------------------------------

print("🔧 Generating synthetic InsurGig historical dataset...")

# Generate 5,000 synthetic rows
np.random.seed(42)
n_samples = 5000

# Ranges based on Indian cities
rainfall = np.random.uniform(0, 150, n_samples)  # mm
temperature = np.random.uniform(20, 50, n_samples)  # Celsius
aqi = np.random.uniform(50, 500, n_samples)  # Air Quality Index
traffic_index = np.random.uniform(1, 10, n_samples) # 1-10 congestion scale
demand_drop_pct = np.random.uniform(0, 100, n_samples) # % drop in orders

# Determine Target 'Risk Score' (0-100) using README weights
# Normalizing inputs to a 0-100 scale to match the percentage weights
norm_rain = np.clip((rainfall / 100) * 100, 0, 100)
norm_temp = np.clip(((temperature - 20) / 25) * 100, 0, 100)
norm_aqi = np.clip((aqi / 400) * 100, 0, 100)
norm_traffic = (traffic_index / 10) * 100
norm_demand = demand_drop_pct

# Target Array calculation
risk_scores = (
    0.4 * norm_rain + 
    0.3 * norm_aqi + 
    0.2 * norm_traffic + 
    0.1 * norm_demand
)

# Add random noise to simulate real-world variance
risk_scores += np.random.normal(0, 5, n_samples)
risk_scores = np.clip(risk_scores, 0, 100)

# Build DataFrame
data = pd.DataFrame({
    'rainfall_mm': rainfall,
    'temperature_c': temperature,
    'aqi': aqi,
    'traffic_index': traffic_index,
    'demand_drop_pct': demand_drop_pct,
    'risk_score': risk_scores
})

print("✅ Dataset generated successfully!")
print(data.head())

# Split Data
X = data.drop('risk_score', axis=1)
y = data['risk_score']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\n🧠 Training Random Forest Regressor Model...")
model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f"\n📊 Model Accuracy Metrics:")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"R2 Variance Score: {r2:.4f} (Closer to 1 is better!)")

# Export to .pkl for FastAPI backend
filename = 'risk_model.pkl'
with open(filename, 'wb') as file:
    pickle.dump(model, file)

print(f"\n🚀 SUCCESS: Model saved as '{filename}'!")
print(f"Move '{filename}' into your InsurGig backend 'services/' directory.")
