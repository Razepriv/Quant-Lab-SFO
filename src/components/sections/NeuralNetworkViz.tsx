'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html, Environment, Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface LayerConfig {
    name: string;
    neurons: number;
    color: string;
    features?: string[];
}

const LAYERS: LayerConfig[] = [
    {
        name: 'Input Layer',
        neurons: 8,
        color: '#00FFF0',
        features: ['Price', 'Volume', 'RSI', 'MACD', 'SMA', 'Volatility', 'Momentum', 'News']
    },
    { name: 'Hidden Layer 1', neurons: 12, color: '#0066FF' },
    { name: 'Hidden Layer 2', neurons: 6, color: '#9D00FF' },
    {
        name: 'Output Layer',
        neurons: 3,
        color: '#FF0055',
        features: ['Buy', 'Hold', 'Sell']
    }
];

export default function NeuralNetworkViz() {
    const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
    const [hoveredNeuron, setHoveredNeuron] = useState<{ layer: number; neuron: number } | null>(null);

    return (
        <section className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-headline font-bold mb-4 text-[var(--color-primary)]"
                    >
                        NEURAL NETWORK ARCHITECTURE
                    </motion.h2>
                    <div className="w-20 h-1 bg-[var(--color-accent)] mx-auto rounded-full mb-6" />
                    <p className="text-gray-400 text-lg font-tech tracking-wider uppercase">
                        Interactive visualization of our Deep Learning Alpha Model
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 3D Visualization */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-0 overflow-hidden h-[600px] border border-white/10 rounded-2xl relative group hover:border-[var(--color-primary)] transition-colors duration-500 bg-black/80">
                            <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 2]}>
                                <color attach="background" args={['#050505']} />
                                <fog attach="fog" args={['#050505', 10, 25]} />

                                <ambientLight intensity={0.2} />
                                <pointLight position={[10, 10, 10]} intensity={1} color="#00FFF0" />
                                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9D00FF" />
                                <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} />

                                <NeuralNetwork
                                    layers={LAYERS}
                                    onLayerHover={setSelectedLayer}
                                    onNeuronHover={setHoveredNeuron}
                                />

                                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                                <OrbitControls
                                    enableZoom={true}
                                    enablePan={false}
                                    autoRotate={true}
                                    autoRotateSpeed={0.5}
                                    minPolarAngle={Math.PI / 4}
                                    maxPolarAngle={Math.PI / 1.5}
                                    maxDistance={20}
                                    minDistance={5}
                                />

                                <EffectComposer disableNormalPass>
                                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} />
                                    <Noise opacity={0.05} />
                                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                                </EffectComposer>
                            </Canvas>

                            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                                <p className="text-xs text-gray-500 font-mono tracking-widest">
                                    <span className="text-[var(--color-primary)]">⦿</span> LIVE MODEL STATE
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Layer Info */}
                    <div className="space-y-4">
                        <div className="glass-card p-8 border-l-4 border-[var(--color-primary)] rounded-r-2xl">
                            <h3 className="text-xl font-headline font-bold text-white mb-4">MODEL STATS</h3>
                            <div className="space-y-3 text-sm text-gray-300 font-tech">
                                <div className="flex justify-between border-b border-white/5 pb-2"><span>NEURONS</span> <span className="text-[var(--color-primary)] font-bold">29</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-2"><span>PARAMETERS</span> <span className="text-[var(--color-accent)] font-bold">2,405,192</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-2"><span>TRAINING DATA</span> <span className="text-pink-400 font-bold">10 YEARS (TICK)</span></div>
                                <div className="flex justify-between"><span>ACCURACY</span> <span className="text-green-400 font-bold">94.3%</span></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <AnimatePresence>
                                {LAYERS.map((layer, idx) => (
                                    <LayerCard
                                        key={idx}
                                        layer={layer}
                                        idx={idx}
                                        isSelected={selectedLayer === idx}
                                        hoveredNeuron={hoveredNeuron?.layer === idx ? hoveredNeuron.neuron : null}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function NeuralNetwork({ layers, onLayerHover, onNeuronHover }: any) {
    const groupRef = useRef<THREE.Group>(null);
    const [dataFlow, setDataFlow] = useState(0);

    useFrame((state, delta) => {
        setDataFlow(val => (val + delta * 0.8) % 1);
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    const spacing = 4;
    const offsets = layers.map((_: any, i: number) => (i - (layers.length - 1) / 2) * spacing);

    return (
        <group ref={groupRef}>
            {layers.map((layer: any, i: number) => (
                <group key={i} position={[offsets[i], 0, 0]}>
                    <NeuronLayer
                        layer={layer}
                        layerIndex={i}
                        onHover={onLayerHover}
                        onNeuronHover={onNeuronHover}
                    />
                    {i < layers.length - 1 && (
                        <Connections
                            currentLayer={layer}
                            nextLayer={layers[i + 1]}
                            currentX={0}
                            nextX={spacing}
                            dataFlow={dataFlow}
                        />
                    )}
                </group>
            ))}
        </group>
    )
}

function NeuronLayer({ layer, layerIndex, onHover, onNeuronHover }: any) {
    const spacing = 0.8;
    const height = (layer.neurons - 1) * spacing;

    return (
        <group>
            {Array.from({ length: layer.neurons }).map((_, i) => (
                <Neuron
                    key={i}
                    position={[0, i * spacing - height / 2, 0]}
                    color={layer.color}
                    layerIndex={layerIndex}
                    neuronIndex={i}
                    onHover={onHover}
                    onNeuronHover={onNeuronHover}
                    feature={layer.features?.[i]}
                />
            ))}
        </group>
    )
}

function Neuron({ position, color, layerIndex, neuronIndex, onHover, onNeuronHover, feature }: any) {
    const [hovered, setHovered] = useState(false);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.1}>
            <group position={position}>
                {/* Core Neuron */}
                <Sphere
                    args={[0.25, 32, 32]}
                    onPointerEnter={(e) => {
                        e.stopPropagation();
                        setHovered(true);
                        onHover(layerIndex);
                        onNeuronHover({ layer: layerIndex, neuron: neuronIndex });
                    }}
                    onPointerLeave={() => {
                        setHovered(false);
                        onHover(null);
                        onNeuronHover(null);
                    }}
                >
                    <meshPhysicalMaterial
                        color={hovered ? '#ffffff' : color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                        roughness={0.1}
                        metalness={0.8}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        transmission={0.5}
                        thickness={1}
                    />
                </Sphere>

                {/* Outer Glow Halo */}
                <Sphere args={[0.4, 16, 16]}>
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={hovered ? 0.2 : 0.05}
                        depthWrite={false}
                    />
                </Sphere>

                {hovered && feature && (
                    <Html position={[0, 0.6, 0]} center distanceFactor={10}>
                        <div className="glass-card px-3 py-1 rounded text-xs text-white font-mono whitespace-nowrap border-[var(--color-primary)]/50">
                            {feature}
                        </div>
                    </Html>
                )}
            </group>
        </Float>
    )
}

function Connections({ currentLayer, nextLayer, currentX, nextX, dataFlow }: any) {
    const lines = useMemo(() => {
        const temp: any[] = [];
        const currentHeight = (currentLayer.neurons - 1) * 0.8;
        const nextHeight = (nextLayer.neurons - 1) * 0.8;

        // Use fewer connections for cleaner realistic look
        // Connect each neuron to 3 random neurons in next layer + nearest
        for (let i = 0; i < currentLayer.neurons; i++) {
            const start = new THREE.Vector3(currentX, i * 0.8 - currentHeight / 2, 0);

            // Connect to nearest
            const nearestIdx = Math.floor((i / currentLayer.neurons) * nextLayer.neurons);
            for (let offset = -1; offset <= 1; offset++) {
                const targetIdx = nearestIdx + offset;
                if (targetIdx >= 0 && targetIdx < nextLayer.neurons) {
                    const end = new THREE.Vector3(nextX, targetIdx * 0.8 - nextHeight / 2, 0);
                    temp.push({ start, end });
                }
            }
        }
        return temp;
    }, [currentLayer.neurons, nextLayer.neurons]);

    return (
        <group>
            {lines.map((line, i) => (
                <Connection
                    key={i}
                    start={line.start}
                    end={line.end}
                    color={currentLayer.color}
                    dataFlow={dataFlow + i * 0.05}
                />
            ))}
        </group>
    );
}

function Connection({ start, end, color, dataFlow }: any) {
    const progress = (dataFlow % 1);
    const particlePos = new THREE.Vector3().lerpVectors(start, end, progress);

    return (
        <>
            <Line
                points={[start, end]}
                color={color}
                transparent
                opacity={0.08}
                lineWidth={1}
            />
            {/* Glowing Data Particle */}
            <mesh position={particlePos}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                <pointLight distance={1} intensity={1} color={color} decay={2} />
            </mesh>
        </>
    )
}

function LayerCard({ layer, isSelected, hoveredNeuron }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`glass-card p-4 transition-all duration-300 ${isSelected ? 'bg-white/10 border-cyan-500' : 'border-transparent'}`}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: layer.color, backgroundColor: layer.color }}></div>
                <h4 className="font-bold text-white font-headline tracking-wide">{layer.name}</h4>
            </div>
            {layer.features && hoveredNeuron !== null && (
                <div className="text-sm text-[var(--color-primary)] font-mono pl-6">
                    Active: <span className="text-white">{layer.features[hoveredNeuron]}</span>
                </div>
            )}
        </motion.div>
    )
}
