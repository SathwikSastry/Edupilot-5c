"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, Sparkles } from "lucide-react"
import { MindMap } from "./mind-map"
import { useAIRequest } from "@/hooks/use-ai-request"
import { extractJSON } from "@/lib/extract-json"

interface MindMapData {
  center: string
  nodes: Array<{
    id: string
    text: string
    position: [number, number, number]
    children?: Array<{
      id: string
      text: string
      position: [number, number, number]
    }>
  }>
}

export function MindMapNotebook() {
  const [content, setContent] = useState("")
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null)
  const { makeRequest, isLoading } = useAIRequest()

  const generateMindMap = async () => {
    if (!content.trim()) {
      return
    }

    try {
      const result = await makeRequest({
        task: "mindmap",
        content: content.trim(),
      })

      if (result) {
        try {
          const parsedData = extractJSON(result)

          if (parsedData && typeof parsedData === "object" && "center" in parsedData && "nodes" in parsedData) {
            // Validate and process the mind map data
            const processedData: MindMapData = {
              center: String(parsedData.center || "Main Topic"),
              nodes: Array.isArray(parsedData.nodes)
                ? parsedData.nodes.map((node: any, index: number) => ({
                    id: node.id || `node-${index}`,
                    text: String(node.text || `Node ${index + 1}`),
                    position:
                      Array.isArray(node.position) && node.position.length === 3
                        ? (node.position.map(Number) as [number, number, number])
                        : ([
                            Math.cos((index * 2 * Math.PI) / parsedData.nodes.length) * 4,
                            Math.sin((index * 2 * Math.PI) / parsedData.nodes.length) * 4,
                            0,
                          ] as [number, number, number]),
                    children: Array.isArray(node.children)
                      ? node.children.map((child: any, childIndex: number) => ({
                          id: child.id || `child-${index}-${childIndex}`,
                          text: String(child.text || `Child ${childIndex + 1}`),
                          position:
                            Array.isArray(child.position) && child.position.length === 3
                              ? (child.position.map(Number) as [number, number, number])
                              : ([
                                  Math.cos((childIndex * 2 * Math.PI) / node.children.length) * 2 +
                                    (node.position?.[0] || 0),
                                  Math.sin((childIndex * 2 * Math.PI) / node.children.length) * 2 +
                                    (node.position?.[1] || 0),
                                  0,
                                ] as [number, number, number]),
                        }))
                      : undefined,
                  }))
                : [],
            }

            setMindMapData(processedData)
          } else {
            console.error("Invalid mind map data structure:", parsedData)
            // Create a fallback mind map
            setMindMapData({
              center: "Study Topic",
              nodes: [
                {
                  id: "node-1",
                  text: "Key Concept 1",
                  position: [3, 0, 0],
                },
                {
                  id: "node-2",
                  text: "Key Concept 2",
                  position: [-3, 0, 0],
                },
              ],
            })
          }
        } catch (parseError) {
          console.error("Failed to parse mind map data:", parseError)
          // Create a fallback mind map
          setMindMapData({
            center: "Study Topic",
            nodes: [
              {
                id: "node-1",
                text: "Key Concept 1",
                position: [3, 0, 0],
              },
              {
                id: "node-2",
                text: "Key Concept 2",
                position: [-3, 0, 0],
              },
            ],
          })
        }
      }
    } catch (error) {
      console.error("Error generating mind map:", error)
    }
  }

  const clearMindMap = () => {
    setMindMapData(null)
    setContent("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mind Map Generator
          </CardTitle>
          <CardDescription>
            Transform your study content into an interactive 3D mind map to visualize connections and concepts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="content" className="text-sm font-medium mb-2 block">
              Study Content
            </label>
            <Textarea
              id="content"
              placeholder="Paste your study material here (notes, textbook content, lecture transcripts, etc.)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={generateMindMap} disabled={!content.trim() || isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Mind Map...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Mind Map
                </>
              )}
            </Button>
            {mindMapData && (
              <Button variant="outline" onClick={clearMindMap}>
                Clear
              </Button>
            )}
          </div>

          {mindMapData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-sm">
                  Interactive 3D Mind Map
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Drag to rotate • Scroll to zoom • Click nodes to explore
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {mindMapData && (
        <Card>
          <CardHeader>
            <CardTitle>Your Mind Map</CardTitle>
            <CardDescription>
              Explore your study content in 3D. Use mouse controls to navigate around the mind map.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MindMap data={mindMapData} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
