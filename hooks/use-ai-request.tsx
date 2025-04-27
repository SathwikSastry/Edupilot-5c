"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { extractJsonFromString } from "@/lib/extract-json"

interface UseAIRequestOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  parseJson?: boolean
}

export function useAIRequest(options: UseAIRequestOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const { toast } = useToast()

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

      setIsLoading(true)
      setError(null)

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

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
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const responseData = await response.json()

        if (!response.ok) {
          console.error(`Error processing ${task}:`, responseData)
          const errorMessage = responseData.error || "An unknown error occurred"
          setError(errorMessage)

          if (options.onError) {
            options.onError(errorMessage)
          }

          toast({
            title: "Processing failed",
            description: errorMessage,
            variant: "destructive",
          })

          return null
        }

        let processedData = responseData.result

        // If we need to parse JSON from the response
        if (options.parseJson) {
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

            return null
          }

          processedData = parsedData
        }

        setData(processedData)

        if (options.onSuccess) {
          options.onSuccess(processedData)
        }

        return processedData
      } catch (error) {
        console.error(`Error in ${task} request:`, error)

        const errorMessage =
          error instanceof Error && error.name === "AbortError"
            ? "Request timed out. Please try again."
            : "Network error. Please check your connection and try again."

        setError(errorMessage)

        if (options.onError) {
          options.onError(errorMessage)
        }

        toast({
          title: "Request failed",
          description: errorMessage,
          variant: "destructive",
        })

        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast, options],
  )

  return {
    isLoading,
    error,
    data,
    makeRequest,
    setError,
    setData,
  }
}
