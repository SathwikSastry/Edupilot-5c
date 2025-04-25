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
    // Only load user data from localStorage on mount if we're in a browser environment
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("edupilot-user")
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          // Only set the user data if it's valid (has a name property)
          if (parsedData && parsedData.name) {
            // Use a small timeout to ensure consistent state updates
            setTimeout(() => {
              setUserData(parsedData)
            }, 0)
          } else {
            // If the data is invalid, remove it from localStorage
            localStorage.removeItem("edupilot-user")
          }
        } catch (error) {
          console.error("Failed to parse user data:", error)
          // If there's an error parsing the data, remove it from localStorage
          localStorage.removeItem("edupilot-user")
        }
      }
    }
  }, [])

  const handleSetUserData = (data: UserData | null) => {
    setUserData(data)

    // Save to localStorage
    if (typeof window !== "undefined") {
      if (data) {
        localStorage.setItem("edupilot-user", JSON.stringify(data))
      } else {
        localStorage.removeItem("edupilot-user")
      }
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
