'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/20 group-hover:border-[var(--color-primary)] transition-colors">
                        <Image
                            src="/logo.webp"
                            alt="Quant Lab SFO"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-headline text-lg font-bold tracking-wider text-white group-hover:text-[var(--color-primary)] transition-colors">QUANT LAB</span>
                        <span className="text-[10px] tracking-[0.2em] text-gray-400">SFO FZCO</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {['About', 'System', 'Trust', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-gray-300 hover:text-[var(--color-primary)] transition-colors relative group"
                        >
                            {item.toUpperCase()}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-primary)] transition-all group-hover:w-full" />
                        </Link>
                    ))}
                    <button className="px-6 py-2 bg-[var(--color-primary)] text-black font-bold text-sm tracking-wide clip-path-polygon hover:bg-[#a6fff9] transition-colors">
                        INVESTOR LOGIN
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
