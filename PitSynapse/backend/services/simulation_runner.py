# backend/services/simulation_runner.py
"""
MVP Simulation Runner integrating PRL + Agent Logic.

Exposes:
 - run_simulation(race_id, total_laps, agent_ids, track_name, weather_mode, seed) -> SimulationResult

Behavior:
 - loads data/agent_profiles.json (expects key "profiles" with list)
 - instantiates per-agent dynamic state
 - for each lap:
     - decide action via agent_logic.decide_action
     - simulate lap_time and tyre_wear (simple deterministic formulas)
     - emit lap_complete events (LapCompleteEvent)
     - emit pit_stop events when action was PIT
     - after all agents' lap_complete in the lap, compute PRL updates per agent and emit prl_update
 - returns models.events.SimulationResult
"""

from pathlib import Path
import json
import random
from typing import Dict, Any, List

# Pydantic event models
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

# PRL and decision logic (ensure these files exist as provided)
from backend.logic.prl_system import update_traits_prl, compute_performance_signal
from backend.logic.agent_logic import decide_action, PIT

AGENT_PROFILES_PATH = Path("data/agent_profiles.json")


def _load_profiles() -> Dict[str, Dict[str, Any]]:
    """Load profiles dictionary keyed by id; fallback to small default if missing."""
    if AGENT_PROFILES_PATH.exists():
        data = json.loads(AGENT_PROFILES_PATH.read_text())
        profiles = {}
        # support either {"profiles": [...]} or list directly
        if isinstance(data, dict) and "profiles" in data:
            plist = data["profiles"]
        elif isinstance(data, list):
            plist = data
        else:
            plist = data.get("profiles", [])
        for p in plist:
            profiles[p["id"]] = p.copy()
        return profiles
    # fallback small default set (3 agents) if file missing
    fallback = [
        {
            "id": "aggressive_overtaker",
            "name": "Aggressive Overtaker",
            "aggression": 0.9,
            "risk": 0.85,
            "tyre_management": 0.4,
            "pit_bias": 0.3,
            "weather_sensitivity": 0.6
        },
        {
            "id": "tyre_whisperer",
            "name": "Tyre Whisperer",
            "aggression": 0.4,
            "risk": 0.35,
            "tyre_management": 0.95,
            "pit_bias": 0.4,
            "weather_sensitivity": 0.55
        },
        {
            "id": "balanced_racer",
            "name": "Balanced Racer",
            "aggression": 0.55,
            "risk": 0.5,
            "tyre_management": 0.65,
            "pit_bias": 0.5,
            "weather_sensitivity": 0.5
        },
    ]
    return {p["id"]: p for p in fallback}


def _action_to_enum(action_str: str) -> ActionEnum:
    # map string to ActionEnum or default
    mapping = {
        "push_hard": ActionEnum.push_hard,
        "push_medium": ActionEnum.push_medium,
        "maintain": ActionEnum.maintain,
        "conserve_low": ActionEnum.conserve_low,
        "conserve_medium": ActionEnum.conserve_medium,
        "conserve_high": ActionEnum.conserve_high
    }
    return mapping.get(action_str, ActionEnum.maintain)


def _simulate_lap_time(base_time: float, action: str, profile: Dict[str, Any]) -> float:
    """
    Simple deterministic lap-time model:
     - base_time: baseline lap time for track (seconds)
     - action modifies lap time: push_hard -> faster, conserve -> slower
     - profile.aggression slightly reduces lap time when pushing
    """
    # Base modifiers
    if action == "push_hard":
        modifier = -1.5 - (profile.get("aggression", 0.5) * 0.5)
    elif action == "push_medium":
        modifier = -0.8 - (profile.get("aggression", 0.5) * 0.3)
    elif action == "maintain":
        modifier = 0.0
    elif action == "conserve_low":
        modifier = 0.6
    elif action == "conserve_medium":
        modifier = 1.2
    elif action == "conserve_high":
        modifier = 2.2
    else:
        modifier = 0.0

    # Tyre wear penalty will be applied elsewhere; add small random stability noise
    noise = random.uniform(-0.15, 0.15)
    lap_time = base_time + modifier + noise
    return max(10.0, round(lap_time, 2))


def _simulate_tyre_wear(prev_wear: float, action: str, profile: Dict[str, Any]) -> float:
    """
    Simple tyre wear per lap:
      - base wear increment
      - pushing increases wear; tyre_management reduces it
    """
    base_inc = 0.03  # 3% per lap baseline
    action_multiplier = {
        "push_hard": 1.6,
        "push_medium": 1.2,
        "maintain": 1.0,
        "conserve_low": 0.8,
        "conserve_medium": 0.6,
        "conserve_high": 0.45
    }.get(action, 1.0)

    management = profile.get("tyre_management", 0.6)
    wear = prev_wear + base_inc * action_multiplier * (1.0 - 0.4 * management)
    return round(min(1.0, wear), 4)


