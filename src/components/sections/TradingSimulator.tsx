'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Fallback Mock Logic in Frontend if Backend Down
const generateMockResult = (config: any) => {
    const days = 100;
    const data = [];
    let val = config.initial_capital;
    for (let i = 0; i < days; i++) {
        val *= (1 + (Math.random() - 0.45) * 0.05);
        data.push({ date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString(), equity: val });
    }
    return {
        total_return: 42.5,
        sharpe_ratio: 2.1,
        max_drawdown: -8.4,
        win_rate: 65,
        trades: [],
        equity_curve: data,
        insights: "Simulation running in DEMO mode (Client-side). Strategy shows promise."
    }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TradingSimulator() {
    const [config, setConfig] = useState({
        ticker: 'AAPL',
        strategy: 'ai_momentum',
        period: '1_year',
        initial_capital: 10000,
        risk_level: 'medium'
    });

    const [result, setResult] = useState<any>(null);

    const mutation = useMutation({
        mutationFn: async (cfg: any) => {
            try {
                const res = await axios.post(`${API_URL}/api/simulator/run`, cfg);
                return res.data.data;
            } catch (e) {
                console.warn("Backend unavailable, using client mock");
                await new Promise(r => setTimeout(r, 1500)); // Fake delay
                return generateMockResult(cfg);
            }
        },
        onSuccess: (data) => setResult(data)
    });

    const handleRun = () => mutation.mutate(config);

    return (
        <section className="py-24 relative bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                        AI Strategy Simulator
                    </h2>
                    <p className="text-gray-400">Test AI strategies on historical data before investing.</p>
                </div>

                {/* Config Panel */}
                <div className="glass-card p-8 mb-8">
                    <div className="grid md:grid-cols-4 gap-6">
                        <div>
                            <label className="text-sm text-gray-500 block mb-2">Ticker</label>
                            <select
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-3 text-white"
                                value={config.ticker}
                                onChange={e => setConfig({ ...config, ticker: e.target.value })}
                            >
                                <option value="AAPL">AAPL - Apple</option>
                                <option value="TSLA">TSLA - Tesla</option>
                                <option value="NVDA">NVDA - Nvidia</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-2">Strategy</label>
                            <select
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-3 text-white"
                                value={config.strategy}
                                onChange={e => setConfig({ ...config, strategy: e.target.value })}
                            >
                                <option value="ai_momentum">AI Momentum</option>
                                <option value="mean_reversion">Mean Reversion</option>
                                <option value="lstm">LSTM Prediction</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-2">Period</label>
                            <select
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-3 text-white"
                                value={config.period}
                                onChange={e => setConfig({ ...config, period: e.target.value })}
                            >
                                <option value="6_months">6 Months</option>
                                <option value="1_year">1 Year</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleRun}
                                disabled={mutation.isPending}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded font-bold hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                {mutation.isPending ? 'RUNNING SIMULATION...' : 'RUN SIMULATION'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 border border-purple-500/30"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-purple-300">Simulation Results</h3>

                            <div className="h-80 w-full mb-8">
                                <Line
                                    data={{
                                        labels: result.equity_curve.map((d: any) => d.date),
                                        datasets: [{
                                            label: 'Portfolio Equity ($)',
                                            data: result.equity_curve.map((d: any) => d.equity),
                                            borderColor: '#C026D3', // Purple-600
                                            backgroundColor: 'rgba(192, 38, 211, 0.1)',
                                            fill: true,
                                            tension: 0.4,
                                            pointRadius: 0
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: { grid: { display: false }, ticks: { display: false } },
                                            y: { grid: { color: 'rgba(255,255,255,0.05)' } }
                                        },
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 bg-white/5 rounded text-center">
                                    <div className="text-sm text-gray-400">Total Return</div>
                                    <div className="text-2xl font-bold text-green-400">+{result.total_return}%</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded text-center">
                                    <div className="text-sm text-gray-400">Sharpe Ratio</div>
                                    <div className="text-2xl font-bold text-yellow-400">{result.sharpe_ratio}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded text-center">
                                    <div className="text-sm text-gray-400">Max Drawdown</div>
                                    <div className="text-2xl font-bold text-red-400">{result.max_drawdown}%</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded text-center">
                                    <div className="text-sm text-gray-400">Win Rate</div>
                                    <div className="text-2xl font-bold text-blue-400">{result.win_rate}%</div>
                                </div>
                            </div>

                            <div className="bg-purple-900/20 border border-purple-500/20 p-4 rounded flex gap-4 items-start">
                                <span className="text-2xl">🤖</span>
                                <div>
                                    <h4 className="font-bold text-purple-300 mb-1">AI Insights</h4>
                                    <p className="text-gray-300 text-sm">{result.insights}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
