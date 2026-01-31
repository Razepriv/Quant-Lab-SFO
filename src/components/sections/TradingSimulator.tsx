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
        <section className="py-24 relative bg-transparent border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-[var(--color-primary)]">
                        AI STRATEGY SIMULATOR
                    </h2>
                    <div className="w-20 h-1 bg-[var(--color-secondary)] mx-auto rounded-full mb-6" />
                    <p className="text-gray-400 font-tech tracking-wider uppercase">
                        Backtest institutional-grade strategies on historical data
                    </p>
                </div>

                {/* Config Panel */}
                <div className="glass-card p-10 mb-12 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <div className="text-9xl font-tech font-bold text-[var(--color-primary)]">AI</div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative z-10">
                        <div>
                            <label className="text-xs font-mono text-[var(--color-primary)] block mb-3 uppercase tracking-wider">Ticker Symbol</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none font-tech transition-colors appearance-none"
                                value={config.ticker}
                                onChange={e => setConfig({ ...config, ticker: e.target.value })}
                            >
                                <option value="AAPL">AAPL - Apple</option>
                                <option value="TSLA">TSLA - Tesla</option>
                                <option value="NVDA">NVDA - Nvidia</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-mono text-[var(--color-primary)] block mb-3 uppercase tracking-wider">Strategy Model</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none font-tech transition-colors appearance-none"
                                value={config.strategy}
                                onChange={e => setConfig({ ...config, strategy: e.target.value })}
                            >
                                <option value="ai_momentum">AI Momentum</option>
                                <option value="mean_reversion">Mean Reversion</option>
                                <option value="lstm">LSTM Prediction</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-mono text-[var(--color-primary)] block mb-3 uppercase tracking-wider">Time Period</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none font-tech transition-colors appearance-none"
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
                                className="w-full bg-[var(--color-primary)] text-black py-3 rounded font-bold font-headline tracking-widest hover:bg-[#a6fff9] transition-all hover:shadow-[0_0_20px_rgba(0,255,240,0.4)] disabled:opacity-50 clip-path-polygon"
                            >
                                {mutation.isPending ? 'PROCESSING...' : 'RUN BACKTEST'}
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
                            className="glass-card p-10 border border-white/10 rounded-2xl"
                        >
                            <h3 className="text-2xl font-headline font-bold mb-8 text-white flex items-center gap-3">
                                <span className="w-1 h-8 bg-[var(--color-primary)]" />
                                BACKTEST RESULTS
                            </h3>

                            <div className="h-96 w-full mb-10">
                                <Line
                                    data={{
                                        labels: result.equity_curve.map((d: any) => d.date),
                                        datasets: [{
                                            label: 'Portfolio Equity ($)',
                                            data: result.equity_curve.map((d: any) => d.equity),
                                            borderColor: '#00FFF0', // Primary Cyan
                                            backgroundColor: (context) => {
                                                const ctx = context.chart.ctx;
                                                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                                                gradient.addColorStop(0, 'rgba(0, 255, 240, 0.2)');
                                                gradient.addColorStop(1, 'rgba(0, 255, 240, 0)');
                                                return gradient;
                                            },
                                            borderWidth: 2,
                                            fill: true,
                                            tension: 0.1,
                                            pointRadius: 0,
                                            pointHoverRadius: 6
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: { grid: { display: false }, ticks: { display: false } },
                                            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666', font: { family: 'Rajdhani' } } }
                                        },
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="p-6 bg-black/40 rounded-xl border border-white/5 text-center group hover:border-[var(--color-primary)] transition-colors">
                                    <div className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Total Return</div>
                                    <div className="text-3xl font-tech font-bold text-green-400">+{result.total_return}%</div>
                                </div>
                                <div className="p-6 bg-black/40 rounded-xl border border-white/5 text-center group hover:border-[var(--color-primary)] transition-colors">
                                    <div className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Sharpe Ratio</div>
                                    <div className="text-3xl font-tech font-bold text-[var(--color-primary)]">{result.sharpe_ratio}</div>
                                </div>
                                <div className="p-6 bg-black/40 rounded-xl border border-white/5 text-center group hover:border-[var(--color-primary)] transition-colors">
                                    <div className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Max Drawdown</div>
                                    <div className="text-3xl font-tech font-bold text-red-400">{result.max_drawdown}%</div>
                                </div>
                                <div className="p-6 bg-black/40 rounded-xl border border-white/5 text-center group hover:border-[var(--color-primary)] transition-colors">
                                    <div className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Win Rate</div>
                                    <div className="text-3xl font-tech font-bold text-[var(--color-secondary)]">{result.win_rate}%</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent border-l-4 border-[var(--color-primary)] p-6 rounded flex gap-4 items-start">
                                <span className="text-2xl">🤖</span>
                                <div>
                                    <h4 className="font-bold text-[var(--color-primary)] font-headline mb-2 uppercase tracking-wider">AI Model Insights</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">{result.insights}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
