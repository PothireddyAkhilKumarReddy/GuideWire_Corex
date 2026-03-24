from sqlalchemy import text
from database.database import engine

def run_migration():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE users DROP COLUMN zone;"))
            print("Successfully dropped 'zone' column from users table.")
        except Exception as e:
            print(f"Notice: Could not drop zone from users or already dropped. \n{e}")

        try:
            conn.execute(text("ALTER TABLE risk_logs CHANGE COLUMN zone location VARCHAR(150);"))
            print("Successfully changed 'zone' to 'location' in risk_logs table.")
        except Exception as e:
            print(f"Notice: Could not change zone to location in risk_logs or already changed. \n{e}")

if __name__ == "__main__":
    run_migration()
