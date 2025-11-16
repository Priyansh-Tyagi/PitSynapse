from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.simulation import router as simulation_router

app = FastAPI(title="PitSynapse Backend", version="0.1.0")

# CORS (frontend at localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation_router)

@app.get("/health")
def health():
    return {"status": "ok"}
