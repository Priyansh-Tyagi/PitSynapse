# PitSynapse Agent Decision Logic

This document outlines the decision-making pseudo-code for each agent profile in PitSynapse.

---

## 1. Aggressive Overtaker

**Profile Characteristics:**
- High aggression (0.9) and risk tolerance (0.85)
- Low tyre management (0.4) and pit bias (0.3)
- Moderate weather sensitivity (0.6)

### Decision Rules
```
FUNCTION decide_action(race_state, car_state, competitors):
    tyre_age = car_state.tyre_laps
    tyre_degradation = car_state.tyre_wear
    gap_ahead = race_state.gap_to_car_ahead
    gap_behind = race_state.gap_to_car_behind
    position = car_state.current_position
    
    // PUSH criteria - prioritize aggression
    IF gap_ahead < 1.5 AND tyre_degradation < 0.75:
        RETURN "PUSH_HARD"  // Go for overtake
    
    IF position > 3 AND tyre_degradation < 0.85:
        RETURN "PUSH_HARD"  // Fight for podium
    
    // PIT criteria - only when absolutely necessary
    IF tyre_degradation > 0.85 AND gap_behind > 5.0:
        RETURN "PIT_NOW"
    
    IF tyre_age > 25 AND tyre_degradation > 0.80:
        RETURN "PIT_NEXT_LAP"
    
    // CONSERVE - rare for this profile
    IF tyre_degradation > 0.70 AND gap_ahead > 3.0:
        RETURN "CONSERVE_MEDIUM"
    
    // REACT to safety car or weather
    IF race_state.safety_car_active AND tyre_age > 12:
        RETURN "PIT_NOW"  // Opportunistic pit
    
    IF race_state.rain_probability > 0.7:
        IF car_state.tyre_type == "SLICK":
            RETURN "PIT_FOR_INTERS"
    
    RETURN "MAINTAIN_PACE"
END FUNCTION
```

---

## 2. Conservative Strategist

**Profile Characteristics:**
- Low aggression (0.3) and risk (0.25)
- High tyre management (0.9) and pit bias (0.7)
- High weather sensitivity (0.8)

### Decision Rules
```
FUNCTION decide_action(race_state, car_state, competitors):
    tyre_age = car_state.tyre_laps
    tyre_degradation = car_state.tyre_wear
    gap_ahead = race_state.gap_to_car_ahead
    gap_behind = race_state.gap_to_car_behind
    laps_remaining = race_state.total_laps - race_state.current_lap
    
    // PIT criteria - proactive and early
    IF tyre_degradation > 0.60 AND gap_behind > 3.0:
        RETURN "PIT_NOW"  // Pit early to avoid cliff
    
    IF tyre_age > 15 AND laps_remaining > 10:
        RETURN "PIT_NEXT_LAP"  // Proactive strategy
    
    // CONSERVE - primary mode
    IF tyre_degradation > 0.45:
        RETURN "CONSERVE_HIGH"  // Preserve tyres aggressively
    
    IF gap_ahead > 2.0 AND gap_behind > 2.0:
        RETURN "CONSERVE_MEDIUM"  // Comfortable position
    
    // PUSH - only when safe and necessary
    IF gap_ahead < 0.8 AND tyre_degradation < 0.40 AND gap_behind > 4.0:
        RETURN "PUSH_MEDIUM"  // Conservative overtake attempt
    
    // REACT to weather - proactive changes
    IF race_state.rain_probability > 0.5:
        IF car_state.tyre_type == "SLICK":
            RETURN "PIT_FOR_INTERS"  // Early weather prep
    
    IF race_state.safety_car_active:
        IF tyre_age > 8 OR tyre_degradation > 0.50:
            RETURN "PIT_NOW"  // Free pit stop
    
    IF race_state.track_temp_change > 5:  // degrees C
        RETURN "ADJUST_STRATEGY"  // Recalculate
    
    RETURN "CONSERVE_LOW"
END FUNCTION
```

---

## 3. Balanced Racer

**Profile Characteristics:**
- Moderate aggression (0.55) and risk (0.5)
- Good tyre management (0.65) and neutral pit bias (0.5)
- Balanced weather sensitivity (0.5)

