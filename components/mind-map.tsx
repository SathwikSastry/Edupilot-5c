"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, OrbitControls, Line } from "@react-three/drei"
import { Vector3 } from "three"
import type * as THREE from "three"
import type { JSX } from "react/jsx-runtime"

interface MindMapNode {
  id: string
  text: string
  position: [number, number, number]
  children?: MindMapNode[]
}

interface MindMapData {
  center: string
  nodes: MindMapNode[]
}

interface MindMapProps {
  data: MindMapData | null
  className?: string
}

function NodeComponent({ node, level = 0 }: { node: MindMapNode; level?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]
  const color = colors[level % colors.length]

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {node.text}
      </Text>
      {node.children?.map((child, index) => (
        <NodeComponent key={child.id || index} node={child} level={level + 1} />
      ))}
    </group>
  )
}

function ConnectionLines({ nodes }: { nodes: MindMapNode[] }) {
  const lines: JSX.Element[] = []

  const addLines = (parentNode: MindMapNode, level = 0) => {
    if (parentNode.children) {
      parentNode.children.forEach((child, index) => {
        const start = new Vector3(...parentNode.position)
        const end = new Vector3(...child.position)

        lines.push(
          <Line
            key={`${parentNode.id}-${child.id || index}`}
            points={[start, end]}
            color="#64748b"
            lineWidth={2}
            opacity={0.6}
          />,
        )

        addLines(child, level + 1)
      })
    }
  }

  nodes.forEach((node) => addLines(node))

  return <>{lines}</>
}

function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

export function MindMap({ data, className = "" }: MindMapProps) {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-muted/50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <p className="text-muted-foreground">No mind map data available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Generate a mind map from your study content to see it visualized here
          </p>
        </div>
      </div>
    )
  }

  // Ensure all nodes have valid positions
  const processedNodes = data.nodes.map((node, index) => ({
    ...node,
    id: node.id || `node-${index}`,
    position:
      Array.isArray(node.position) && node.position.length === 3
        ? (node.position as [number, number, number])
        : ([
            Math.cos((index * 2 * Math.PI) / data.nodes.length) * 3,
            Math.sin((index * 2 * Math.PI) / data.nodes.length) * 3,
            0,
          ] as [number, number, number]),
  }))

  return (
    <div className={`h-96 bg-background rounded-lg border ${className}`}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <CameraController />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        {/* Center node */}
        <group position={[0, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.5, 20, 20]} />
            <meshStandardMaterial color="#1e40af" />
          </mesh>
          <Text
            position={[0, -1.2, 0]}
            fontSize={0.4}
            color="#1e40af"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
            textAlign="center"
            fontWeight="bold"
          >
            {data.center}
          </Text>
        </group>

        {/* Render nodes */}
        {processedNodes.map((node, index) => (
          <NodeComponent key={node.id} node={node} level={1} />
        ))}

        {/* Connection lines from center to main nodes */}
        {processedNodes.map((node, index) => (
          <Line
            key={`center-${node.id}`}
            points={[new Vector3(0, 0, 0), new Vector3(...node.position)]}
            color="#374151"
            lineWidth={3}
            opacity={0.8}
          />
        ))}

        {/* Connection lines between nodes */}
        <ConnectionLines nodes={processedNodes} />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={20} />
      </Canvas>
    </div>
  )
}
