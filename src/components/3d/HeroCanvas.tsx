"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"
import { useModeStore } from "@/store/useModeStore"

/**
 * La escena 3D del hero.
 *
 * Este módulo es el que arrastra three.js (333 KB comprimidos), así que nunca se
 * importa directamente: se carga con `next/dynamic` desde `HeroBackground`, que
 * además decide si vale la pena montarlo (ver P-01).
 *
 * Aquí ya no se usa `<Environment preset="city" />`. Ese componente descargaba un
 * HDRI de ~1 MB desde raw.githack.com en tiempo de ejecución, poniendo un tercero
 * en la ruta crítica del hero (ver P-02). Las luces de abajo consiguen un
 * resultado equivalente sin salir del propio dominio.
 */
function AbstractShape() {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const isDeveloperMode = useModeStore((state) => state.isDeveloperMode)

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      {/* 32 segmentos en lugar de 64: a esta escala y con 50 % de opacidad la
          silueta es indistinguible y la geometría cuesta la cuarta parte. */}
      <Sphere ref={meshRef} args={[1, 32, 32]} scale={1.5}>
        {/* Base oscura a propósito. Sin el HDRI no hay reflejos de entorno, así
            que un color claro se convertía en una mancha gris plana que competía
            con el texto del hero. Con la base casi negra y metalness alto, las
            luces de color de abajo sólo dibujan el borde: se lee como un
            resplandor y el titular se mantiene legible. */}
        <MeshDistortMaterial
          attach="material"
          color={isDeveloperMode ? "#065f46" : "#18181b"}
          metalness={0.9}
          roughness={isDeveloperMode ? 0.4 : 0.15}
          distort={isDeveloperMode ? 0.6 : 0.4}
          speed={isDeveloperMode ? 3 : 1.5}
          wireframe={isDeveloperMode}
        />
      </Sphere>
    </Float>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      // Sin tope, una pantalla 3x renderiza nueve veces los píxeles de una 1x
      // para un fondo decorativo.
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "low-power" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      {/* Estos dos reemplazan los reflejos que antes venía a buscar el HDRI. */}
      <pointLight position={[-6, 2, -4]} intensity={18} color="#38bdf8" />
      <pointLight position={[6, -3, 2]} intensity={12} color="#34d399" />
      <AbstractShape />
    </Canvas>
  )
}
