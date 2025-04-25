"use client"

import type React from "react"

import { useState } from "react"
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
  const { setUserData } = useUser()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim()) {
      setUserData({
        name,
        goal: goal.trim() || "Become a better student",
        createdAt: new Date().toISOString(),
      })

      router.push("/dashboard")
    }
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">What's your main study goal? (optional)</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Ace my finals, Learn programming"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Get Started
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
