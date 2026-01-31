'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import * as THREE from 'three'

function Cube({ position, rotation, scale }: any) {
    const ref = useRef<any>(null)
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.2
            ref.current.rotation.y += delta * 0.3
        }
    })
    return <Instance ref={ref} position={position} rotation={rotation} scale={scale} />
}

export default function FloatingCubes(props: any) {
    const count = 30
    const data = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            scale: 0.2 + Math.random() * 0.5
        }))
    }, [])

    return (
        <Instances range={count} {...props}>
            <boxGeometry />
            <meshBasicMaterial color="#0066FF" wireframe />
            {data.map((d, i) => (
                <Cube key={i} {...d} />
            ))}
        </Instances>
    )
}