### Decision Rules
```
FUNCTION decide_action(race_state, car_state, competitors):
    tyre_age = car_state.tyre_laps
    tyre_degradation = car_state.tyre_wear
    gap_ahead = race_state.gap_to_car_ahead
    gap_behind = race_state.gap_to_car_behind
    position = car_state.current_position
    undercut_window = check_undercut_opportunity(competitors)
    
    // PUSH criteria - calculated aggression
    IF gap_ahead < 1.2 AND tyre_degradation < 0.60 AND gap_behind > 3.0:
        RETURN "PUSH_HARD"  // Safe overtake window
    
    IF undercut_window AND tyre_age > 10:
        RETURN "PIT_FOR_UNDERCUT"  // Strategic pit
    
    // PIT criteria - balanced timing
    IF tyre_degradation > 0.70 AND gap_behind > 4.0:
        RETURN "PIT_NOW"
    
    IF tyre_age > 20 AND tyre_degradation > 0.65:
        RETURN "PIT_NEXT_LAP"
    
    // CONSERVE - moderate preservation
    IF tyre_degradation > 0.55 AND tyre_degradation < 0.70:
        RETURN "CONSERVE_MEDIUM"
    
    IF gap_ahead > 2.5 AND gap_behind > 2.5:
        RETURN "CONSERVE_LOW"  // Manage gaps
    
    // REACT - adaptive responses
    IF race_state.safety_car_active:
        IF tyre_age > 10 AND tyre_degradation > 0.45:
            RETURN "PIT_NOW"
        ELSE:
            RETURN "STAY_OUT"  // Track position
    
    IF race_state.rain_probability > 0.65:
        RETURN "PIT_FOR_INTERS"
    
    IF position <= 3 AND tyre_degradation < 0.75:
        RETURN "PUSH_MEDIUM"  // Defend podium
    
    RETURN "MAINTAIN_PACE"
END FUNCTION
```

---

## 4. Tyre Whisperer

**Profile Characteristics:**
- Low aggression (0.4) and risk (0.35)
- Exceptional tyre management (0.95) and moderate pit bias (0.4)
- Moderate weather sensitivity (0.55)

### Decision Rules
```
FUNCTION decide_action(race_state, car_state, competitors):
    tyre_age = car_state.tyre_laps
    tyre_degradation = car_state.tyre_wear
    gap_ahead = race_state.gap_to_car_ahead
    gap_behind = race_state.gap_to_car_behind
    predicted_tyre_life = estimate_remaining_tyre_life(car_state)
    laps_remaining = race_state.total_laps - race_state.current_lap
    
    // CONSERVE - primary mode for tyre preservation
    IF tyre_degradation > 0.35:
        RETURN "CONSERVE_HIGH"  // Extend stint maximum
    
    IF tyre_age < 15:
        RETURN "CONSERVE_MEDIUM"  // Build tyre temp gradually
    
    // PIT criteria - stretch to absolute limit
    IF tyre_degradation > 0.85 OR predicted_tyre_life < 3:
        RETURN "PIT_NOW"  // Safety threshold
    
    IF tyre_age > 30 AND tyre_degradation > 0.75:
        RETURN "PIT_NEXT_LAP"  // Extended stint complete
    
    IF laps_remaining < predicted_tyre_life + 2:
        RETURN "NO_PIT_PLANNED"  // One-stop strategy
    
    // PUSH - minimal and strategic only
    IF gap_ahead < 0.5 AND tyre_degradation < 0.40:
        RETURN "PUSH_MEDIUM"  // Brief attack
    
    // REACT - cautious responses
    IF race_state.safety_car_active:
        IF tyre_age < 12 AND competitors_pitting > 50%:
            RETURN "STAY_OUT"  // Different strategy
        ELSE IF tyre_age > 18:
            RETURN "PIT_NOW"
    
    IF race_state.rain_probability > 0.70:
        RETURN "PIT_FOR_INTERS"
    
    IF race_state.track_temp_drop > 3:
        RETURN "INCREASE_CONSERVATION"  // Adapt to cooler track
    
    RETURN "CONSERVE_LOW"
END FUNCTION
```

---

## 5. Chaos Opportunist

**Profile Characteristics:**
- High aggression (0.75) and risk (0.8)
- Moderate tyre management (0.5) and pit bias (0.6)
- Very high weather sensitivity (0.9)

