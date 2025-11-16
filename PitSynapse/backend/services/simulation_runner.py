# backend/services/simulation_runner.py
"""
Optimized MVP Simulation Runner integrating PRL + Agent Logic.

Exposes:
 - run_simulation(race_params, agent_settings, seed) -> Dict with timeline and summary

Behavior:
 - creates agents from agent_settings
 - for each lap:
     - decide action via agent_logic.decide_action
     - simulate lap_time and tyre_wear
     - emit lap_complete, pit_stop, overtake, prl_update events
 - returns timeline + summary dict
"""

from pathlib import Path
import json
import random
from typing import Dict, Any, List
import uuid

# Pydantic event models
from pathlib import Path
import sys
import os

# Add backend directory to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models.events import (
    LapTimeline,
    LapCompleteEvent,
    PitStopEvent,
    PRLUpdateEvent,
    OvertakeEvent,
    SimulationResult,
    ActionEnum,
    WeatherEnum,
    TraitDelta
)

# PRL and decision logic
from prl_system import update_traits_prl, compute_performance_signal
from services.agent_logic import decide_action, PIT

AGENT_PROFILES_PATH = Path(__file__).parent.parent.parent / "data" / "agent_profiles.json"


def _action_to_enum(action_str: str) -> ActionEnum:
    """Map string action to ActionEnum."""
    mapping = {
        "push_hard": ActionEnum.push_hard,
        "push_medium": ActionEnum.push_medium,
        "maintain": ActionEnum.maintain,
        "conserve_low": ActionEnum.conserve_low,
        "conserve_medium": ActionEnum.conserve_medium,
        "conserve_high": ActionEnum.conserve_high,
        "pit_stop": ActionEnum.pit_stop
    }
    return mapping.get(action_str, ActionEnum.maintain)


def _simulate_lap_time(base_time: float, action: str, profile: Dict[str, Any], tyre_wear: float) -> float:
    """
    Optimized lap-time model with tyre wear penalty.
    """
    # Action modifiers
    action_modifiers = {
        "push_hard": -1.5 - (profile.get("aggression", 0.5) * 0.5),
        "push_medium": -0.8 - (profile.get("aggression", 0.5) * 0.3),
        "maintain": 0.0,
        "conserve_low": 0.6,
        "conserve_medium": 1.2,
        "conserve_high": 2.2
    }
    modifier = action_modifiers.get(action, 0.0)
    
    # Tyre wear penalty (exponential degradation)
    tyre_penalty = (tyre_wear ** 1.5) * 3.0  # More wear = slower
    
    # Small random noise
    noise = random.uniform(-0.1, 0.1)
    
    lap_time = base_time + modifier + tyre_penalty + noise
    return max(10.0, round(lap_time, 2))


def _simulate_tyre_wear(prev_wear: float, action: str, profile: Dict[str, Any]) -> float:
    """
    Tyre wear per lap with management factor.
    """
    base_inc = 0.03  # 3% per lap baseline
    action_multipliers = {
        "push_hard": 1.6,
        "push_medium": 1.2,
        "maintain": 1.0,
        "conserve_low": 0.8,
        "conserve_medium": 0.6,
        "conserve_high": 0.45
    }
    action_mult = action_multipliers.get(action, 1.0)
    
    management = profile.get("tyre_management", 0.6)
    wear = prev_wear + base_inc * action_mult * (1.0 - 0.4 * management)
    return round(min(1.0, wear), 4)


