import os
import ssl
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Read DATABASE_URL from environment variable (set on Render for production)
# Falls back to local SQLite for development if no URL provided
raw_url = os.getenv("DATABASE_URL", "sqlite:///./insurgig_dev.db")

# SQLAlchemy 1.4+ requires 'postgresql://' instead of 'postgres://'
if raw_url.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = raw_url.replace("postgres://", "postgresql://", 1)
else:
    SQLALCHEMY_DATABASE_URL = raw_url

# Neon/Cloud DBs require SSL natively defined in the URL, while local SQLite does not
if "sqlite" not in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True, pool_size=5, max_overflow=10, pool_recycle=300)
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
