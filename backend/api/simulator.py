from fastapi import APIRouter
from pydantic import BaseModel
from services.backtest_engine import backtest_engine
import asyncio

router = APIRouter()

class SimulationRequest(BaseModel):
    ticker: str
    strategy: str
    period: str
    initial_capital: float
    risk_level: str

@router.post("/api/simulator/run")
async def run_simulation(req: SimulationRequest):
    # Simulate processing time
    await asyncio.sleep(1.5)
    
    result = backtest_engine.run_backtest(
        req.ticker, req.strategy, req.period, req.initial_capital, req.risk_level
    )
    
    return {"success": True, "data": result}
