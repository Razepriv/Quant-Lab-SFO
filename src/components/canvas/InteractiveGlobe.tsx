'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

export default function InteractiveGlobe(props: any) {
    const ref = useRef<any>(null)

    useFrame((state) => {
        if (ref.current) {
            // Slow rotation
            ref.current.rotation.y += 0.001
        }
    })

    // Dubai roughly at lat 25.2, lon 55.3. 
    // Convert to 3D coords on sphere radius 1.5
    // simple marker visual

    return (
        <group {...props}>
            <Sphere ref={ref} args={[1.5, 64, 64]}>
                <meshPhongMaterial
                    color="#001a33"
                    emissive="#000011"
                    specular="#111111"
                    shininess={10}
                    transparent
                    opacity={0.9}
                    wireframe={false}
                />
            </Sphere>
            {/* Grid overlay */}
            <Sphere args={[1.51, 32, 32]}>
                <meshBasicMaterial color="#0066FF" wireframe transparent opacity={0.1} />
            </Sphere>

            {/* Simple marker for Dubai (static relative to world, but should rotate with globe if child) */}
            {/* Actually if it's child of rotating sphere it rotates with it */}
            <mesh position={[0.8, 0.6, 1.1]} rotation={[0, 0, 0]}>
                <Sphere args={[0.05, 16, 16]}>
                    <meshBasicMaterial color="#00FFF0" />
                </Sphere>
                <Html distanceFactor={10}>
                    <div className="text-[var(--color-primary)] text-xs font-bold whitespace-nowrap bg-black/50 p-1 rounded backdrop-blur-sm">
                        Dubai HQ
                    </div>
                </Html>
            </mesh>
        </group>
    )
}
