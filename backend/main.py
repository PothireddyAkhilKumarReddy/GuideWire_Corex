from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base

# Import Routers
from routes import auth, risk, claims, plans, admin

# Initialize DB Tables directly (in a real production app use Alembic for migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="InsurGig AI API", description="Predictive Security & Automated Claims for Gig Workers")

# Configure CORS for React frontend connecting from localhost during demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk Engine"])
app.include_router(claims.router, prefix="/api/claims", tags=["Claims"])
app.include_router(plans.router, prefix="/api/plans", tags=["Plans"])
app.include_router(admin.router, prefix="/api/dashboard", tags=["Admin"])

@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "InsurGig Sentinel API is Active. All Node Health normal."}
