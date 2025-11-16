# backend/logic/prl_system.py

def clamp(val, min_v=0.0, max_v=1.0):
    return max(min_v, min(max_v, val))


def compute_performance_signal(prev_lap, current_lap):
    """
    Computes the basic performance signal used to evaluate agent improvement.
    This is a helper you can plug into anything.

    Args:
        prev_lap (float): previous lap time
        current_lap (float): current lap time

    Returns:
        float: value in [-1, 1]
    """

    if prev_lap <= 0:
        return 0.0

    diff = prev_lap - current_lap
    ratio = diff / prev_lap

    return clamp(ratio, -1.0, 1.0)
    


def update_traits_prl(agent_traits, performance_data, learning_rate=0.02):
    """
    Pseudo-RL trait adaptation system.
    Executed once per lap per agent.

    Args:
        agent_traits: dict {
            aggression,
            tyre_management,
            risk_taking,
            pit_bias
        }
        performance_data: dict {
            current_lap_time,
            best_lap_time,
            tyre_wear_increase,
            expected_wear,
            position_before,
            position_after,
            total_cars,
            pitted_this_lap,
            lap_number
        }
        learning_rate: float

    Returns:
        {
            "traits": updated_traits_dict,
            "reward_signal": R,
            "changes": {k: delta},
        }
    """

    # ---- Skip Lap 1 (No baseline) ----
    if performance_data.get("lap_number", 1) == 1:
        return {
            "traits": agent_traits.copy(),
            "reward_signal": 0.0,
            "changes": {k: 0.0 for k in agent_traits}
        }

    # ----------------------------------
    # 1. Reward Components
    # ----------------------------------
    best_lap = max(performance_data["best_lap_time"], 0.01)
    R_time = clamp(
        (best_lap - performance_data["current_lap_time"]) / best_lap,
        -1.0, 1.0
    )

    expected_wear = max(performance_data["expected_wear"], 0.001)
    R_tyre = clamp(
        1.0 - (performance_data["tyre_wear_increase"] / expected_wear),
        -1.0, 1.0
    )

    position_delta = (
        performance_data["position_before"] - 
        performance_data["position_after"]
    )
    R_position = clamp(
        position_delta / performance_data["total_cars"],
        -1.0, 1.0
    )

    # ----------------------------------
    # 2. Combined Reward
    # ----------------------------------
    R = clamp(
        0.4 * R_time +
        0.3 * R_tyre +
        0.3 * R_position,
        -1.0, 1.0
    )

    # ----------------------------------
    # 3. Aggression Update
    # ----------------------------------
    if R > 0:
        if position_delta > 0:        # gained positions
            delta_agg = learning_rate * R
        else:                         # positive reward but no gain
            delta_agg = -learning_rate * R * 0.5
    else:
        if position_delta < 0:        # lost positions
            delta_agg = -learning_rate * abs(R)
        else:
            delta_agg = learning_rate * abs(R) * 0.5

    # ----------------------------------
    # 4. Tyre Management Update
    # ----------------------------------
    tyre_eff = 1.0 - (performance_data["tyre_wear_increase"] / expected_wear)

    if tyre_eff > 0.8:
        delta_tyre = learning_rate * R
    elif tyre_eff < 0.5:
        delta_tyre = -learning_rate * abs(R)
    else:
        delta_tyre = learning_rate * R * 0.5

    # ----------------------------------
    # 5. Risk-Taking Update
    # ----------------------------------
    if R > 0 and position_delta > 0:
        delta_risk = learning_rate * R
    elif R < 0 and position_delta < 0:
        delta_risk = -learning_rate * abs(R)
    else:
        delta_risk = learning_rate * R * 0.3

    # ----------------------------------
    # 6. Pit Bias Update
    # ----------------------------------
    delta_pit = 0.0
    if performance_data["pitted_this_lap"]:
        expected_lap = best_lap * 1.05
        time_loss = performance_data["current_lap_time"] - expected_lap

        if time_loss < 0:
            delta_pit = learning_rate * abs(time_loss) * 0.5
        else:
            delta_pit = -learning_rate * time_loss * 0.3

        delta_pit = clamp(delta_pit, -0.05, 0.05)

    # ----------------------------------
    # 7. Apply & Clamp New Traits
    # ----------------------------------
    new_traits = {
        "aggression": clamp(agent_traits["aggression"] + delta_agg, 0.1, 0.9),
        "tyre_management": clamp(agent_traits["tyre_management"] + delta_tyre, 0.1, 0.9),
        "risk_taking": clamp(agent_traits["risk_taking"] + delta_risk, 0.1, 0.9),
        "pit_bias": clamp(agent_traits["pit_bias"] + delta_pit, 0.1, 0.9),
    }

    # ----------------------------------
    # 8. Return Result
    # ----------------------------------
    return {
        "traits": new_traits,
        "reward_signal": R,
        "changes": {
            key: new_traits[key] - agent_traits[key]
            for key in new_traits
        }
    }
