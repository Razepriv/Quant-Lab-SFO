'use client';

import { motion } from 'framer-motion';

export default function Subscribe() {
    return (
        <section className="relative min-h-[60vh] flex items-center justify-center py-20">
            <div className="container mx-auto px-6 z-10 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="max-w-2xl mx-auto glass-card p-10 rounded-3xl border border-white/10"
                >
                    <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Subscribe</h2>
                    <p className="text-gray-400 mb-8">Sign up to hear from us about our latest AI breakthroughs.</p>

                    <form className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        />

                        <div className="flex items-center gap-2 text-sm text-gray-400 text-left">
                            <input type="checkbox" id="agree" className="accent-[var(--color-primary)]" />
                            <label htmlFor="agree">I agree to receive marketing emails</label>
                        </div>

                        <button type="submit" className="w-full py-4 bg-[var(--color-primary)] text-black font-bold tracking-wider rounded-lg hover:bg-[#a6fff9] transition-all hover:scale-[1.02]">
                            SIGN UP
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
