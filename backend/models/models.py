from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    city = Column(String(100))
    role = Column(String(50), default="worker")
    trust_score = Column(Float, default=100.0)
    fraud_flag = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Profile Onboarding Fields
    phone = Column(String(15), nullable=True)
    date_of_birth = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    pincode = Column(String(10), nullable=True)
    aadhaar_number = Column(String(20), nullable=True)
    pan_number = Column(String(20), nullable=True)
    profile_photo = Column(Text, nullable=True)        # Uploaded from device (Base64)
    verification_photo = Column(Text, nullable=True)    # Captured via webcam (Base64)
    profile_complete = Column(Boolean, default=False)

    # Wallet
    wallet_balance = Column(Float, default=0.0)

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    risk_level = Column(String(50))
    reason = Column(String(100), default="Environmental Issue")
    city = Column(String(100), default="Unknown")
    claim_status = Column(String(50), default="Triggered")
    payout_amount = Column(Float, default=0.0)
    xai_reason = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    selected_plan = Column(String(50))
    weekly_premium = Column(Float)
    coverage_amount = Column(Float)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expiry_date = Column(DateTime(timezone=True))

class RiskLog(Base):
    __tablename__ = "risk_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    city = Column(String(100))
    location = Column(String(150))
    risk_score = Column(Float)
    risk_level = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    txn_type = Column(String(20), nullable=False)  # "credit" or "debit"
    description = Column(String(300), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
