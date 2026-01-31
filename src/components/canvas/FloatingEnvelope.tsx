'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export default function FloatingEnvelope(props: any) {
    const ref = useRef<any>(null)
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2
            ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
        }
    })

    return (
        <group ref={ref} {...props}>
            <mesh>
                <boxGeometry args={[1.5, 1, 0.1]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[1.4, 0.9]} />
                <meshBasicMaterial color="#00FFF0" wireframe />
            </mesh>
        </group>
    )
}