### Decision Rules
```
FUNCTION decide_action(race_state, car_state, competitors):
    tyre_age = car_state.tyre_laps
    tyre_degradation = car_state.tyre_wear
    gap_ahead = race_state.gap_to_car_ahead
    gap_behind = race_state.gap_to_car_behind
    chaos_level = calculate_race_chaos(race_state)
    
    // REACT - primary mode, capitalize on chaos
    IF race_state.safety_car_active:
        IF majority_not_pitting(competitors):
            RETURN "PIT_NOW"  // Contrarian call
        ELSE:
            RETURN "STAY_OUT"  // Opposite strategy
    
    IF race_state.rain_probability > 0.4 AND race_state.rain_probability < 0.7:
        IF car_state.tyre_type == "SLICK":
            RETURN "GAMBLE_STAY_ON_SLICKS"  // Risky call
        ELSE:
            RETURN "PIT_FOR_SLICKS"  // Weather improving
    
    IF race_state.rain_probability > 0.75:
        RETURN "PIT_FOR_FULL_WETS"  // Aggressive preparation
    
    // PUSH - during chaos windows
    IF chaos_level > 0.6 AND tyre_degradation < 0.70:
        RETURN "PUSH_HARD"  // Exploit confusion
    
    IF race_state.recent_incidents > 1 AND gap_ahead < 2.0:
        RETURN "PUSH_HARD"  // Capitalize on disruption
    
    // PIT - strategic gambles
    IF tyre_age > 18 AND see_undercut_chaos_opportunity(competitors):
        RETURN "PIT_FOR_ALTERNATE_STRATEGY"
    
    IF tyre_degradation > 0.75 AND chaos_level > 0.4:
        RETURN "PIT_NOW"  // Reset during chaos
    
    // CONSERVE - rare, only when ahead and safe
    IF position <= 2 AND gap_behind > 5.0 AND chaos_level < 0.3:
        RETURN "CONSERVE_MEDIUM"
    
    IF tyre_degradation > 0.80:
        RETURN "PIT_NEXT_LAP"
    
    RETURN "PUSH_MEDIUM"
END FUNCTION
```

---

## 6. Data-Driven Optimizer

**Profile Characteristics:**
- Moderate aggression (0.5) and risk (0.4)
- High tyre management (0.75) and pit bias (0.65)
- High weather sensitivity (0.7)

### Decision Rules
```
FUNCTION decide_action(race_state, car_state, competitors):
    tyre_age = car_state.tyre_laps
    tyre_degradation = car_state.tyre_wear
    gap_ahead = race_state.gap_to_car_ahead
    gap_behind = race_state.gap_to_car_behind
    
    // Calculate optimization metrics
    optimal_pit_window = calculate_optimal_pit_window(race_state, car_state)
    predicted_finish_time_current = simulate_current_strategy()
    predicted_finish_time_alternate = simulate_alternate_strategies()
    tyre_delta_per_lap = calculate_tyre_degradation_rate()
    fuel_adjusted_pace = calculate_fuel_corrected_laptime()
    
    // PIT criteria - mathematical optimization
    IF race_state.current_lap IN optimal_pit_window:
        IF predicted_finish_time_alternate < predicted_finish_time_current:
            RETURN "PIT_NOW"  // Data says pit
    
    IF tyre_degradation > 0.68 AND (tyre_delta_per_lap * laps_remaining) > 0.25:
        RETURN "PIT_NEXT_LAP"  // Degradation cliff predicted
    
    IF calculate_undercut_value(competitors) > 0.3:
        RETURN "PIT_FOR_UNDERCUT"  // Statistical advantage
    
    // CONSERVE - data-driven preservation
    IF tyre_degradation > 0.50 AND not_in_optimal_pit_window():
        conservation_level = calculate_required_conservation()
        RETURN "CONSERVE_" + conservation_level
    
    IF fuel_adjusted_pace indicates margin_to_target:
        RETURN "CONSERVE_LOW"  // Banking time
    
    // PUSH - calculated aggression
    IF gap_ahead < 1.0 AND tyre_temp_optimal() AND tyre_degradation < 0.55:
        IF statistical_overtake_success() > 0.65:
            RETURN "PUSH_HARD"
    
    IF position_gain_value() > time_loss_risk():
        RETURN "PUSH_MEDIUM"  // Positive expected value
    
    // REACT - probability-based responses
    IF race_state.safety_car_probability_next_5_laps > 0.4:
        IF tyre_age > 12:
            RETURN "WAIT_FOR_SC"  // Likely free stop
    
    IF race_state.safety_car_active:
        pit_decision = optimize_safety_car_strategy(race_state, competitors)
        RETURN pit_decision
    
    IF race_state.rain_probability > 0.6:
        expected_value_pit_now = calculate_weather_strategy_ev("pit_now")
        expected_value_wait = calculate_weather_strategy_ev("wait")
        IF expected_value_pit_now > expected_value_wait:
            RETURN "PIT_FOR_INTERS"
    
    IF race_state.track_evolution_rate > threshold:
        RETURN "RECALCULATE_STRATEGY"  // Conditions changing
    
    RETURN execute_optimal_strategy_action()
END FUNCTION
```

