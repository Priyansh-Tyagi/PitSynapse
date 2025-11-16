"""
Start the FastAPI backend server.
Run this from the PitSynapse directory.
"""
import uvicorn
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

if __name__ == "__main__":
    print("Starting PitSynapse Backend Server...")
    print("Server will be available at http://localhost:8000")
    print("API docs at http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            app_dir=str(backend_path)
        )
    except KeyboardInterrupt:
        print("\nServer stopped.")

