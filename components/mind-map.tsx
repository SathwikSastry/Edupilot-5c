"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Line, Html } from "@react-three/drei"
import { useToast } from "@/hooks/use-toast"
import { extractJsonFromString } from "@/lib/extract-json"

interface MindMapProps {
  studyText: string
  onBack: () => void
}

// Position can be either an array [x, y, z] or an object {x, y, z}
type Position = [number, number, number] | { x: number; y: number; z: number }

interface MindMapNode {
  id: number | string
  text: string
  position: Position
  children?: MindMapNode[]
}

// Updated interface to handle both formats
interface MindMapData {
  center: string | MindMapNode
  nodes?: MindMapNode[]
}

// Helper function to normalize position to array format
function normalizePosition(position: Position): [number, number, number] {
  if (Array.isArray(position)) {
    return position
  }
  return [position.x, position.y, position.z]
}

export function MindMap({ studyText, onBack }: MindMapProps) {
  const [mindMap, setMindMap] = useState<MindMapData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const generateMindMap = async () => {
    if (!studyText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to generate a mind map",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: "mindmap",
          content: studyText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate mind map")
      }

      const data = await response.json()

      // Use the utility function to extract JSON from the response
      const mindMapData = extractJsonFromString(data.result)

      if (!mindMapData) {
        console.error("Failed to parse mind map data:", data.result)
        toast({
          title: "Processing error",
          description: "There was an error processing the AI response. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Handle both formats of mind map data
      if (typeof mindMapData.center === "string" && Array.isArray(mindMapData.nodes)) {
        // Original format with center string and nodes array
        setMindMap(mindMapData)
      } else if (typeof mindMapData.center === "object" && mindMapData.center.text && mindMapData.center.children) {
        // New format with center as root node with children
        setMindMap({
          center: mindMapData.center.text,
          nodes: mindMapData.center.children,
        })
      } else {
        console.error("Invalid mind map format:", mindMapData)
        toast({
          title: "Invalid mind map format",
          description: "The AI generated an invalid mind map format. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    } catch (error) {
      console.error("Error generating mind map:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating the mind map. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (studyText.trim()) {
      generateMindMap()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium">Generating mind map...</p>
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    )
  }

  if (!mindMap && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-lg font-medium">No mind map available</p>
        <Button onClick={generateMindMap}>Generate Mind Map</Button>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Back
        </Button>
      </div>
    )
  }

  // Get the center text regardless of format
  const centerText = typeof mindMap?.center === "string" ? mindMap.center : mindMap?.center.text

  // Get the nodes array regardless of format
  const nodes = Array.isArray(mindMap?.nodes)
    ? mindMap.nodes
    : typeof mindMap?.center === "object" && Array.isArray(mindMap?.center.children)
      ? mindMap.center.children
      : []

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button variant="outline" size="icon" onClick={generateMindMap}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Mind Map: {centerText}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.5}
                panSpeed={0.5}
                rotateSpeed={0.5}
              />

              {/* Center node */}
              <group position={[0, 0, 0]}>
                <mesh>
                  <circleGeometry args={[1, 32]} />
                  <meshStandardMaterial color="#6d28d9" />
                </mesh>
                <Text
                  position={[0, 0, 0.1]}
                  fontSize={0.4}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  font="/fonts/Inter-Bold.ttf"
                >
                  {centerText}
                </Text>
              </group>

              {/* Main concept nodes and connections */}
              {nodes.map((node) => {
                const nodePosition = normalizePosition(node.position)

                return (
                  <group key={node.id.toString()}>
                    {/* Line from center to main concept */}
                    <Line points={[[0, 0, 0], nodePosition]} color="#8b5cf6" lineWidth={3} />

                    {/* Main concept node */}
                    <group position={nodePosition}>
                      <mesh>
                        <circleGeometry args={[0.8, 32]} />
                        <meshStandardMaterial color="#8b5cf6" />
                      </mesh>
                      <Text
                        position={[0, 0, 0.1]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/Inter-Regular.ttf"
                      >
                        {node.text}
                      </Text>
                    </group>

                    {/* Sub-concept nodes and connections */}
                    {node.children?.map((child) => {
                      const childPosition = normalizePosition(child.position)

                      return (
                        <group key={child.id.toString()}>
                          {/* Line from main concept to sub-concept */}
                          <Line points={[nodePosition, childPosition]} color="#a78bfa" lineWidth={2} />

                          {/* Sub-concept node */}
                          <group position={childPosition}>
                            <mesh>
                              <circleGeometry args={[0.6, 32]} />
                              <meshStandardMaterial color="#a78bfa" />
                            </mesh>
                            <Text
                              position={[0, 0, 0.1]}
                              fontSize={0.25}
                              color="white"
                              anchorX="center"
                              anchorY="middle"
                              font="/fonts/Inter-Regular.ttf"
                            >
                              {child.text}
                            </Text>
                          </group>
                        </group>
                      )
                    })}
                  </group>
                )
              })}

              {/* Instructions overlay */}
              <Html position={[-5, -4, 0]}>
                <div className="rounded-md bg-background/80 p-2 text-xs backdrop-blur-sm">
                  <p>Drag to pan | Scroll to zoom | Right-click to rotate</p>
                </div>
              </Html>
            </Canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
