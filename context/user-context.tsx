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
  isLoading: boolean
  logout: () => void
}

const USER_STORAGE_KEY = "edupilot-user-data"

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data from localStorage on mount
  useEffect(() => {
    function loadUserData() {
      try {
        setIsLoading(true)
        const storedData = localStorage.getItem(USER_STORAGE_KEY)

        if (storedData) {
          const parsedData = JSON.parse(storedData)
          if (parsedData && typeof parsedData === "object" && parsedData.name) {
            console.log("User data loaded from localStorage:", parsedData.name)
            setUserDataState(parsedData)
          } else {
            console.log("Invalid user data in localStorage, clearing")
            localStorage.removeItem(USER_STORAGE_KEY)
            setUserDataState(null)
          }
        } else {
          console.log("No user data found in localStorage")
          setUserDataState(null)
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
        localStorage.removeItem(USER_STORAGE_KEY)
        setUserDataState(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== "undefined") {
      loadUserData()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Function to set user data and save to localStorage
  const setUserData = (data: UserData | null) => {
    console.log("Setting user data:", data?.name || "null")

    if (data) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }

    setUserDataState(data)
  }

  // Function to logout
  const logout = () => {
    console.log("Logging out user")
    localStorage.removeItem(USER_STORAGE_KEY)
    setUserDataState(null)
  }

  return <UserContext.Provider value={{ userData, setUserData, isLoading, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
