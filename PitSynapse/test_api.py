"""
Test script for the FastAPI backend.
Tests the /simulate endpoint with sample data.
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint."""
    print("Testing /health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print(f"  [OK] Health check passed: {response.json()}")
            return True
        else:
            print(f"  [FAIL] Health check returned {response.status_code}")
            return False
    except Exception as e:
        print(f"  [FAIL] Health check failed: {e}")
        return False

def test_simulate():
    """Test /api/simulate endpoint."""
    print("\nTesting /api/simulate endpoint...")
    
    request_data = {
        "race": {
            "total_laps": 10,
            "weather": "dry",
            "track_id": "test_track"
        },
        "agents": [
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
    }
    
    try:
        print("  Sending simulation request...")
        response = requests.post(
            f"{BASE_URL}/api/simulate",
            json=request_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"  [OK] Simulation completed!")
            print(f"    Timeline entries: {len(result.get('timeline', []))}")
            print(f"    Events: {len(result.get('events', []))}")
            print(f"    Winner: {result.get('summary', {}).get('winner', 'N/A')}")
            print(f"    Fastest Lap: {result.get('summary', {}).get('fastest_lap', 0)}s")
            
            # Check event types
            events = result.get('events', [])
            event_types = {}
            for event in events:
                event_type = event.get('event_type', 'unknown')
                event_types[event_type] = event_types.get(event_type, 0) + 1
            
            print(f"    Event breakdown:")
            for event_type, count in event_types.items():
                print(f"      {event_type}: {count}")
            
            return True
        else:
            print(f"  [FAIL] Simulation returned {response.status_code}")
            print(f"    Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"  [FAIL] Simulation request failed: {e}")
        return False

def main():
    """Run all tests."""
    print("=" * 60)
    print("PitSynapse API Test Suite")
    print("=" * 60)
    
    # Wait for server to be ready
    print("\nWaiting for server to start...")
    max_retries = 10
    for i in range(max_retries):
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            if response.status_code == 200:
                print("Server is ready!")
                break
        except:
            if i < max_retries - 1:
                print(f"  Retry {i+1}/{max_retries}...")
                time.sleep(2)
            else:
                print("  [ERROR] Server not responding. Make sure backend is running:")
                print("    cd PitSynapse/backend")
                print("    uvicorn main:app --reload --port 8000")
                return False
    
    # Run tests
    health_ok = test_health()
    simulate_ok = test_simulate()
    
    print("\n" + "=" * 60)
    if health_ok and simulate_ok:
        print("[SUCCESS] All tests passed!")
        return True
    else:
        print("[FAILURE] Some tests failed")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

