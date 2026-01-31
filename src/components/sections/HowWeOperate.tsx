'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const features = [
    {
        title: "SYSTEMATIC EDGE",
        description: "In-house AI engine sweeps 4,500+ U.S. tickers daily for tradable patterns",
        details: ["• Neural network visualized", "• Glowing circuits", "• Real-time rotation"]
    },
    {
        title: "DISCIPLINED RISK",
        description: "Tight risk engine keeps any single loss below few percent of the equity",
        details: ["• Holographic gauge", "• Pulsing safety rings", "• Stop-loss automation"]
    },
    {
        title: "AUDITED CONTROL",
        description: "Big-Four audit, DMCC license, rock-solid compliance",
        details: ["• Rotating certification seal", "• Glowing checkmarks", "• Regulatory adherence"]
    }
];

export default function HowWeOperate() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-20 px-20">
                    {features.map((feature, i) => (
                        <div key={i} className="relative w-[80vw] md:w-[60vw] h-[70vh] flex-shrink-0">
                            <div className="absolute inset-0 glass-card bg-black/40 rounded-3xl border border-white/10 p-12 flex flex-col justify-end overflow-hidden group hover:border-[var(--color-primary)] transition-colors duration-500">
                                <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <div className="text-9xl font-tech font-bold text-[var(--color-primary)]">0{i + 1}</div>
                                </div>

                                <h3 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-white group-hover:text-[var(--color-primary)] transition-colors">{feature.title}</h3>
                                <div className="h-1 w-20 bg-[var(--color-secondary)] mb-8" />
                                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8">{feature.description}</p>

                                <ul className="space-y-3">
                                    {feature.details.map((detail, j) => (
                                        <li key={j} className="text-sm font-mono text-[var(--color-accent)]">{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
