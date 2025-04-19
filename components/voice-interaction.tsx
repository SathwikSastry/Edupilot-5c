"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceInteractionProps {
  onTextCapture?: (text: string) => void
  placeholder?: string
}

export function VoiceInteraction({ onTextCapture, placeholder = "Speak to ask a question..." }: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    // This is a placeholder for future implementation
    setIsListening(true)

    toast({
      title: "Voice interaction",
      description: "Voice interaction is coming soon! This is a placeholder for future implementation.",
    })

    // Simulate voice recognition after 3 seconds
    setTimeout(() => {
      const simulatedText = "What is the process of photosynthesis?"
      if (onTextCapture) {
        onTextCapture(simulatedText)
      }
      stopListening()
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      <div className="text-sm text-muted-foreground">{isListening ? "Listening..." : placeholder}</div>
    </div>
  )
}
