'use client';

import { motion } from 'framer-motion';

export default function Trust() {
    return (
        <section className="relative min-h-[50vh] flex flex-col items-center justify-center py-20 bg-gradient-to-b from-transparent to-black/50">
            <div className="text-center z-10">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white mb-10"
                >
                    Transparent, Big-Four Audited, <br /> and 100% Family-Funded.
                </motion.h2>

                <div className="flex flex-wrap justify-center gap-10">
                    {['Big-Four Audited', 'DMCC Licensed', 'Family Funded'].map((badge, i) => (
                        <motion.div
                            key={badge}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            className="w-40 h-40 glass-card rounded-full flex items-center justify-center border border-[var(--color-primary)] shadow-[0_0_20px_rgba(0,255,240,0.2)]"
                        >
                            <span className="text-center font-bold text-[var(--color-primary)]">{badge}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
