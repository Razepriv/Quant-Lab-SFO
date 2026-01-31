'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: any = {
        hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
        visible: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: 'easeOut' }
        },
    };

    return (
        <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
            {/* Content Container */}
            <div className="container mx-auto px-6 z-20 text-center">
                <motion.div
                    className="max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="flex justify-center mb-6">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                            <img src="/logo.webp" alt="Quant Lab Logo" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,255,240,0.4)]" />
                        </div>
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-[var(--color-primary)] font-tech tracking-[0.2em] text-sm md:text-base mb-4 uppercase"
                    >
                        AI-Driven Algorithmic Trading
                    </motion.h2>

                    <motion.h1
                        variants={itemVariants}
                        className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        QUANT LAB SFO
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Consistent high-double-digit returns, outperforming top global funds through proprietary deep learning models.
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <button className="px-8 py-4 bg-[var(--color-primary)] text-black font-bold tracking-wider clip-path-polygon hover:bg-[#a6fff9] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,240,0.5)]">
                            GET IN TOUCH
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[var(--color-primary)] to-transparent" />
            </motion.div>
        </section>
    );
}
