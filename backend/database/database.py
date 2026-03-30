import os
import ssl
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Read DATABASE_URL from environment variable (set on Render for production)
# Falls back to local MySQL for development
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:root@localhost:3306/insurgig_db"
)

# Aiven and other cloud MySQL providers require SSL
# Detect if we're using a cloud DB (not localhost)
if "localhost" not in SQLALCHEMY_DATABASE_URL and "127.0.0.1" not in SQLALCHEMY_DATABASE_URL:
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        connect_args={"ssl": ssl_context}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
