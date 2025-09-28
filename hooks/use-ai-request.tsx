"use client"

import { useState, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { extractJsonFromString } from "@/lib/extract-json"

interface UseAIRequestOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  parseJson?: boolean
  timeout?: number
}

export function useAIRequest(options: UseAIRequestOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const { toast } = useToast()

  // Use a ref to track the current request for cancellation
  const abortControllerRef = useRef<AbortController | null>(null)

  // Function to cancel any ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const makeRequest = useCallback(
    async (task: string, content: string, prompt?: string) => {
      if (!content.trim()) {
        toast({
          title: "Empty input",
          description: "Please enter some text to process",
          variant: "destructive",
        })
        return null
      }

      // Cancel any ongoing request
      cancelRequest()

      setIsLoading(true)
      setError(null)

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task,
            content,
            prompt,
          }),
          signal: abortControllerRef.current.signal,
        })

        const responseData = await response.json()

        if (!response.ok) {
          console.error(`Error processing ${task}:`, responseData)

          let errorMessage = "An error occurred while processing your request."

          // Provide more specific error messages
          if (response.status === 404) {
            errorMessage = "The AI service is temporarily unavailable. Please try again later."
          } else if (response.status === 429) {
            errorMessage = "Too many requests. Please wait a moment and try again."
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again in a few minutes."
          } else if (responseData.error) {
            errorMessage = responseData.error
          }

          setError(errorMessage)

          if (options.onError) {
            options.onError(errorMessage)
          }

          toast({
            title: "Processing failed",
            description: errorMessage,
            variant: "destructive",
          })

          setIsLoading(false)
          return null
        }

        let processedData = responseData.result

        // If we need to parse JSON from the response
        if (options.parseJson) {
          try {
            // First try direct JSON parsing
            processedData = JSON.parse(responseData.result)
          } catch (e) {
            // If direct parsing fails, use the extraction utility
            const parsedData = extractJsonFromString(responseData.result)

            if (!parsedData) {
              const errorMessage = "Failed to parse the AI response. Please try again."
              setError(errorMessage)

              if (options.onError) {
                options.onError(errorMessage)
              }

              toast({
                title: "Processing error",
                description: errorMessage,
                variant: "destructive",
              })

              setIsLoading(false)
              return null
            }

            processedData = parsedData
          }
        }

        // Validate the data structure for specific tasks
        if (task === "quiz" && options.parseJson) {
          if (
            !Array.isArray(processedData) ||
            !processedData.every((q) => q.question && Array.isArray(q.options) && q.correctAnswer)
          ) {
            const errorMessage = "Invalid quiz format received. Please try again."
            setError(errorMessage)

            if (options.onError) {
              options.onError(errorMessage)
            }

            toast({
              title: "Invalid quiz format",
              description: errorMessage,
              variant: "destructive",
            })

            setIsLoading(false)
            return null
          }
        }

        if (task === "flashcards" && options.parseJson) {
          if (!Array.isArray(processedData) || !processedData.every((f) => f.question && f.answer)) {
            const errorMessage = "Invalid flashcards format received. Please try again."
            setError(errorMessage)

            if (options.onError) {
              options.onError(errorMessage)
            }

            toast({
              title: "Invalid flashcards format",
              description: errorMessage,
              variant: "destructive",
            })

            setIsLoading(false)
            return null
          }
        }

        setData(processedData)

        if (options.onSuccess) {
          options.onSuccess(processedData)
        }

        setIsLoading(false)
        return processedData
      } catch (error: any) {
        console.error(`Error in ${task} request:`, error)

        let errorMessage = "Network error. Please check your connection and try again."

        if (error.name === "AbortError") {
          errorMessage = "Request was cancelled."
        } else if (error.message?.includes("timeout")) {
          errorMessage = "Request timed out. Please try again."
        }

        setError(errorMessage)

        if (options.onError) {
          options.onError(errorMessage)
        }

        toast({
          title: "Request failed",
          description: errorMessage,
          variant: "destructive",
        })

        setIsLoading(false)
        return null
      }
    },
    [toast, options, cancelRequest],
  )

  return {
    isLoading,
    error,
    data,
    makeRequest,
    setError,
    setData,
    cancelRequest,
  }
}
