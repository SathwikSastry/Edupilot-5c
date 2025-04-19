"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface UserData {
  name: string
  goal?: string
  createdAt: string
}

interface UserContextType {
  userData: UserData | null
  setUserData: (data: UserData | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Load user data from localStorage on mount
    const storedData = localStorage.getItem("edupilot-user")
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData))
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }, [])

  const handleSetUserData = (data: UserData | null) => {
    setUserData(data)

    // Save to localStorage
    if (data) {
      localStorage.setItem("edupilot-user", JSON.stringify(data))
    } else {
      localStorage.removeItem("edupilot-user")
    }
  }

  return <UserContext.Provider value={{ userData, setUserData: handleSetUserData }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
