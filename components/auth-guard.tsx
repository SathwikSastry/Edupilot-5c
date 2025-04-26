"use client"

import type React from "react"

import { useEffect } from "react"
import { useUser } from "@/context/user-context"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { userData, isLoading } = useUser()

  useEffect(() => {
    // Only redirect if we're not loading and there's no user data
    if (!isLoading && !userData) {
      console.log("AuthGuard: No user data found, redirecting to auth page")
      window.location.href = "/auth"
    }
  }, [userData, isLoading])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!userData) {
    return null
  }

  // If authenticated, render children
  return <>{children}</>
}
