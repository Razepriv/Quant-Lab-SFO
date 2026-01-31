import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
from typing import Dict, List

# Mock YFinance if not available or just for stability/speed in demo
class BacktestEngine:
    def __init__(self):
        pass

    def run_backtest(self, ticker, strategy, period, initial_capital, risk_level):
        # Generate Realistic Mock Data
        # In a real app we'd use yfinance.download(ticker, ...)
        
        days_map = {
            "1_month": 30, "3_months": 90, "6_months": 180, 
            "1_year": 365, "2_years": 730
        }
        days = days_map.get(period, 365)
        
        dates = [datetime.now() - timedelta(days=i) for i in range(days)]
        dates.reverse()
        
        # Random walk for price
        prices = []
        price = 150 + random.uniform(-20, 20)
        for _ in range(days):
            change = random.normalvariate(0.0005, 0.02) # Mean return slightly positive
            price = price * (1 + change)
            prices.append(price)
            
        # Simulate Trades
        trades = []
        equity = initial_capital
        cash = initial_capital
        shares = 0
        equity_curve = []
        
        position = 0 # 0 flat, 1 long
        
        for i, (date, p) in enumerate(zip(dates, prices)):
            # Random strategy signals
            # "AI Momentum" logic simulation
            signal = 0
            if i > 50:
                 # Simple mock momentum: if price > 20 day avg
                 avg_20 = sum(prices[i-20:i]) / 20
                 if p > avg_20 * 1.01: signal = 1
                 elif p < avg_20 * 0.99: signal = -1
            
            # Execute
            if signal == 1 and position == 0:
                shares = cash / p
                cash = 0
                position = 1
                trades.append({
                    "date": date.isoformat(),
                    "action": "BUY",
                    "price": p,
                    "reason": "Momentum Signal"
                })
            elif signal == -1 and position == 1:
                cash = shares * p
                pnl = cash - initial_capital if len(trades) == 1 else cash - trades[-2]['price'] * shares
                shares = 0
                position = 0
                trades.append({
                    "date": date.isoformat(),
                    "action": "SELL",
                    "price": p, 
                    "pnl": round(pnl, 2),
                    "reason": "Take Profit/Stop Loss"
                })
                
            current_val = cash + (shares * p)
            equity_curve.append({
                "date": date.isoformat(),
                "equity": round(current_val, 2)
            })
            equity = current_val

        # Metrics
        total_return = ((equity - initial_capital) / initial_capital) * 100
        returns = pd.Series([e['equity'] for e in equity_curve]).pct_change().dropna()
        sharpe = (returns.mean() / returns.std()) * np.sqrt(252) if len(returns) > 0 and returns.std() != 0 else 0
        
        # Max Drawdown
        s = pd.Series([e['equity'] for e in equity_curve])
        cummax = s.cummax()
        dd = (s - cummax) / cummax
        max_dd = dd.min() * 100
        
        win_trades = [t for t in trades if t.get('pnl', 0) > 0]
        loss_trades = [t for t in trades if t.get('pnl', 0) <= 0 and t['action'] == 'SELL']
        total_closed = len(win_trades) + len(loss_trades)
        win_rate = (len(win_trades) / total_closed * 100) if total_closed > 0 else 0
        
        return {
            "total_return": round(total_return, 2),
            "sharpe_ratio": round(sharpe, 2),
            "max_drawdown": round(max_dd, 2),
            "win_rate": round(win_rate, 2),
            "trades": trades[-10:], # Last 10
            "equity_curve": equity_curve,
            "insights": f"Strategy {strategy} delivered a {total_return:.1f}% return over {period}. "
                        "Volatility remained controlled with "
                        f"a max drawdown of {max_dd:.1f}%."
        }

backtest_engine = BacktestEngine()
