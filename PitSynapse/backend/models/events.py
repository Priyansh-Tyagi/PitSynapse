"""
Pydantic event models for PitSynapse simulation.
"""
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ActionEnum(str, Enum):
    push_hard = "push_hard"
    push_medium = "push_medium"
    maintain = "maintain"
    conserve_low = "conserve_low"
    conserve_medium = "conserve_medium"
    conserve_high = "conserve_high"
    pit_stop = "pit_stop"


class WeatherEnum(str, Enum):
    dry = "dry"
    light_rain = "light_rain"
    heavy_rain = "heavy_rain"
    mixed = "mixed"


class TraitDelta(BaseModel):
    aggression: float = Field(..., ge=-1.0, le=1.0)
    tyre_management: float = Field(..., ge=-1.0, le=1.0)
    risk_taking: float = Field(..., ge=-1.0, le=1.0)
    pit_bias: float = Field(..., ge=-1.0, le=1.0)


class LapCompleteEvent(BaseModel):
    event_type: str = "lap_complete"
    agent_id: str
    agent_name: str
    action: str
    lap_time: float
    position: int
    position_change: int
    tyre_wear: float
    tyre_age: int
    tyre_compound: Optional[str] = None
    fuel_level: Optional[float] = None
    gap_ahead: Optional[float] = None
    gap_behind: Optional[float] = None
    timestamp: float


class PitStopEvent(BaseModel):
    event_type: str = "pit_stop"
    agent_id: str
    agent_name: str
    pit_stop_time: float
    position: int
    pit_reason: str
    position_change: int
    tyre_compound: Optional[str] = None
    timestamp: Optional[float] = None


class OvertakeEvent(BaseModel):
    event_type: str = "overtake"
    agent_id: str
    agent_name: str
    overtaken_agent_id: str
    overtaken_agent_name: str
    overtake_success: bool
    position_before: int
    position_after: int
    timestamp: float


class PRLUpdateEvent(BaseModel):
    event_type: str = "prl_update"
    agent_id: str
    agent_name: str
    prl_reward: float
    trait_deltas: TraitDelta
    timestamp: float


class WeatherChangeEvent(BaseModel):
    event_type: str = "weather_change"
    weather: str
    track_temp: Optional[float] = None
    timestamp: float


class LapTimeline(BaseModel):
    lap_number: int
    weather: WeatherEnum
    track_temp: Optional[float] = None
    safety_car: bool = False
    events: List[Any]  # List of event models (LapCompleteEvent, PitStopEvent, etc.)


class SimulationResult(BaseModel):
    race_id: str
    total_laps: int
    total_agents: int
    track_name: Optional[str] = None
    laps: List[LapTimeline]

