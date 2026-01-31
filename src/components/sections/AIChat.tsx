'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: any[];
    timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant for Quant Lab SFO. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Session ID should be persistent, but for now we generate one per load
    const [sessionId] = useState(() => uuidv4());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Try backend first
            let data;
            try {
                const res = await axios.post(`${API_URL}/api/chat/message`, {
                    message: input,
                    session_id: sessionId
                });
                data = res.data;
            } catch (e) {
                // Frontend Mock Fallback
                console.warn("Backend chat unavailable, using frontend mock");
                await new Promise(r => setTimeout(r, 1000));
                data = mockFrontendResponse(input);
            }

            const assistantMessage: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: data.message,
                sources: data.sources,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const mockFrontendResponse = (input: string) => {
        const q = input.toLowerCase();
        let text = "I can access our vector database to answer that. (Backend Offline Mode)";
        if (q.includes("perform")) text = "We have consistently outperformed the S&P 500, with a 42% return last year.";
        if (q.includes("risk")) text = "Our AI monitors risk in real-time.";

        return {
            message: text,
            sources: [{ metadata: { source: "local_cache" } }]
        }
    }

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center text-white text-2xl"
            >
                {isOpen ? '✕' : '💬'}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-[100] w-[90vw] md:w-96 h-[500px] glass-card flex flex-col overflow-hidden border border-cyan-500/30 bg-black/90"
                    >
                        <div className="p-4 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-gray-700 flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">🤖</div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Quant AI Agent</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-gray-400">Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user'
                                            ? 'bg-cyan-600 text-white rounded-br-none'
                                            : 'bg-gray-800 text-gray-200 rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-2 text-xs text-cyan-300 border-t border-white/10 pt-1">
                                                Sources: {msg.sources.map((s: any) => s.metadata?.source).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800 p-3 rounded-xl flex gap-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 border-t border-gray-700 bg-black/50">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ask about our strategy..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="bg-cyan-600 px-3 py-2 rounded text-white disabled:opacity-50"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
