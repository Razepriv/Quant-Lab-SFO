'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative py-20 bg-black/80 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <h3 className="font-headline text-2xl font-bold text-white mb-2">QUANT LAB SFO</h3>
                        <p className="text-gray-400 text-sm">Quant Lab Single Family Office</p>
                    </div>

                    <div className="flex gap-8">
                        {['LinkedIn', 'Twitter', 'Email'].map((social) => (
                            <Link key={social} href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                                {social}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
                    <p>&copy; 2025 Quant Lab SFO. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
