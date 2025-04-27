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

      // Add this near the top of the hook function
      const maxRetries = 2
      let retryCount = 0

      const fetchData = async () => {
        try {
          setIsLoading(true)
          setError(null)

          while (retryCount <= maxRetries) {
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
                // Add cache control
                cache: "no-store",
                signal: abortControllerRef.current ? abortControllerRef.current.signal : undefined,
              })

              if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
              }

              const responseData = await response.json()
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
            } catch (err: any) {
              if (retryCount === maxRetries) {
                throw err
              }
              retryCount++
              // Exponential backoff
              await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
            }
          }
        } catch (err: any) {
          console.error("Error in AI request:", err)
          const errorMessage =
            err.name === "AbortError"
              ? "Request timed out or was cancelled. Please try again."
              : err instanceof Error
                ? err.message
                : "An unknown error occurred"

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
      }

      // Cancel any ongoing request
      cancelRequest()

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController()

      return await fetchData()
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
