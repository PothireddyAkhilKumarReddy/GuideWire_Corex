from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    city = Column(String(100))
    zone = Column(String(50))
    role = Column(String(50), default="worker") # worker / admin
    trust_score = Column(Float, default=100.0)
    fraud_flag = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    risk_level = Column(String(50))
    claim_status = Column(String(50), default="Triggered") # Monitoring -> Eligible -> Triggered -> Processed
    payout_amount = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    selected_plan = Column(String(50)) # Basic, Standard, Premium
    weekly_premium = Column(Float)
    coverage_amount = Column(Float)
    active = Column(Boolean, default=True)

class RiskLog(Base):
    __tablename__ = "risk_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    city = Column(String(100))
    zone = Column(String(50))
    risk_score = Column(Float)
    risk_level = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
