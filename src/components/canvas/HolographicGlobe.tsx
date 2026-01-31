'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

export default function HolographicGlobe(props: any) {
    const ref = useRef<any>(null)

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.002
        }
    })

    return (
        <group {...props}>
            {/* Core Sphere */}
            <Sphere args={[1, 64, 64]} ref={ref}>
                <MeshDistortMaterial
                    color="#0066FF"
                    wireframe
                    transparent
                    opacity={0.1}
                    distort={0.4}
                    speed={1.5}
                />
            </Sphere>
            {/* Glow Halo */}
            <Sphere args={[0.8, 32, 32]}>
                <meshBasicMaterial color="#00FFF0" transparent opacity={0.05} />
            </Sphere>
        </group>
    )
}
