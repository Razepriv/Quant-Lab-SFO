'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus, Cylinder, Octahedron } from '@react-three/drei'

function TunnelRing({ position, color }: { position: [number, number, number], color: string }) {
    const ref = useRef<any>(null)
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.z += 0.01
            // Move ring towards camera to create infinite tunnel illusion
            ref.current.position.z += 0.05
            if (ref.current.position.z > 5) {
                ref.current.position.z = -15
            }
        }
    })
    return (
        <Torus ref={ref} args={[3, 0.02, 16, 100]} position={position}>
            <meshBasicMaterial color={color} transparent opacity={0.3} />
        </Torus>
    )
}

function FeatureObject({ type, position }: { type: 'chip' | 'shield' | 'badge'; position: [number, number, number] }) {
    const ref = useRef<any>(null)
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.01
            ref.current.rotation.x += 0.005
        }
    })

    if (type === 'chip') {
        return (
            <mesh ref={ref} position={position}>
                <boxGeometry args={[1, 1, 0.1]} />
                <meshStandardMaterial color="#00FFF0" wireframe />
            </mesh>
        )
    }
    if (type === 'shield') {
        return (
            <mesh ref={ref} position={position}>
                <icosahedronGeometry args={[0.8, 1]} />
                <meshStandardMaterial color="#0066FF" wireframe />
            </mesh>
        )
    }
    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[0.8]} />
            <meshStandardMaterial color="#9D00FF" wireframe />
        </mesh>
    )
}

export default function FeatureScene() {
    const rings = Array.from({ length: 10 }).map((_, i) => (
        <TunnelRing key={i} position={[0, 0, -i * 2]} color={i % 2 === 0 ? '#00FFF0' : '#0066FF'} />
    ))

    return (
        <group position={[0, -5, -5]}>
            {/* Tunnel Effect */}
            <group>{rings}</group>

            {/* Feature Objects - In a real implementation these would move with scroll */}
            {/* For now, static positions for demo */}
            <FeatureObject type="chip" position={[-4, 0, 0]} />
            <FeatureObject type="shield" position={[0, 0, 0]} />
            <FeatureObject type="badge" position={[4, 0, 0]} />
        </group>
    )
}
