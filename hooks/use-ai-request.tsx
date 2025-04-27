"use client"

import { useState, useCallback } from "react"

interface UseAIRequestOptions {
  endpoint?: string
  retries?: number
  timeout?: number
  cacheResults?: boolean
}

interface UseAIRequestResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  makeRequest: (prompt: string) => Promise<T | null>
  reset: () => void
}

// Simple in-memory cache
const cache: Record<string, any> = {}

export function useAIRequest<T = any>({
  endpoint = "/api/ai",
  retries = 2,
  timeout = 30000,
  cacheResults = true,
}: UseAIRequestOptions = {}): UseAIRequestResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  const makeRequest = useCallback(
    async (prompt: string): Promise<T | null> => {
      setLoading(true)
      setError(null)

      // Check cache first if enabled
      const cacheKey = `${endpoint}:${prompt}`
      if (cacheResults && cache[cacheKey]) {
        setData(cache[cacheKey])
        setLoading(false)
        return cache[cacheKey]
      }

      let attempts = 0
      let result: T | null = null

      while (attempts <= retries) {
        try {
          // Create an AbortController for timeout handling
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), timeout)

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`API error (${response.status}): ${errorText}`)
          }

          result = await response.json()

          // Store in cache if enabled
          if (cacheResults) {
            cache[cacheKey] = result
          }

          setData(result)
          setLoading(false)
          return result
        } catch (err: any) {
          attempts++

          // If it's a timeout or we've exhausted retries, throw the error
          if (err.name === "AbortError" || attempts > retries) {
            const finalError = err.name === "AbortError" ? new Error(`Request timed out after ${timeout}ms`) : err

            setError(finalError)
            setLoading(false)
            throw finalError
          }

          // Exponential backoff before retry
          const delay = Math.min(1000 * 2 ** attempts, 10000)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }

      setLoading(false)
      return result
    },
    [endpoint, retries, timeout, cacheResults],
  )

  return { data, loading, error, makeRequest, reset }
}
