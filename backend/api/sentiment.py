from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import asyncio
import json
from datetime import datetime
from services.sentiment_analysis import analyzer
import random

router = APIRouter()

TRACKED_TICKERS = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL"]

@router.get("/api/sentiment/current")
async def get_current_sentiment():
    results = []
    for ticker in TRACKED_TICKERS:
        data = await analyzer.analyze_ticker(ticker)
        results.append(data)
    
    avg_score = sum(r['score'] for r in results) / len(results)
    
    return JSONResponse({
        "stocks": results,
        "market_overview": {
            "overall_sentiment": "bullish" if avg_score > 60 else "bearish" if avg_score < 40 else "neutral",
            "overall_score": round(avg_score, 1),
            "timestamp": datetime.utcnow().isoformat()
        }
    })

@router.websocket("/ws/sentiment")
async def sentiment_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Re-use logic from get_current_sentiment
            results = []
            for ticker in TRACKED_TICKERS:
                data = await analyzer.analyze_ticker(ticker)
                results.append(data)
            
            avg_score = sum(r['score'] for r in results) / len(results)
            
            await websocket.send_json({
                "stocks": results,
                "market_overview": {
                    "overall_sentiment": "bullish" if avg_score > 60 else "bearish" if avg_score < 40 else "neutral",
                    "overall_score": round(avg_score, 1),
                    "timestamp": datetime.utcnow().isoformat()
                }
            })
            
            # Send updates every 3 seconds for demo purposes (real-time feel)
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        print("Client disconnected")