def _detect_overtakes(lap_results: List[Dict], prev_positions: Dict[str, int], new_positions: Dict[str, int]) -> List[Dict]:
    """
    Detect overtakes based on position changes.
    Returns list of overtake events.
    """
    overtakes = []
    for res in lap_results:
        aid = res["agent_id"]
        new_pos = new_positions.get(aid, prev_positions.get(aid, 1))
        old_pos = prev_positions.get(aid, new_pos)
        
        if new_pos < old_pos:  # Gained position
            # Find who was overtaken (agent at old_pos)
            for other_res in lap_results:
                other_aid = other_res["agent_id"]
                other_new_pos = new_positions.get(other_aid, prev_positions.get(other_aid, 1))
                if other_new_pos == old_pos and other_aid != aid:
                    overtakes.append({
                        "agent_id": aid,
                        "agent_name": res["profile"].get("name", aid),
                        "overtaken_agent_id": other_aid,
                        "overtaken_agent_name": other_res["profile"].get("name", other_aid),
                        "position_before": old_pos,
                        "position_after": new_pos,
                        "success": True
                    })
                    break
    return overtakes


def run_simulation(
    race_params: Dict[str, Any],
    agent_settings: List[Dict[str, Any]],
    seed: int | None = None
) -> Dict[str, Any]:
    """
    Main simulation function.
    
    Args:
        race_params: {total_laps, weather, track_id}
        agent_settings: List of {id, aggression, risk_taking, tyre_management, pit_bias}
        seed: Optional random seed
    
    Returns:
        {
            "timeline": List[TimelineEntry],
            "summary": {
                "fastest_lap": float,
                "avg_tyre_wear": float,
                "pit_stops": Dict[str, int],
                "winner": str
            }
        }
    """
    
    if seed is not None:
        random.seed(seed)
    
    # Extract race parameters
    total_laps = race_params.get("total_laps", 50)
    weather_mode = race_params.get("weather", "dry")
    track_name = race_params.get("track_id", "default")
    race_id = str(uuid.uuid4())
    
    # Create agent profiles from settings
    agents_ordered = []
    for i, agent_setting in enumerate(agent_settings):
        agent_id = agent_setting.get("id", f"agent_{i+1}")
        profile = {
            "id": agent_id,
            "name": agent_setting.get("name", f"Agent {i+1}"),
            "aggression": float(agent_setting.get("aggression", 0.5)),
            "risk": float(agent_setting.get("risk_taking", 0.5)),
            "risk_taking": float(agent_setting.get("risk_taking", 0.5)),
            "tyre_management": float(agent_setting.get("tyre_management", 0.6)),
            "pit_bias": float(agent_setting.get("pit_bias", 0.5)),
            "weather_sensitivity": float(agent_setting.get("weather_sensitivity", 0.5)),
            "learning_rate": 0.02
        }
        agents_ordered.append(profile)
    
    total_agents = len(agents_ordered)
    if total_agents == 0:
        raise ValueError("At least one agent required")
    
    # Initialize dynamic state
    dyn_state: Dict[str, Dict[str, Any]] = {}
    base_lap_time = 90.0  # Base lap time in seconds
    
    for pos, profile in enumerate(agents_ordered, start=1):
        aid = profile["id"]
        dyn_state[aid] = {
            "position": pos,
            "tyre_wear": 0.0,
            "tyre_age": 0,
            "pit_next": False,
            "last_lap_time": None,
            "best_lap": None,
            "pit_stops": 0,
            "total_time": 0.0
        }
    
    # Timeline storage
    timeline_entries = []
    all_events = []
    elapsed = 0.0
    
    # Weather state
    current_weather = WeatherEnum.dry
    weather_map = {
        "dry": WeatherEnum.dry,
        "rain": WeatherEnum.light_rain,
        "mixed": WeatherEnum.mixed
    }
    if weather_mode in weather_map:
        current_weather = weather_map[weather_mode]
    
    # Main simulation loop
    for lap_num in range(1, total_laps + 1):
        # Weather changes (simplified)
        if random.random() < 0.1:  # 10% chance per lap
            current_weather = random.choice([WeatherEnum.dry, WeatherEnum.light_rain])
        
        laps_remaining = total_laps - lap_num
        lap_results = []
        prev_positions = {aid: dyn_state[aid]["position"] for aid in dyn_state}
        
        # Simulate lap for each agent
        for profile in agents_ordered:
            aid = profile["id"]
            state = dyn_state[aid]
            
            race_state = {
                "laps_remaining": laps_remaining,
                "weather": current_weather.value,
                "leader_position": 1,
                "total_agents": total_agents
            }
            
            # Decide action
            action = decide_action(state, profile, race_state)
            
            # Handle pit stop
            pit_time = 0.0
            if action == PIT:
                pit_time = 22.0 + random.uniform(-1.5, 1.5)
                lap_time = _simulate_lap_time(base_lap_time, "maintain", profile, 0.0) + pit_time
                tyre_wear = 0.02  # Fresh tyres
                dyn_state[aid]["tyre_age"] = 0
                did_pit = True
            else:
                lap_time = _simulate_lap_time(base_lap_time, action, profile, state["tyre_wear"])
                tyre_wear = _simulate_tyre_wear(state["tyre_wear"], action, profile)
                did_pit = False
            
            lap_results.append({
                "agent_id": aid,
                "profile": profile,
                "action": action,
                "lap_time": lap_time,
                "tyre_wear": tyre_wear,
                "did_pit": did_pit,
                "pit_time": pit_time
            })
        
        # Sort by lap time to determine positions
        lap_results.sort(key=lambda r: r["lap_time"])
        
        # Calculate new positions
        new_positions = {}
        for position_index, res in enumerate(lap_results, start=1):
            new_positions[res["agent_id"]] = position_index
        
        # Detect overtakes
        overtakes = _detect_overtakes(lap_results, prev_positions, new_positions)
        
        # Process lap results and create events
        for position_index, res in enumerate(lap_results, start=1):
            aid = res["agent_id"]
            profile = res["profile"]
            action = res["action"]
            lap_time = res["lap_time"]
            tyre_wear = res["tyre_wear"]
            did_pit = res["did_pit"]
            
            prev_position = prev_positions[aid]
            position = position_index
            position_change = prev_position - position
            
            # Update state
            dyn_state[aid]["position"] = position
            dyn_state[aid]["tyre_wear"] = tyre_wear
            if not did_pit:
                dyn_state[aid]["tyre_age"] += 1
            dyn_state[aid]["last_lap_time"] = lap_time
            dyn_state[aid]["total_time"] += lap_time
            if dyn_state[aid]["best_lap"] is None or lap_time < dyn_state[aid]["best_lap"]:
                dyn_state[aid]["best_lap"] = lap_time
            if did_pit:
                dyn_state[aid]["pit_stops"] += 1
                dyn_state[aid]["tyre_wear"] = 0.02  # Reset after pit
            
            # Create pit stop event
            if did_pit:
                pit_event = {
                    "event_type": "pit_stop",
                    "agent_id": aid,
                    "agent_name": profile.get("name", aid),
                    "pit_stop_time": round(res.get("pit_time", 22.0), 2),
                    "position": position,
                    "pit_reason": "strategy" if profile.get("pit_bias", 0.5) > 0.5 else "tyre_wear",
                    "position_change": position_change,
                    "timestamp": round(elapsed, 2)
                }
                all_events.append(pit_event)
            
            # Create lap complete event
            action_enum = _action_to_enum(action)
            lap_event = {
                "event_type": "lap_complete",
                "agent_id": aid,
                "agent_name": profile.get("name", aid),
                "action": action_enum.value if isinstance(action_enum, ActionEnum) else action,
                "lap_time": round(lap_time, 2),
                "position": position,
                "position_change": position_change,
                "tyre_wear": round(tyre_wear, 4),
                "tyre_age": dyn_state[aid]["tyre_age"],
                "timestamp": round(elapsed, 2)
            }
            all_events.append(lap_event)
            
            # Create timeline entry
            timeline_entry = {
                "lap": lap_num,
                "agent_id": aid,
                "position": position,
                "lap_time": round(lap_time, 2),
                "tyre_wear": round(tyre_wear * 100, 2),  # Convert to percentage
                "action": action_enum.value if isinstance(action_enum, ActionEnum) else action
            }
            timeline_entries.append(timeline_entry)
            
            elapsed += lap_time / total_agents
        
        # Create overtake events
        for overtake in overtakes:
            overtake_event = {
                "event_type": "overtake",
                "agent_id": overtake["agent_id"],
                "agent_name": overtake["agent_name"],
                "overtaken_agent_id": overtake["overtaken_agent_id"],
                "overtaken_agent_name": overtake["overtaken_agent_name"],
                "overtake_success": overtake["success"],
                "position_before": overtake["position_before"],
                "position_after": overtake["position_after"],
                "timestamp": round(elapsed, 2)
            }
            all_events.append(overtake_event)
        
        # PRL updates
        for res in lap_results:
            aid = res["agent_id"]
            profile = res["profile"]
            state = dyn_state[aid]
            
            if lap_num == 1:
                continue  # Skip PRL on first lap
            
            perf_data = {
                "current_lap_time": res["lap_time"],
                "best_lap_time": state.get("best_lap", res["lap_time"]),
                "tyre_wear_increase": max(0.0, res["tyre_wear"] - (state.get("tyre_wear", 0.0) - 0.03)),
                "expected_wear": 0.04,
                "position_before": prev_positions.get(aid, state["position"]),
                "position_after": state["position"],
                "total_cars": total_agents,
                "pitted_this_lap": res["did_pit"],
                "lap_number": lap_num
            }
            
            prl_result = update_traits_prl(
                {
                    "aggression": profile.get("aggression", 0.5),
                    "tyre_management": profile.get("tyre_management", 0.6),
                    "risk_taking": profile.get("risk_taking", profile.get("risk", 0.5)),
                    "pit_bias": profile.get("pit_bias", 0.5)
                },
                perf_data,
                learning_rate=profile.get("learning_rate", 0.02)
            )
            
            # Update profile traits
            trait_changes = prl_result.get("changes", {})
            for key, delta in trait_changes.items():
                new_val = float(profile.get(key, 0.5)) + float(delta)
                profile[key] = max(0.0, min(1.0, new_val))
            
            prl_event = {
                "event_type": "prl_update",
                "agent_id": aid,
                "agent_name": profile.get("name", aid),
                "prl_reward": round(prl_result.get("reward_signal", 0.0), 3),
                "trait_deltas": {
                    "aggression": round(trait_changes.get("aggression", 0.0), 4),
                    "tyre_management": round(trait_changes.get("tyre_management", 0.0), 4),
                    "risk_taking": round(trait_changes.get("risk_taking", 0.0), 4),
                    "pit_bias": round(trait_changes.get("pit_bias", 0.0), 4)
                },
                "timestamp": round(elapsed, 2)
            }
            all_events.append(prl_event)
    
    # Calculate summary
    fastest_lap = min((dyn_state[aid]["best_lap"] for aid in dyn_state if dyn_state[aid]["best_lap"]), default=0.0)
    avg_tyre_wear = sum(dyn_state[aid]["tyre_wear"] for aid in dyn_state) / total_agents
    pit_stops = {aid: dyn_state[aid]["pit_stops"] for aid in dyn_state}
    
    # Winner is agent with lowest total time
    winner_id = min(dyn_state.keys(), key=lambda aid: dyn_state[aid]["total_time"])
    winner_name = next((p["name"] for p in agents_ordered if p["id"] == winner_id), winner_id)
    
    summary = {
        "fastest_lap": round(fastest_lap, 2),
        "avg_tyre_wear": round(avg_tyre_wear * 100, 2),  # Convert to percentage
        "pit_stops": pit_stops,
        "winner": winner_name
    }
    
    return {
        "timeline": timeline_entries,
        "summary": summary,
        "events": all_events  # Include all events for frontend
    }
