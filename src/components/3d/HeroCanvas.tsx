"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useModeStore } from '@/store/useModeStore'

function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null)
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color={isDeveloperMode ? "#10b981" : "#e4e4e7"} /* emerald-500 or zinc-200 */
          envMapIntensity={isDeveloperMode ? 0.2 : 1}
          clearcoat={isDeveloperMode ? 0 : 1}
          clearcoatRoughness={0.1}
          metalness={isDeveloperMode ? 0.8 : 0.1}
          roughness={isDeveloperMode ? 0.4 : 0.2}
          attach="material"
          distort={isDeveloperMode ? 0.6 : 0.4}
          speed={isDeveloperMode ? 3 : 1.5}
          wireframe={isDeveloperMode}
        />
      </Sphere>
    </Float>
  )
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10 h-[100vh] w-full pointer-events-none opacity-50 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <AbstractShape />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
