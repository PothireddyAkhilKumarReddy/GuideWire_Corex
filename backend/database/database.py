from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Default MySQL connection for local development. Make sure your local MySQL server is running!
# Change 'root:password' to match your local MySQL credentials.
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/insurgig_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
