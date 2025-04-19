"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface PilotPointsContextType {
  points: number
  level: number
  addPoints: (amount: number, reason?: string) => void
  streak: number
  incrementStreak: () => void
  resetStreak: () => void
  lastActive: string | null
  checkAndUpdateStreak: () => void
}

const PilotPointsContext = createContext<PilotPointsContextType | undefined>(undefined)

export function PilotPointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastActive, setLastActive] = useState<string | null>(null)

  // Calculate level based on points
  const level = Math.floor(Math.sqrt(points / 100)) + 1

  // Load points from localStorage on mount
  useEffect(() => {
    const storedPoints = localStorage.getItem("edupilot-points")
    const storedStreak = localStorage.getItem("edupilot-streak")
    const storedLastActive = localStorage.getItem("edupilot-last-active")

    if (storedPoints) {
      setPoints(Number.parseInt(storedPoints, 10))
    }

    if (storedStreak) {
      setStreak(Number.parseInt(storedStreak, 10))
    }

    if (storedLastActive) {
      setLastActive(storedLastActive)
    }

    // Check streak on load
    checkAndUpdateStreak()
  }, [])

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("edupilot-points", points.toString())
  }, [points])

  // Save streak to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("edupilot-streak", streak.toString())
  }, [streak])

  // Save lastActive to localStorage whenever it changes
  useEffect(() => {
    if (lastActive) {
      localStorage.setItem("edupilot-last-active", lastActive)
    }
  }, [lastActive])

  const addPoints = (amount: number, reason?: string) => {
    setPoints((prev) => prev + amount)

    // Show toast notification
    if (typeof window !== "undefined" && reason) {
      // We'll implement this later with a toast notification
      console.log(`+${amount} points: ${reason}`)
    }
  }

  const incrementStreak = () => {
    setStreak((prev) => prev + 1)
    setLastActive(new Date().toISOString().split("T")[0]) // Store current date as YYYY-MM-DD
  }

  const resetStreak = () => {
    setStreak(0)
  }

  const checkAndUpdateStreak = () => {
    if (!lastActive) {
      // First time user, set lastActive to today and streak to 1
      setLastActive(new Date().toISOString().split("T")[0])
      setStreak(1)
      return
    }

    const today = new Date().toISOString().split("T")[0]
    const lastActiveDate = new Date(lastActive)
    const currentDate = new Date(today)

    // Calculate the difference in days
    const diffTime = currentDate.getTime() - lastActiveDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      // User was active yesterday, increment streak
      incrementStreak()
      addPoints(10 * streak, "Daily streak bonus!")
    } else if (diffDays > 1) {
      // User missed a day, reset streak
      resetStreak()
      setLastActive(today)
    } else if (diffDays === 0) {
      // User already active today, do nothing
    }
  }

  return (
    <PilotPointsContext.Provider
      value={{
        points,
        level,
        addPoints,
        streak,
        incrementStreak,
        resetStreak,
        lastActive,
        checkAndUpdateStreak,
      }}
    >
      {children}
    </PilotPointsContext.Provider>
  )
}

export function usePilotPoints() {
  const context = useContext(PilotPointsContext)
  if (context === undefined) {
    throw new Error("usePilotPoints must be used within a PilotPointsProvider")
  }
  return context
}
