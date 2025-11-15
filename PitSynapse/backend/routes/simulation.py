# backend/routes/simulation.py
from fastapi import APIRouter
from ..services import simulation_runner

router = APIRouter()

@router.get("/test")
def test_route():
    return {"status": "simulation route active"}

@router.get("/run")
def run():
    return simulation_runner.run_simulation()
