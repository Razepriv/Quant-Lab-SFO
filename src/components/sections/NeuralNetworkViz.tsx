'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
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
        color: '#00FF88',
        features: ['Price', 'Volume', 'RSI', 'MACD', 'SMA', 'Volatility', 'Momentum', 'News Sentiment']
    },
    { name: 'Hidden Layer 1', neurons: 12, color: '#00FFFF' },
    { name: 'Hidden Layer 2', neurons: 6, color: '#9D00FF' },
    {
        name: 'Output Layer',
        neurons: 3,
        color: '#FF00FF',
        features: ['Buy', 'Hold', 'Sell']
    }
];

export default function NeuralNetworkViz() {
    const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
    const [hoveredNeuron, setHoveredNeuron] = useState<{ layer: number; neuron: number } | null>(null);

    return (
        <section className="py-24 relative overflow-hidden bg-[#050510]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-headline font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text"
                    >
                        Neural Network Architecture
                    </motion.h2>
                    <p className="text-gray-400 text-lg">
                        Interactive visualization of our Deep Learning Alpha Model
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 3D Visualization */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-0 overflow-hidden h-[600px] border border-cyan-500/20 relative">
                            <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} intensity={1} />
                                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                                <NeuralNetwork
                                    layers={LAYERS}
                                    onLayerHover={setSelectedLayer}
                                    onNeuronHover={setHoveredNeuron}
                                />

                                <OrbitControls
                                    enableZoom={true}
                                    enablePan={false}
                                    autoRotate={true}
                                    autoRotateSpeed={0.5}
                                    minPolarAngle={Math.PI / 4}
                                    maxPolarAngle={Math.PI / 1.5}
                                />
                            </Canvas>

                            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                                <p className="text-xs text-gray-500">🖱️ Drag to rotate • Scroll to zoom • Hover neurons</p>
                            </div>
                        </div>
                    </div>

                    {/* Layer Info */}
                    <div className="space-y-4">
                        <div className="glass-card p-6 border-l-4 border-l-cyan-500">
                            <h3 className="text-xl font-bold text-white mb-2">Model Stats</h3>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between"><span>Neurons</span> <span className="text-cyan-400">29</span></div>
                                <div className="flex justify-between"><span>Parameters</span> <span className="text-purple-400">~2.4M</span></div>
                                <div className="flex justify-between"><span>Training Data</span> <span className="text-pink-400">10 Years (Tick)</span></div>
                                <div className="flex justify-between"><span>Accuracy</span> <span className="text-green-400">87.3%</span></div>
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
        setDataFlow(val => (val + delta * 0.5) % 1);
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
        <group position={position}>
            <Sphere
                args={[0.2, 16, 16]}
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
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    toneMapped={false}
                />
            </Sphere>
            {hovered && feature && (
                <Html position={[0, 0.5, 0]} center>
                    <div className="bg-black/90 text-white text-xs px-2 py-1 rounded border border-white/20 whitespace-nowrap z-50 pointer-events-none">
                        {feature}
                    </div>
                </Html>
            )}
        </group>
    )
}

function Connections({ currentLayer, nextLayer, currentX, nextX, dataFlow }: any) {
    const lines: any[] = [];
    const currentHeight = (currentLayer.neurons - 1) * 0.8;
    const nextHeight = (nextLayer.neurons - 1) * 0.8;

    // Limit connections for performance visually
    const maxConn = 150;
    let count = 0;

    for (let i = 0; i < currentLayer.neurons; i++) {
        for (let j = 0; j < nextLayer.neurons; j++) {
            if (count > maxConn) break;
            const start = new THREE.Vector3(currentX, i * 0.8 - currentHeight / 2, 0);
            const end = new THREE.Vector3(nextX, j * 0.8 - nextHeight / 2, 0);

            lines.push(
                <Connection
                    key={`${i}-${j}`}
                    start={start}
                    end={end}
                    color={currentLayer.color}
                    dataFlow={dataFlow + (i + j) * 0.1}
                />
            );
            count++;
        }
    }
    return <>{lines}</>;
}

function Connection({ start, end, color, dataFlow }: any) {
    const ref = useRef<any>(null);

    // Animate a particle along the line
    const progress = (dataFlow % 1);
    const particlePos = new THREE.Vector3().lerpVectors(start, end, progress);

    return (
        <>
            <Line
                points={[start, end]}
                color={color}
                transparent
                opacity={0.05}
                lineWidth={0.5}
            />
            <mesh position={particlePos}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} />
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
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></div>
                <h4 className="font-bold text-white">{layer.name}</h4>
            </div>
            {layer.features && hoveredNeuron !== null && (
                <div className="text-sm text-cyan-400 font-mono">
                    Active: {layer.features[hoveredNeuron]}
                </div>
            )}
        </motion.div>
    )
}
