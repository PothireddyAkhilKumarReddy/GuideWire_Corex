from sqlalchemy import text
from database.database import engine

def run_migration():
    """Add Phase 3 columns to existing Neon database tables."""
    with engine.begin() as conn:
        # --- Users Table: Profile Onboarding Fields ---
        new_columns = [
            ("phone", "VARCHAR(15)"),
            ("date_of_birth", "VARCHAR(20)"),
            ("address", "VARCHAR(500)"),
            ("aadhaar_number", "VARCHAR(20)"),
            ("profile_photo", "TEXT"),
            ("verification_photo", "TEXT"),
            ("profile_complete", "BOOLEAN DEFAULT FALSE"),
            ("wallet_balance", "FLOAT DEFAULT 0.0"),
        ]
        
        for col_name, col_type in new_columns:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type};"))
                print(f"  [+] Added '{col_name}' to users table.")
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    print(f"  [-] '{col_name}' already exists in users table.")
                else:
                    print(f"  [!] Error adding '{col_name}': {e}")

        # --- Create wallet_transactions table ---
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS wallet_transactions (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    amount FLOAT NOT NULL,
                    txn_type VARCHAR(20) NOT NULL,
                    description VARCHAR(300),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            """))
            print("  [+] wallet_transactions table ready.")
        except Exception as e:
            print(f"  [-] wallet_transactions: {e}")

        print("\n[OK] Phase 3 migration complete!")

if __name__ == "__main__":
    run_migration()
