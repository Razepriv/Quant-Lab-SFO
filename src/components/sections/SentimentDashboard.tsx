'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// --- VISUAL COMPONENTS FAKE DATA FALLBACK ---
const MOCK_DATA = {
    stocks: [
        { ticker: "AAPL", sentiment: "bullish", score: 78.4, article_count: 1247 },
        { ticker: "TSLA", sentiment: "bullish", score: 62.1, article_count: 2891 },
        { ticker: "NVDA", sentiment: "bearish", score: 31.5, article_count: 1634 },
        { ticker: "MSFT", sentiment: "neutral", score: 54.2, article_count: 987 },
        { ticker: "GOOGL", sentiment: "bullish", score: 71.8, article_count: 1456 }
    ],
    market_overview: {
        overall_sentiment: "bullish",
        overall_score: 64.5,
        timestamp: new Date().toISOString()
    }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function SentimentDashboard() {
    const [liveData, setLiveData] = useState<any>(null);

    // Use React Query for initial fetch
    const { data, isLoading } = useQuery({
        queryKey: ['sentiment'],
        queryFn: async () => {
            try {
                const res = await axios.get(`${API_URL}/api/sentiment/current`);
                return res.data;
            } catch (e) {
                console.warn("Backend not reachable, using mock data");
                return MOCK_DATA;
            }
        },
        // Mock data fallback if backend is down
        initialData: MOCK_DATA
    });

    // WebSocket for real-time updates
    useEffect(() => {
        let socket: WebSocket;
        try {
            const wsUrl = API_URL.replace('http', 'ws');
            socket = new WebSocket(`${wsUrl}/ws/sentiment`);

            socket.onopen = () => console.log('Connected to Sentiment WS');
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setLiveData(data);
            };
            socket.onerror = (e) => console.log("WS Error (expected if backend offline):", e);

        } catch (e) {
            console.log("WebSocket connection failed");
        }

        return () => {
            if (socket) socket.close();
        };
    }, []);

    const displayData = liveData || data || MOCK_DATA;

    return (
        <section className="py-24 relative overflow-hidden bg-black/40 backdrop-blur-sm border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-headline font-bold mb-4 bg-gradient-to-r from-[#00FFF0] to-[#0066FF] text-transparent bg-clip-text"
                    >
                        AI Market Sentiment Engine
                    </motion.h2>
                    <p className="text-gray-400 text-lg">
                        Real-time market intelligence powered by FinBERT AI
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sentiment List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {displayData.stocks.map((stock: any, i: number) => (
                                <SentimentItem key={stock.ticker} stock={stock} i={i} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Overview Panel */}
                    <div className="glass-card p-8 h-fit sticky top-24">
                        <h3 className="text-2xl font-bold mb-6 text-white">Market Pulse</h3>

                        <div className="text-center mb-8">
                            <div className="text-6xl mb-2">
                                {displayData.market_overview.overall_sentiment === 'bullish' ? '🟢' :
                                    displayData.market_overview.overall_sentiment === 'bearish' ? '🔴' : '🟡'}
                            </div>
                            <div className="text-4xl font-bold text-[#00FFF0] mb-2">
                                {displayData.market_overview.overall_score}%
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">
                                Overall Sentiment
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-white/10 pt-6">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Fear & Greed</span>
                                <span className="text-[#00BPFF] font-bold">72 (Greed)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">VIX Level</span>
                                <span className="text-white font-bold">14.2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SentimentItem({ stock, i }: { stock: any, i: number }) {
    const isBull = stock.sentiment === 'bullish';
    const isBear = stock.sentiment === 'bearish';

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 border border-white/5 hover:border-[#00FFF0]/30 transition-colors"
        >
            <div className="w-16 text-2xl font-bold text-white">{stock.ticker}</div>

            <div className="flex-1 w-full">
                <div className="flex justify-between mb-2">
                    <span className={`text-sm font-bold uppercase ${isBull ? 'text-green-400' : isBear ? 'text-red-400' : 'text-yellow-400'}`}>
                        {stock.sentiment}
                    </span>
                    <span className="text-white font-mono">{stock.score}%</span>
                </div>

                {/* Bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stock.score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${isBull ? 'bg-gradient-to-r from-green-600 to-[#00FFF0]' : isBear ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-yellow-500'}`}
                    />
                </div>

                <div className="mt-2 text-xs text-gray-500 flex gap-2">
                    <span>💬 {stock.article_count} articles</span>
                    <span>• Updated just now</span>
                </div>
            </div>
        </motion.div>
    )
}
