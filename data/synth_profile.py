"""
Generate synthetic speed & tyre curves when telemetry is missing.
Used by f1_ingest.py or any other synthetic scenario.
"""

import numpy as np
import json
from pathlib import Path

OUTPUT_JSON = Path("data/agent_profiles.json")


def generate_synthetic_speed_curve(laps: int = 50, sectors: int = 3):
    """Return a synthetic speed shape array (m/s) for one lap."""
    base_speed = 70.0  # m/s average
    curve = []
    for lap in range(laps):
        lap_curve = []
        for s in range(sectors):
            fluct = np.random.normal(0, 2.0)
            lap_curve.append(round(base_speed + fluct, 2))
        curve.append(lap_curve)
    return curve


def add_speed_shapes(profiles_json: str = OUTPUT_JSON):
    """Fill in speed_shape arrays for existing profiles."""
    with open(profiles_json, "r") as f:
        profiles = json.load(f)

    for profile in profiles:
        profile["speed_shape"] = generate_synthetic_speed_curve()

    with open(profiles_json, "w") as f:
        json.dump(profiles, f, indent=4)
    print(f"Synthetic speed curves added to {profiles_json}")


if __name__ == "__main__":
    add_speed_shapes()
