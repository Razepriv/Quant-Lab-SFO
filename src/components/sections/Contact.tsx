'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import InteractiveGlobe from '@/components/canvas/InteractiveGlobe';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
    return (
        <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">

                {/* Left Column: Contact Info */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col justify-center z-10"
                >
                    <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8">Contact Us</h2>
                    <div className="h-1 w-20 bg-[var(--color-secondary)] mb-12" />

                    <p className="text-xl text-gray-300 mb-10">Better yet, see us in person!</p>

                    <div className="space-y-8 mb-12">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[var(--color-primary)]">
                                <MapPin />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Quant Lab SFO FZCO</h4>
                                <p className="text-gray-400">Unit H11.11 C01-KB, DMCC Business Centre<br />Uptown Dubai, UAE</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[var(--color-primary)]">
                                <Mail />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Email Us</h4>
                                <p className="text-gray-400">info@quantlabsfo.com</p>
                            </div>
                        </div>
                    </div>

                    <button className="self-start px-8 py-4 bg-[var(--color-primary)] text-black font-bold tracking-wider clip-path-polygon hover:bg-[#a6fff9] transition-all hover:scale-105">
                        MESSAGE ON WHATSAPP
                    </button>

                </motion.div>

                {/* Right Column: 3D Interactive Globe */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="h-[500px] w-full relative hidden md:block"
                >
                    <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} gl={{ alpha: true }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} color="#00FFF0" />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9D00FF" />

                        <InteractiveGlobe />

                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>
                </motion.div>

            </div>
        </section>
    );
}
