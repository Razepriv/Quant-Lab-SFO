from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from api import sentiment, simulator, chat

load_dotenv()

app = FastAPI(
    title="Quant Lab SFO AI API",
    description="Backend for AI strategies, simulations, and chatbot",
    version="1.0.0"
)

# CORS config
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sentiment.router)
app.include_router(simulator.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "Quant Lab SFO AI Brain is Online 🧠"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": {"redis": "unknown", "db": "unknown"}}
