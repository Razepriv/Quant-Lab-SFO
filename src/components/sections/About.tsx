'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const StatCounter = ({ value, label, suffix = '' }: { value: number, label: string, suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let start = 0;
            const end = value;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out quart
                const ease = 1 - Math.pow(1 - progress, 4);

                setCount(Math.floor(start + (end - start) * ease));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }, 500);
        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-tech font-bold text-[var(--color-primary)]">
                {count}{suffix}
            </span>
            <span className="text-xs md:text-sm tracking-widest mt-2">{label}</span>
        </div>
    );
};

export default function About() {
    return (
        <section id="about" className="relative w-full min-h-screen flex items-center justify-center py-20">
            <div className="container mx-auto px-6 z-20">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto glass-card p-10 md:p-16 rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />

                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">About Us</h2>
                        <div className="w-20 h-1 bg-[var(--color-accent)] mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10 pb-12 mb-12">
                        <StatCounter value={10} label="YEARS DATA" suffix="+" />
                        <StatCounter value={4500} label="US TICKERS" suffix="+" />
                        <StatCounter value={99} label="UPTIME" suffix="%" />
                    </div>

                    <div className="space-y-6 text-gray-300 leading-relaxed text-center md:text-left">
                        <p>
                            Quant Lab SFO builds trading strategies in-house, feeding an AI engine trained on 10+ years of tick-level data.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium text-white">
                            {['• Orders fired in milliseconds', '• Strict position size caps', '• Fully automated execution', '• Risk-first approach'].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 + 0.5 }}
                                    className="flex items-center gap-2"
                                >
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
