from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database.database import engine, Base, get_db

# Import Routers
from routes import auth, risk, claims, plans, admin, profile, wallet, payment

from apscheduler.schedulers.background import BackgroundScheduler
from services.daemon_service import run_autonomous_sweep
from contextlib import asynccontextmanager

# Initialize DB Tables
Base.metadata.create_all(bind=engine)

# Setup Autonomous Daemon
scheduler = BackgroundScheduler()
scheduler.add_job(run_autonomous_sweep, 'interval', minutes=2)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting InsurGig AI Server & Autonomous Daemon...")
    scheduler.start()
    yield
    print("Shutting down Daemon...")
    scheduler.shutdown()

app = FastAPI(title="InsurGig AI API", description="Predictive Security & Automated Claims for Gig Workers", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk Engine"])
app.include_router(claims.router, prefix="/api/claims", tags=["Claims"])
app.include_router(plans.router, prefix="/api/plans", tags=["Plans"])
app.include_router(admin.router, prefix="/api/dashboard", tags=["Analytics"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(wallet.router, prefix="/api/wallet", tags=["Wallet"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])

@app.api_route("/", methods=["GET", "HEAD"])
def root(db = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        pass
    return {"message": "InsurGig AI API & Neon Database are Active."}
