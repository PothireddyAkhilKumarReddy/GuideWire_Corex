from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

# Allow frontend to access the backend easily
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to get database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",  # Match user's MySQL workbench password
            database="insurgig_db"
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None

# Pydantic model for validating incoming registration data
class Worker(BaseModel):
    name: str
    city: str
    zone: str

@app.on_event("startup")
def startup_db_client():
    # Attempt to create table automatically on startup to keep it simple
    conn = get_db_connection()
    if conn:
        print("Successfully connected to MySQL database: insurgig_db")
        try:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS workers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    city VARCHAR(255) NOT NULL,
                    zone VARCHAR(255) NOT NULL
                )
            ''')
            conn.commit()
            cursor.close()
        except Exception as e:
            print(f"Could not create table automatically: {e}")
        finally:
            conn.close()
    else:
        print("Warning: Could not connect to MySQL database insurgig_db. Ensure it is created.")

@app.post("/register")
def register_worker(worker: Worker):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        query = "INSERT INTO workers (name, city, zone) VALUES (%s, %s, %s)"
        values = (worker.name, worker.city, worker.zone)
        cursor.execute(query, values)
        conn.commit()
        worker_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return {"message": "Worker successfully registered", "id": worker_id}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))

@app.get("/risk")
def get_risk():
    return {
        "risk": "High",
        "premium": 90,
        "claim": "Triggered"
    }
