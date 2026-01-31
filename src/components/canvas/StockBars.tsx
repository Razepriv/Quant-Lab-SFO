'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances } from '@react-three/drei'
import * as THREE from 'three'

function Bar({ position, height, speed }: { position: [number, number, number], height: number, speed: number }) {
    const ref = useRef<any>(null)
    const randomOffset = useMemo(() => Math.random() * 100, [])

    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.getElapsedTime()
            // Oscillate height
            ref.current.scale.y = height + Math.sin(t * speed + randomOffset) * (height * 0.3)
        }
    })

    return (
        <Instance
            ref={ref}
            position={position}
            color="#00FFF0"
        />
    )
}

export default function StockBars(props: any) {
    const count = 20
    const bars = useMemo(() => {
        return new Array(count).fill(0).map((_, i) => ({
            position: [(i - count / 2) * 0.5, -2, 0] as [number, number, number],
            height: 1 + Math.random() * 2,
            speed: 0.5 + Math.random()
        }))
    }, [])

    return (
        <group {...props}>
            <Instances range={count}>
                <boxGeometry args={[0.3, 1, 0.3]} />
                <meshStandardMaterial emissive="#00FFF0" emissiveIntensity={0.5} toneMapped={false} color="#001133" />
                {bars.map((bar, i) => (
                    <Bar key={i} {...bar} />
                ))}
            </Instances>
        </group>
    )
}
