"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { extractJsonFromString } from "@/lib/extract-json"
import { ExportTools } from "@/components/export-tools"
import { usePilotPoints } from "@/hooks/use-pilot-points"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

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

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="perspective-1000 relative h-[400px] w-full">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`card-${currentIndex}-${isFlipped ? "back" : "front"}`}
              initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
              animate={{ rotateY: isFlipped ? -180 : 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Card className={`h-full w-full ${isFlipped ? "hidden" : "block"}`}>
                <CardContent className="flex h-full flex-col items-center justify-center p-6">
                  <div className="mb-4 text-lg font-semibold text-muted-foreground">Question</div>
                  <div className="max-h-[280px] overflow-y-auto text-center text-xl">
                    {flashcards[currentIndex]?.question || ""}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              key={`card-${currentIndex}-${isFlipped ? "front" : "back"}`}
              initial={{ rotateY: isFlipped ? 0 : 180, opacity: 0 }}
              animate={{ rotateY: isFlipped ? 0 : 180, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Card className={`h-full w-full ${isFlipped ? "block" : "hidden"}`}>
                <CardContent className="flex h-full flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20">
                  <div className="mb-4 text-lg font-semibold text-muted-foreground">Answer</div>
                  <div className="max-h-[280px] overflow-y-auto text-center text-xl">
                    {flashcards[currentIndex]?.answer || ""}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={prevCard} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={flipCard} className="w-32">
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