def run_simulation(
    race_id: str,
    total_laps: int,
    agent_ids: List[str],
    track_name: str | None,
    weather_mode: str,
    seed: int | None = None
) -> SimulationResult:
    """
    MVP run_simulation: returns SimulationResult Pydantic model.
    """

    if seed is not None:
        random.seed(seed)

    profiles = _load_profiles()
    # Filter requested agents; preserve order of agent_ids
    agents_ordered = []
    for aid in agent_ids:
        p = profiles.get(aid)
        if p:
            agents_ordered.append(p)
    if not agents_ordered:
        # fallback: use all loaded
        agents_ordered = list(profiles.values())

    total_agents = len(agents_ordered)

    # Per-agent dynamic state
    dyn_state: Dict[str, Dict[str, Any]] = {}
    # Use a simple base lap time (can be replaced with F1 ingest)
    base_lap_time = 90.0

    for pos, profile in enumerate(agents_ordered, start=1):
        aid = profile["id"]
        dyn_state[aid] = {
            "position": pos,
            "tyre_wear": 0.0,
            "tyre_age": 0,
            "pit_next": False,
            "last_lap_time": None,
            "best_lap": None,
            "pit_stops": 0
        }

    laps: List[LapTimeline] = []
    elapsed = 0.0

    for lap_num in range(1, total_laps + 1):
        # Simple weather selection for MVP
        weather = random.choice([WeatherEnum.dry, WeatherEnum.dry, WeatherEnum.light_rain])
        lap_events = []

        # determine laps remaining
        laps_remaining = total_laps - lap_num

        # Decide actions and simulate per agent
        # We'll compute tentative lap results, then sort by lap_time to recompute positions
        lap_results = []

        for profile in agents_ordered:
            aid = profile["id"]
            state = dyn_state[aid]

            race_state = {
                "laps_remaining": laps_remaining,
                "weather": weather.value,
                "leader_position": 1,
                "total_agents": total_agents
            }

            action = decide_action(state, profile, race_state)
            # If action is PIT, represent as PIT stop event and longer lap time
            if action == PIT:
                # pit lap penalty
                pit_time = 22.0 + random.uniform(-1.5, 1.5)
                lap_time = _simulate_lap_time(base_lap_time, "maintain", profile) + pit_time
                tyre_wear = 0.02  # tyre changed, small wear for out lap
                did_pit = True
            else:
                lap_time = _simulate_lap_time(base_lap_time, action, profile)
                tyre_wear = _simulate_tyre_wear(state["tyre_wear"], action, profile)
                did_pit = False

            # update dynamic state temporarily (position assigned after sorting)
            lap_results.append({
                "agent_id": aid,
                "profile": profile,
                "action": action,
                "lap_time": lap_time,
                "tyre_wear": tyre_wear,
                "did_pit": did_pit
            })

        # Rank by lap_time ascending for the lap to determine positions
        lap_results.sort(key=lambda r: r["lap_time"])
        # produce lap_complete events in rank order (1 = fastest)
        for position_index, res in enumerate(lap_results, start=1):
            aid = res["agent_id"]
            profile = res["profile"]
            action = res["action"]
            lap_time = res["lap_time"]
            tyre_wear = res["tyre_wear"]
            did_pit = res["did_pit"]

            prev_position = dyn_state[aid]["position"]
            position = position_index
            position_change = prev_position - position
            dyn_state[aid]["position"] = position
            dyn_state[aid]["tyre_wear"] = tyre_wear
            dyn_state[aid]["tyre_age"] = dyn_state[aid].get("tyre_age", 0) + 1
            dyn_state[aid]["last_lap_time"] = lap_time
            if dyn_state[aid]["best_lap"] is None or lap_time < dyn_state[aid]["best_lap"]:
                dyn_state[aid]["best_lap"] = lap_time
            if did_pit:
                dyn_state[aid]["pit_stops"] += 1

            # emit pit_stop event for pit action (before lap_complete to show pit)
            if did_pit:
                pit_event = PitStopEvent(
                    event_type="pit_stop",
                    agent_id=aid,
                    agent_name=profile.get("name", aid),
                    pit_stop_time=round(lap_time - base_lap_time, 2),
                    position=position,
                    pit_reason="strategy" if profile.get("pit_bias", 0.5) > 0.5 else "tyre_wear",
                    position_change=position_change,
                    tyre_compound=None
                )
                lap_events.append(pit_event)

            # lap_complete event
            lap_event = LapCompleteEvent(
                event_type="lap_complete",
                agent_id=aid,
                agent_name=profile.get("name", aid),
                action=_action_to_enum(action).value if isinstance(_action_to_enum(action), ActionEnum) else action,
                lap_time=round(lap_time, 2),
                position=position,
                position_change=position_change,
                tyre_wear=round(tyre_wear, 4),
                tyre_age=dyn_state[aid]["tyre_age"],
                tyre_compound=profile.get("preferred_tyre") if profile.get("preferred_tyre") else None,
                fuel_level=None,
                gap_ahead=None,
                gap_behind=None,
                timestamp=round(elapsed + lap_time, 2)
            )
            lap_events.append(lap_event)

            elapsed += lap_time / total_agents  # distribute elapsed advancement (approx)

        # After all lap_complete events for lap, run PRL updates and emit prl_update events
        for res in lap_results:
            aid = res["agent_id"]
            profile = res["profile"]
            state = dyn_state[aid]

            # build performance_data as expected by PRL: prev_lap and current_lap dicts
            prev_lap = {
                "lap_time": state.get("last_lap_time", res["lap_time"]),
                "tyre_wear": max(0.0, state.get("tyre_wear", 0.0) - 0.0001),  # previous estimate (small)
                "position": state.get("position", 1),
                "total_cars": total_agents,
                "expected_wear": profile.get("tyre_wear_rate", 0.04)
            }
            current_lap = {
                "lap_time": res["lap_time"],
                "best_lap": state.get("best_lap", res["lap_time"]),
                "tyre_wear": res["tyre_wear"],
                "position": state.get("position", 1),
                "pitted": res["did_pit"],
                "lap_number": lap_num,
                "total_cars": total_agents,
                "expected_wear": profile.get("tyre_wear_rate", 0.04)
            }

            perf_data = {
                "current_lap_time": current_lap["lap_time"],
                "best_lap_time": current_lap["best_lap"],
                "tyre_wear_increase": max(0.0, current_lap["tyre_wear"] - prev_lap["tyre_wear"]),
                "expected_wear": current_lap["expected_wear"],
                "position_before": prev_lap["position"],
                "position_after": current_lap["position"],
                "total_cars": total_agents,
                "pitted_this_lap": current_lap["pitted"],
                "lap_number": current_lap["lap_number"]
            }

            # call PRL system
            prl_result = update_traits_prl(
                {
                    "aggression": profile.get("aggression", 0.5),
                    "tyre_management": profile.get("tyre_management", 0.6),
                    "risk_taking": profile.get("risk", profile.get("risk_taking", 0.5)),
                    "pit_bias": profile.get("pit_bias", 0.5)
                },
                perf_data,
                learning_rate=profile.get("learning_rate", 0.02)
            )

            # Apply trait changes back to profile (relative deltas)
            trait_changes = prl_result.get("changes", {})
            for key, delta in trait_changes.items():
                # update the profile in-place - small clamp to [0.0,1.0]
                new_val = float(profile.get(key, 0.5)) + float(delta)
                profile[key] = max(0.0, min(1.0, new_val))

            # build TraitDelta Pydantic model
            trait_delta_model = TraitDelta(
                aggression=round(trait_changes.get("aggression", 0.0), 4),
                tyre_management=round(trait_changes.get("tyre_management", 0.0), 4),
                risk_taking=round(trait_changes.get("risk_taking", 0.0), 4),
                pit_bias=round(trait_changes.get("pit_bias", 0.0), 4)
            )

            prl_event = PRLUpdateEvent(
                event_type="prl_update",
                agent_id=aid,
                agent_name=profile.get("name", aid),
                prl_reward=round(prl_result.get("reward_signal", 0.0), 3),
                trait_deltas=trait_delta_model,
                timestamp=round(elapsed, 2)
            )

            lap_events.append(prl_event)

        # finished lap; append LapTimeline
        lap_timeline = LapTimeline(
            lap_number=lap_num,
            weather=weather,
            track_temp=None,
            safety_car=False,
            events=lap_events
        )
        laps.append(lap_timeline)

    # Build SimulationResult
    sim_result = SimulationResult(
        race_id=race_id,
        total_laps=total_laps,
        total_agents=total_agents,
        track_name=track_name,
        laps=laps
    )
    return sim_result