---

## Common Helper Functions

These utility functions are referenced across multiple agent profiles:
```
FUNCTION check_undercut_opportunity(competitors):
    FOR EACH car_ahead IN competitors:
        IF car_ahead.tyre_age > (my_tyre_age + 5):
            IF car_ahead.next_pit_predicted_lap > (current_lap + 2):
                time_delta = calculate_fresh_tyre_advantage()
                IF time_delta > pit_loss_time + 1.0:
                    RETURN TRUE
    RETURN FALSE
END FUNCTION

FUNCTION calculate_race_chaos(race_state):
    chaos_score = 0.0
    
    IF race_state.safety_car_active:
        chaos_score += 0.4
    
    IF race_state.recent_incidents > 0:
        chaos_score += (0.15 * race_state.recent_incidents)
    
    IF race_state.weather_changing:
        chaos_score += 0.3
    
    IF race_state.rain_probability > 0.3 AND race_state.rain_probability < 0.7:
        chaos_score += 0.25  // Uncertainty bonus
    
    position_changes_last_5_laps = count_position_changes()
    chaos_score += (position_changes_last_5_laps * 0.05)
    
    RETURN MIN(chaos_score, 1.0)
END FUNCTION

FUNCTION estimate_remaining_tyre_life(car_state):
    current_degradation = car_state.tyre_wear
    degradation_rate = car_state.tyre_degradation_per_lap
    
    remaining_performance = 1.0 - current_degradation
    estimated_laps = remaining_performance / degradation_rate
    
    RETURN MAX(estimated_laps, 0)
END FUNCTION

FUNCTION calculate_optimal_pit_window(race_state, car_state):
    total_laps = race_state.total_laps
    current_lap = race_state.current_lap
    tyre_life_estimate = 22  // Average stint length
    
    // Two-stop strategy calculation
    window_1_start = FLOOR(total_laps * 0.25)
    window_1_end = FLOOR(total_laps * 0.35)
    
    window_2_start = FLOOR(total_laps * 0.60)
    window_2_end = FLOOR(total_laps * 0.70)
    
    IF current_lap >= window_1_start AND current_lap <= window_1_end:
        RETURN [window_1_start, window_1_end]
    ELSE IF current_lap >= window_2_start AND current_lap <= window_2_end:
        RETURN [window_2_start, window_2_end]
    ELSE:
        RETURN NULL
END FUNCTION
```

---

## Verification Checklist

Each agent profile contains:

✅ **Numeric Multipliers (0-1 scale)**
- aggression
- risk
- tyre_management
- pit_bias
- weather_sensitivity

✅ **Clear Rule Steps with Specific Thresholds**
- Example: `IF tyre_age > 20 AND gap < 3.0 → PIT_NEXT_LAP`
- Example: `IF tyre_degradation > 0.75 AND gap_behind > 5.0 → PIT_NOW`
- Example: `IF rain_probability > 0.7 → PIT_FOR_INTERS`

✅ **Personality Description (2 lines each)**

✅ **Decision Categories Covered**
- PUSH (aggressive pace)
- CONSERVE (tyre management)
- PIT (timing decisions)
- REACT (safety car, weather, incidents)

---

## Usage in Simulation

To use these profiles in your simulation:

1. Load JSON profiles from `data/agent_profiles.json`
2. Assign each AI car a profile based on difficulty or variety
3. Execute the corresponding decision function each lap
4. Apply the profile's multipliers to base car performance stats
5. Log decisions for post-race telemetry analysis
```python
# Example integration
agent = load_profile("aggressive_overtaker")
action = decide_action(race_state, car_state, competitors)
apply_multipliers(car_performance, agent.aggression, agent.tyre_management)
execute_action(action)
```