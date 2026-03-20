# InsurGig AI
AI-Powered Parametric Insurance for India's Gig Delivery Workers

Guidewire DEVTrails Hackathon 2026

## Team: CoreX

- Pothireddy Akhil Kumar Reddy  
- B Manoj Kumar  
- Nagam Teja Narayana Reddy  
- Yamparala Divyesh  
- Maddula Krishna Vamsi  

---

# 1. Problem Statement

India’s gig economy relies heavily on delivery partners working with platforms such as Swiggy, Zomato, Amazon, and Zepto.

However, these workers frequently face external disruptions such as:

- Heavy rain  
- Extreme heat  
- Severe air pollution  
- Traffic congestion  
- Local curfews or zone closures  

These disruptions reduce working hours and cause **loss of income**.

Currently, gig workers do not have insurance protection specifically designed for such income loss.

---

# 2. Persona Scenario

**Persona:** Food Delivery Partner (Swiggy / Zomato)

Ravi is a delivery partner working in Hyderabad.  
He works around 8 hours daily and earns approximately ₹4000 per week.

During heavy rainfall or pollution spikes, deliveries reduce significantly, leading to income loss.

**InsurGig AI provides weekly income protection insurance that automatically compensates workers during such disruptions.**

---

# 3. Proposed Solution

InsurGig AI is an **AI-powered parametric insurance platform**.

It:

- Monitors environmental conditions in real-time  
- Predicts disruption risk using AI  
- Automatically triggers claims when thresholds are met  
- Simulates payouts without manual claim filing  

---

# 4. Application Workflow

1. Worker registers on platform  
2. Selects operating delivery zone  
3. System fetches environmental data  
4. AI calculates disruption risk score  
5. If threshold is exceeded → claim triggered  
6. Claim processed automatically  
7. Payment simulated  

---

# 5. Hyper-Local Risk Zones (Innovation)

Instead of city-wide risk, we divide cities into zones:

Example:

Hyderabad:
- Zone A – High Flood Risk  
- Zone B – Medium Risk  
- Zone C – Low Risk  

Benefits:

- More accurate risk prediction  
- Fair premium pricing  
- Better personalization  

---

# 6. Parametric Triggers

| Trigger | Condition | Impact |
|--------|----------|--------|
| Heavy Rain | Rainfall > 50 mm | Deliveries halted |
| Extreme Heat | Temp > 45°C | Unsafe work |
| Pollution | AQI > 300 | Health risk |
| Traffic | High congestion | Delays |

Claims are triggered automatically when these conditions are met.

---

# 7. Weekly Premium Model

| Risk Level | Premium | Coverage |
|----------|--------|----------|
| Low | ₹35 | ₹1200 |
| Medium | ₹60 | ₹2500 |
| High | ₹90 | ₹4000 |

Premium is dynamically adjusted using AI risk prediction.

---

# 8. AI / Machine Learning Integration

## Risk Prediction

Inputs:

- Rainfall  
- Temperature  
- AQI  
- Traffic  
- Delivery demand (mock)  

Formula:

Risk Score =  
0.4 × weather +  
0.3 × pollution +  
0.2 × traffic +  
0.1 × demand drop  

---

## Dynamic Premium

Higher risk → higher premium  
Lower risk → lower premium  

---

## Fraud Detection

- GPS validation  
- Duplicate claim detection  
- Anomaly detection  
- Behavioral tracking  

---

# 9. External Data Sources

### Weather API
- Rainfall  
- Temperature  

### AQI API
- Air Quality Index  
- Pollution levels  

### Mock Data
- Delivery demand  
- Orders per hour  

---

# 10. System Architecture

Worker App  
↓  
Frontend  
↓  
Backend API  
↓  
Database  
↓  
AI Risk Engine  
↓  
External APIs  
↓  
Claim Processing  
↓  
Payment Simulation  

---

# 11. Technology Stack

- React.js  
- Python (FastAPI)  
- MongoDB  
- Scikit-learn  
- OpenWeather API  
- AQI API  

---

# 12. Repository Structure
InsurGig-AI
│
├── frontend
├── backend
├── architecture.png
├── ai_workflow.png
└── README.md


---

# 13. Development Roadmap

### Phase 1
- Ideation  
- Architecture  
- Documentation  

### Phase 2
- Registration system  
- Premium calculation  
- Claim system  

### Phase 3
- Fraud detection  
- Dashboard  
- Analytics  

---

# 14. Expected Impact

- Financial protection for gig workers  
- Automated insurance system  
- Reduced manual claims  
- Scalable for gig economy  

---

# 15. Adversarial Defense & Anti-Spoofing Strategy

## Problem: Market Crash

Fraudsters spoof GPS and create fake claims, draining funds.

---

## Our Solution

### 1. Multi-Signal Validation

- Device ID tracking  
- IP pattern analysis  
- Session validation  

---

### 2. Behavioral Analysis

Detect anomalies:

- Sudden spikes  
- Unrealistic movement  
- Repeated patterns  

---

### 3. Zone-Level Fraud Detection

- Multiple claims in same zone  
- Sudden surge in claims  

---

### 4. Fraud Risk Score

Fraud Score based on:

- Device  
- Behavior  
- Location  
- Claim frequency  

High score → block/flag claim  

---

### 5. Trust Score System

Each worker gets a trust score:

- High → faster payouts  
- Low → stricter checks  

---

### 6. Circuit Breaker

- Limit claims per zone  
- Pause payouts during anomalies  

---

### 7. Human + AI Review

High-risk claims flagged for manual verification.

---

## Outcome

- Prevents mass fraud attacks  
- Protects system funds  
- Ensures fairness  

---

# 🎥 Demo Video

[]