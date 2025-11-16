"""
PitSynapse F1 Data Ingest

Fetches lap times and pit stops from Ergast API (if available),
computes base lap/pit stats, generates per-lap speed & tyre wear curves,
and exports agent_profiles.json for simulation ingestion.
"""

import requests
import json
import os
from pathlib import Path
from typing import List, Dict
import random
import numpy as np

OUTPUT_JSON = Path("data/agent_profiles.json")
TOTAL_LAPS = 50
NUM_AGENTS = 6
SECTORS = 3

# ------------------- Ergast API ------------------- #

def fetch_ergast_laps(season: int, round_num: int) -> List[Dict]:
    url = f"http://ergast.com/api/f1/{season}/{round_num}/laps.json?limit=2000"
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        laps = data['MRData']['RaceTable']['Races'][0]['Laps']
        return laps
    except Exception:
        return []

def fetch_ergast_pits(season: int, round_num: int) -> List[Dict]:
    url = f"http://ergast.com/api/f1/{season}/{round_num}/pitstops.json?limit=2000"
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        pits = data['MRData']['RaceTable']['Races'][0].get('PitStops', [])
        return pits
    except Exception:
        return []

# ------------------- Base Stats ------------------- #

def compute_base_stats(laps: List[Dict], pits: List[Dict]) -> Dict:
    lap_times_sec = []
    for lap in laps:
        for timing in lap.get('Timings', []):
            mm, ss = map(float, timing['time'].split(':'))
            lap_times_sec.append(mm * 60 + ss)
    base_lap_time = sum(lap_times_sec) / len(lap_times_sec) if lap_times_sec else 90.0

    pit_times_sec = [float(pit['duration']) for pit in pits if 'duration' in pit]
    avg_pit_loss = sum(pit_times_sec) / len(pit_times_sec) if pit_times_sec else 22.0

    tyre_wear_rate = 1.0 / 25  # assume full degradation in 25 laps if no telemetry

    return {
        "base_lap_time": round(base_lap_time, 2),
        "avg_pit_loss": round(avg_pit_loss, 2),
        "tyre_wear_rate": round(tyre_wear_rate, 4),
    }

# ------------------- Synthetic Curves ------------------- #

def generate_speed_curve(total_laps: int = TOTAL_LAPS, sectors: int = SECTORS) -> List[List[float]]:
    """Per-lap sector speed array with random realistic variations (m/s)."""
    base_speed = 70.0
    curve = []
    for lap in range(total_laps):
        lap_curve = [round(base_speed + np.random.normal(0, 2.0), 2) for _ in range(sectors)]
        curve.append(lap_curve)
    return curve

def generate_tyrewear_curve(total_laps: int = TOTAL_LAPS, base_rate: float = 0.04) -> List[float]:
    """Per-lap cumulative tyre wear (0-1)"""
    wear_curve = []
    cumulative = 0.0
    for lap in range(total_laps):
        increment = base_rate * random.uniform(0.9, 1.1)
        cumulative += increment
        wear_curve.append(round(min(cumulative, 1.0), 4))
    return wear_curve

# ------------------- Agent Profiles ------------------- #

def generate_agent_profiles(base_stats: Dict, num_agents: int = NUM_AGENTS) -> List[Dict]:
    profiles = []
    for i in range(num_agents):
        aggression = round(random.uniform(0.3, 0.9), 2)
        risk = round(random.uniform(0.2, 0.85), 2)
        tyre_management = round(random.uniform(0.3, 0.9), 2)
        pit_bias = round(random.uniform(0.2, 0.8), 2)
        weather_sensitivity = round(random.uniform(0.3, 0.9), 2)

        profiles.append({
            "id": f"agent_{i+1}",
            "name": f"Agent {i+1}",
            "aggression": aggression,
            "risk": risk,
            "tyre_management": tyre_management,
            "pit_bias": pit_bias,
            "weather_sensitivity": weather_sensitivity,
            "base_lap_time": base_stats["base_lap_time"],
            "avg_pit_loss": base_stats["avg_pit_loss"],
            "tyre_wear_rate": base_stats["tyre_wear_rate"],
            "speed_shape": generate_speed_curve(),
            "tyre_wear_shape": generate_tyrewear_curve(base_rate=base_stats["tyre_wear_rate"])
        })
    return profiles

# ------------------- Save JSON ------------------- #

def save_profiles(profiles: List[Dict], path: str = OUTPUT_JSON):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(profiles, f, indent=4)
    print(f"Saved {len(profiles)} agent profiles to {path}")

# ------------------- Main ------------------- #

def main():
    SEASON = 2025
    ROUND = 1
    laps = fetch_ergast_laps(SEASON, ROUND)
    pits = fetch_ergast_pits(SEASON, ROUND)
    base_stats = compute_base_stats(laps, pits)
    profiles = generate_agent_profiles(base_stats)
    save_profiles(profiles)

if __name__ == "__main__":
    main()
