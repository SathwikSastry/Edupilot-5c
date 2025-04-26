"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/user-context"
import { AnimatedBackground } from "@/components/animated-background"

export default function AuthPage() {
  const [name, setName] = useState("")
  const [goal, setGoal] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userData, setUserData, isLoading } = useUser()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (!isLoading && userData?.name) {
      console.log("User already logged in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [userData, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      console.log("Submitting auth form with name:", name)

      // Create user data
      const newUserData = {
        name: name.trim(),
        goal: goal.trim() || "Become a better student",
        createdAt: new Date().toISOString(),
      }

      // Set user data in context (this also saves to localStorage)
      setUserData(newUserData)

      // Wait a moment to ensure data is saved
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Verify data was saved correctly
      const storedData = localStorage.getItem("edupilot-user-data")
      if (!storedData) {
        throw new Error("Failed to save user data")
      }

      console.log("Auth successful, redirecting to dashboard")

      // Use direct navigation instead of router
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Auth error:", error)
      alert("There was a problem logging in. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If already logged in, don't render the form (will redirect)
  if (userData?.name) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Already logged in. Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container relative z-10 max-w-md px-4"
      >
        <Card className="backdrop-blur-md bg-background/60 border-background/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to EduPilot</CardTitle>
            <CardDescription>Let's get to know you a little better</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">What's your main study goal? (optional)</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Ace my finals, Learn programming"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Getting Started...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
