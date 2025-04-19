"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw, RefreshCw } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { PresentationControls, Environment, Html } from "@react-three/drei"
import { useToast } from "@/hooks/use-toast"
import { extractJsonFromString } from "@/lib/extract-json"
import { ExportTools } from "@/components/export-tools"
import { usePilotPoints } from "@/hooks/use-pilot-points"
import type * as THREE from "three"

interface FlashcardViewerProps {
  studyText: string
  onBack: () => void
}

interface Flashcard {
  id: number | string
  question: string
  answer: string
}

export function FlashcardViewer({ studyText, onBack }: FlashcardViewerProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addPoints } = usePilotPoints()

  const generateFlashcards = async () => {
    if (!studyText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to generate flashcards",
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
          task: "flashcards",
          content: studyText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate flashcards")
      }

      const data = await response.json()

      // Use the utility function to extract JSON from the response
      const flashcardsData = extractJsonFromString(data.result)

      if (!flashcardsData) {
        console.error("Failed to parse flashcards data:", data.result)
        toast({
          title: "Processing error",
          description: "There was an error processing the AI response. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate the structure
      if (
        !Array.isArray(flashcardsData) ||
        !flashcardsData.every((f) => f.id !== undefined && f.question && f.answer)
      ) {
        console.error("Invalid flashcards format:", flashcardsData)
        toast({
          title: "Invalid flashcards format",
          description: "The AI generated an invalid flashcards format. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      setFlashcards(flashcardsData)
      setCurrentIndex(0)
      setIsFlipped(false)

      // Add points for generating flashcards
      addPoints(15, "Generated flashcards")
    } catch (error) {
      console.error("Error generating flashcards:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating flashcards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (studyText.trim()) {
      generateFlashcards()
    }
  }, [])

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 300)

      // Add points for reviewing a flashcard
      addPoints(2, "Reviewed a flashcard")
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1)
      }, 300)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      // Add points for flipping a card (only when revealing the answer)
      addPoints(1, "Studied flashcard")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium">Generating flashcards...</p>
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    )
  }

  if (flashcards.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-lg font-medium">No flashcards available</p>
        <Button onClick={generateFlashcards}>Generate Flashcards</Button>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        <div className="flex items-center gap-2">
          <ExportTools contentType="flashcards" content={flashcards} title="Study Flashcards" />
          <Button variant="outline" size="icon" onClick={generateFlashcards}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mx-auto h-[400px] w-full max-w-2xl">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <PresentationControls
            global
            zoom={0.8}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            {flashcards.length > 0 && (
              <FlashcardModel
                isFlipped={isFlipped}
                question={flashcards[currentIndex]?.question || ""}
                answer={flashcards[currentIndex]?.answer || ""}
              />
            )}
          </PresentationControls>
          <Environment preset="apartment" />
        </Canvas>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-4">
          <Button variant="outline" size="icon" onClick={prevCard} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={flipCard}>
            <RotateCw className="mr-2 h-4 w-4" />
            Flip Card
          </Button>
          <Button variant="outline" size="icon" onClick={nextCard} disabled={currentIndex === flashcards.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function FlashcardModel({
  isFlipped,
  question,
  answer,
}: {
  isFlipped: boolean
  question: string
  answer: string
}) {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return

    const targetRotation = isFlipped ? Math.PI : 0
    const animate = () => {
      if (!groupRef.current) return

      const currentRotation = groupRef.current.rotation.y
      const diff = targetRotation - currentRotation

      if (Math.abs(diff) > 0.01) {
        groupRef.current.rotation.y += diff * 0.1
        requestAnimationFrame(animate)
      } else {
        groupRef.current.rotation.y = targetRotation
      }
    }

    animate()
  }, [isFlipped])

  return (
    <group ref={groupRef}>
      {/* Front side (Question) */}
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#4338ca" />
        <Html
          transform
          occlude
          position={[0, 0, 0.01]}
          rotation={[0, 0, 0]}
          style={{ width: "300px", height: "200px", pointerEvents: "none" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-indigo-700 p-6 text-white">
            <h3 className="mb-2 text-lg font-bold">Question</h3>
            <p className="text-center">{question}</p>
          </div>
        </Html>
      </mesh>

      {/* Back side (Answer) */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#7e22ce" />
        <Html
          transform
          occlude
          position={[0, 0, 0.01]}
          rotation={[0, 0, 0]}
          style={{ width: "300px", height: "200px", pointerEvents: "none" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-purple-700 p-6 text-white">
            <h3 className="mb-2 text-lg font-bold">Answer</h3>
            <p className="text-center">{answer}</p>
          </div>
        </Html>
      </mesh>
    </group>
  )
}
