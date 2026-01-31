'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TorusKnot } from '@react-three/drei'

export default function HoloLogo(props: any) {
    const ref = useRef<any>(null)
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x += 0.01
            ref.current.rotation.y += 0.01
        }
    })

    return (
        <TorusKnot ref={ref} args={[1, 0.3, 100, 16]} {...props}>
            <meshStandardMaterial color="#9D00FF" wireframe emissive="#9D00FF" emissiveIntensity={0.5} />
        </TorusKnot>
    )
}
