'use client'

import { Canvas } from '@react-three/fiber'
import { Preload, OrbitControls, Float } from '@react-three/drei'
import StarField from './StarField'
import HolographicGlobe from './HolographicGlobe'
import StockBars from './StockBars'
import FloatingCubes from './FloatingCubes'
import FeatureScene from './FeatureScene'

export default function CanvasLayout() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0A0A0F]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <color attach="background" args={['#0A0A0F']} />

                {/* Global persistent elements */}
                <StarField />

                {/* SECTION 1: HERO (Y ~ 0) */}
                <group position={[0, 0, 0]}>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <HolographicGlobe position={[2, 0, -2]} scale={1.5} />
                    </Float>
                    <StockBars position={[0, -2, 0]} rotation={[0.2, 0, 0]} />
                </group>

                {/* SECTION 2: ABOUT (Y ~ -10) - Placed to the side */}
                <group position={[-5, -5, -10]}>
                    <FloatingCubes scale={0.5} />
                </group>

                {/* SECTION 3: HOW WE OPERATE (Y ~ -20) */}
                <group position={[0, -15, -10]}>
                    <FeatureScene />
                </group>




                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00FFF0" />

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                <Preload all />
            </Canvas>
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" />
        </div>
    )
}
