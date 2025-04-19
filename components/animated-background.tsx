"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme as useNextTheme } from "next-themes"

export function AnimatedBackground() {
  const { resolvedTheme } = useNextTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20" />
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <ParticleField count={100} isDark={isDark} />
      </Canvas>
    </div>
  )
}

function ParticleField({ count = 100, isDark = false }: { count?: number; isDark?: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const particlePositions = useRef<Float32Array>()
  const particleSpeeds = useRef<Float32Array>()

  useEffect(() => {
    if (!mesh.current) return

    // Initialize positions and speeds
    particlePositions.current = new Float32Array(count * 3)
    particleSpeeds.current = new Float32Array(count * 3)

    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      // Random positions
      const x = (Math.random() - 0.5) * 10
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 10

      particlePositions.current[i * 3] = x
      particlePositions.current[i * 3 + 1] = y
      particlePositions.current[i * 3 + 2] = z

      // Random speeds
      particleSpeeds.current[i * 3] = (Math.random() - 0.5) * 0.01
      particleSpeeds.current[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      particleSpeeds.current[i * 3 + 2] = (Math.random() - 0.5) * 0.01

      // Set initial positions
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }

    mesh.current.instanceMatrix.needsUpdate = true
  }, [count])

  useFrame(() => {
    if (!mesh.current || !particlePositions.current || !particleSpeeds.current) return

    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      // Update positions
      particlePositions.current[i * 3] += particleSpeeds.current[i * 3]
      particlePositions.current[i * 3 + 1] += particleSpeeds.current[i * 3 + 1]
      particlePositions.current[i * 3 + 2] += particleSpeeds.current[i * 3 + 2]

      // Boundary check
      if (Math.abs(particlePositions.current[i * 3]) > 5) {
        particleSpeeds.current[i * 3] *= -1
      }
      if (Math.abs(particlePositions.current[i * 3 + 1]) > 5) {
        particleSpeeds.current[i * 3 + 1] *= -1
      }
      if (Math.abs(particlePositions.current[i * 3 + 2]) > 5) {
        particleSpeeds.current[i * 3 + 2] *= -1
      }

      // Update instance
      dummy.position.set(
        particlePositions.current[i * 3],
        particlePositions.current[i * 3 + 1],
        particlePositions.current[i * 3 + 2],
      )
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }

    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.rotation.y += 0.001
    mesh.current.rotation.x += 0.0005
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color={isDark ? "#8b5cf6" : "#3b82f6"}
        emissive={isDark ? "#6d28d9" : "#2563eb"}
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  )
}
