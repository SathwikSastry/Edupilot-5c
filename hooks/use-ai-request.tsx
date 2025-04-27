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

      try {
        // Create a new AbortController for this request
        abortControllerRef.current = new AbortController()

        // Set a timeout if specified
        const timeoutId = options.timeout
          ? setTimeout(() => {
              if (abortControllerRef.current) {
                abortControllerRef.current.abort()
              }
            }, options.timeout)
          : null

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

        if (timeoutId) clearTimeout(timeoutId)

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

        setData(processedData)

        if (options.onSuccess) {
          options.onSuccess(processedData)
        }

        setIsLoading(false)
        return processedData
      } catch (error: any) {
        console.error(`Error in ${task} request:`, error)

        const errorMessage =
          error.name === "AbortError"
            ? "Request timed out or was cancelled. Please try again."
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
