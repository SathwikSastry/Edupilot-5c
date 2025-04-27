"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { extractJsonFromString } from "@/lib/extract-json"
import { ExportTools } from "@/components/export-tools"
import { usePilotPoints } from "@/hooks/use-pilot-points"

interface MindMapNotebookProps {
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

export function MindMapNotebook({ studyText, onBack }: MindMapNotebookProps) {
  const [mindMap, setMindMap] = useState<MindMapData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addPoints } = usePilotPoints()

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

      // Handle various formats of mind map data
      if (typeof mindMapData.center === "string" && Array.isArray(mindMapData.nodes)) {
        // Original format with center string and nodes array
        setMindMap(mindMapData)
      } else if (typeof mindMapData.center === "object" && mindMapData.center.text && mindMapData.center.children) {
        // Format with center as root node with children
        setMindMap({
          center: mindMapData.center.text,
          nodes: mindMapData.center.children,
        })
      } else if (
        typeof mindMapData.center === "object" &&
        mindMapData.center.text &&
        Array.isArray(mindMapData.nodes)
      ) {
        // Format with center as object with text property and separate nodes array
        setMindMap({
          center: mindMapData.center.text,
          nodes: mindMapData.nodes,
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

      // Add points for generating a mind map
      addPoints(20, "Generated a mind map")
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
        <div className="flex items-center gap-2">
          <ExportTools contentType="mindmap" content={mindMap} title="Mind Map Notes" />
          <Button variant="outline" size="icon" onClick={generateMindMap}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mind Map: {centerText}</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">{centerText}</h1>

            <div className="space-y-6">
              {nodes.map((node) => (
                <div key={node.id} className="space-y-2">
                  <h2 className="text-xl font-semibold border-b pb-1">{node.text}</h2>
                  {node.children && node.children.length > 0 && (
                    <ul className="pl-6 space-y-3">
                      {node.children.map((child) => (
                        <li key={child.id} className="space-y-1">
                          <h3 className="text-lg font-medium">{child.text}</h3>
                          {child.children && child.children.length > 0 && (
                            <ul className="pl-6 list-disc">
                              {child.children.map((grandchild) => (
                                <li key={grandchild.id} className="text-base">
                                  {grandchild.text}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
