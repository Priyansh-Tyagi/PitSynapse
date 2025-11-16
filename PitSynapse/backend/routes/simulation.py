from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator
import asyncio
from typing import List, Dict, Any, Optional
from ..services.simulation_runner import run_simulation

router = APIRouter()

# ============================================================
# Request & Response Models
# ============================================================

class AgentSettings(BaseModel):
    id: str
    aggression: float = Field(..., ge=0.0, le=1.0)
    risk_taking: float = Field(..., ge=0.0, le=1.0)
    tyre_management: float = Field(..., ge=0.0, le=1.0)
    pit_bias: float = Field(..., ge=0.0, le=1.0)

class RaceParams(BaseModel):
    total_laps: int = Field(..., ge=1, le=200)
    weather: str = Field(default="dry")
    track_id: Optional[str] = "default"

    @validator("weather")
    def validate_weather(cls, v):
        allowed = ["dry", "rain", "mixed"]
        if v not in allowed:
            raise ValueError(f"weather must be one of {allowed}")
        return v

class SimulationRequest(BaseModel):
    race: RaceParams
    agents: List[AgentSettings]


class TimelineEntry(BaseModel):
    lap: int
    agent_id: str
    position: int
    lap_time: float
    tyre_wear: float
    action: str


class Summary(BaseModel):
    fastest_lap: float
    avg_tyre_wear: float
    pit_stops: Dict[str, int]
    winner: str


class SimulationResponse(BaseModel):
    timeline: List[TimelineEntry]
    summary: Summary


# ============================================================
# Routes
# ============================================================

@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """
    Main simulation endpoint.
    Calls run_simulation() in a worker thread and returns timeline + summary.
    """

    # Safety: Must have at least 1 agent
    if len(request.agents) == 0:
        raise HTTPException(status_code=400, detail="At least one agent required.")

    try:
        # Run CPU-heavy simulation off the main event loop
        result = await asyncio.to_thread(run_simulation, request.race.dict(), [a.dict() for a in request.agents])

        # Expected result structure:
        # {
        #   "timeline": [...],
        #   "summary": {...}
        # }

        if "timeline" not in result or "summary" not in result:
            raise ValueError("Simulation returned an invalid structure.")

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Simulation failed: {str(e)}"
        )
