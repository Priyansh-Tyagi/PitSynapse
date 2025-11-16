"""
Quick test script for the simulation system.
Run from project root: python test_simulation.py
"""
import sys
import json
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "PitSynapse"))

from backend.services.simulation_runner import run_simulation

def test_simulation():
    """Test the simulation with sample data."""
    print("Testing PitSynapse Simulation...")
    
    race_params = {
        "total_laps": 10,
        "weather": "dry",
        "track_id": "test_track"
    }
    
    agent_settings = [
        {
            "id": "agent_1",
            "name": "Aggressive Racer",
            "aggression": 0.9,
            "risk_taking": 0.85,
            "tyre_management": 0.4,
            "pit_bias": 0.3
        },
        {
            "id": "agent_2",
            "name": "Tyre Whisperer",
            "aggression": 0.4,
            "risk_taking": 0.35,
            "tyre_management": 0.95,
            "pit_bias": 0.4
        },
        {
            "id": "agent_3",
            "name": "Balanced Racer",
            "aggression": 0.55,
            "risk_taking": 0.5,
            "tyre_management": 0.65,
            "pit_bias": 0.5
        }
    ]
    
    try:
        result = run_simulation(race_params, agent_settings, seed=42)
        
        print(f"\n[OK] Simulation completed successfully!")
        print(f"   Timeline entries: {len(result['timeline'])}")
        print(f"   Events: {len(result.get('events', []))}")
        print(f"\n[Summary]")
        print(f"   Winner: {result['summary']['winner']}")
        print(f"   Fastest Lap: {result['summary']['fastest_lap']}s")
        print(f"   Avg Tyre Wear: {result['summary']['avg_tyre_wear']}%")
        print(f"   Pit Stops: {result['summary']['pit_stops']}")
        
        # Check for events
        event_types = {}
        for event in result.get('events', []):
            event_type = event.get('event_type', 'unknown')
            event_types[event_type] = event_types.get(event_type, 0) + 1
        
        print(f"\n[Event Breakdown]")
        for event_type, count in event_types.items():
            print(f"   {event_type}: {count}")
        
        print("\n[OK] All tests passed!")
        return True
        
    except Exception as e:
        print(f"\n[ERROR] Simulation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_simulation()
    sys.exit(0 if success else 1)

