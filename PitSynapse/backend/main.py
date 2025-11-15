# paste the content here
# backend/main.py
from fastapi import FastAPI
from .services import simulation_runner

from backend.routes.simulation import app as simulation_app

app = FastAPI(title="PitSynapse API")

# Register routes
app.include_router(simulation_runner, prefix="/simulation")

# Optional root endpoint
@app.get("/")
def root():
    return {"message": "PitSynapse backend running"}
