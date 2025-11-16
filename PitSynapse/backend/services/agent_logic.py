# backend/logic/agent_logic.py
"""
Agent decision logic for PitSynapse (MVP).

Exports:
 - decide_action(agent_state, profile, race_state) -> str
Actions: "push_hard" | "push_medium" | "maintain" | "conserve_low" | "conserve_medium" | "conserve_high" | "pit"
"""

from typing import Dict, Any

# Action names match ActionEnum in models.events
PIT = "pit_stop"
PUSH_HARD = "push_hard"
PUSH_MEDIUM = "push_medium"
MAINTAIN = "maintain"
CONSERVE_LOW = "conserve_low"
CONSERVE_MEDIUM = "conserve_medium"
CONSERVE_HIGH = "conserve_high"

def decide_action(agent_state: Dict[str, Any], profile: Dict[str, Any], race_state: Dict[str, Any]) -> str:
    """
    Decide action for current lap for an agent (MVP rules).

    agent_state: dynamic values (tyre_wear (0-1), tyre_age, position, gap_ahead, gap_behind, pit_next flag)
    profile: static/dynamic profile (aggression, risk, tyre_management, pit_bias, weather_sensitivity)
    race_state: {laps_remaining, weather, leader_position, total_agents}

    Simple rule set:
      - Pit if tyre very worn OR explicitly flagged to pit_next OR tyre_wear exceeds safe threshold (profile-aware)
      - If not pitting:
          * Push if aggression high and gap ahead < small threshold OR risk-driven late-race push
          * Conserve if tyre_management high and tyre_wear > mid threshold
          * Otherwise maintain or medium push depending on risk
    """
    tyre_wear = float(agent_state.get("tyre_wear", 0.0))
    tyre_age = int(agent_state.get("tyre_age", 0))
    position = int(agent_state.get("position", 1))
    gap_ahead = float(agent_state.get("gap_ahead", 999.0))
    pit_next = bool(agent_state.get("pit_next", False))
    laps_remaining = int(race_state.get("laps_remaining", 0))
    weather = race_state.get("weather", "dry")

    aggression = float(profile.get("aggression", 0.5))
    risk = float(profile.get("risk", 0.5))
    tyre_management = float(profile.get("tyre_management", 0.6))
    pit_bias = float(profile.get("pit_bias", 0.5))
    weather_sensitivity = float(profile.get("weather_sensitivity", 0.5))

    # === PIT logic ===
    # base thresholds
    hard_pit_threshold = 0.82  # immediate pit if above
    soft_pit_threshold = 0.70  # consider pitting if combined conditions
    # profile-biased adjustment
    adjusted_soft = soft_pit_threshold - (pit_bias - 0.5) * 0.15  # more pit_bias => pit earlier
    adjusted_soft = max(0.45, min(0.85, adjusted_soft))

    if pit_next:
        return PIT

    if tyre_wear >= hard_pit_threshold:
        return PIT

    if tyre_wear >= adjusted_soft and laps_remaining > 4:
        # if conservative, more likely to pit early
        if pit_bias > 0.6 or tyre_management > 0.8:
            return PIT
        # aggressive may delay unless tyre is high
        if tyre_wear > 0.78:
            return PIT

    # weather-aware pit (very simplified)
    if weather != "dry" and weather_sensitivity > 0.75 and tyre_wear > 0.6:
        return PIT

    # === PUSH vs CONSERVE logic ===
    # If gap to car ahead is small and aggression is high -> push to attempt overtake
    if gap_ahead <= 1.5 and aggression > 0.7:
        return PUSH_HARD if aggression > 0.85 else PUSH_MEDIUM

    # Late race desperation: try to gain positions if risk high and few laps left
    if laps_remaining <= 6 and risk > 0.7 and position > 1:
        return PUSH_HARD if risk > 0.85 else PUSH_MEDIUM

    # Tyre management: conserve if tyres are wearing and driver cares about tyres
    if tyre_wear > 0.55 and tyre_management > 0.6:
        # stronger conservation if tyre_wear is high
        if tyre_wear > 0.75 or tyre_management > 0.85:
            return CONSERVE_HIGH
        if tyre_wear > 0.65:
            return CONSERVE_MEDIUM
        return CONSERVE_LOW

    # Default behavior: maintain or medium push depending on aggression/risk
    if aggression > 0.65 or risk > 0.65:
        return PUSH_MEDIUM

    return MAINTAIN
