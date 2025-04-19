"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePilotPoints } from "@/hooks/use-pilot-points"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

const QUOTES = [
  "The secret of getting ahead is getting started. – Mark Twain",
  "It always seems impossible until it's done. – Nelson Mandela",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The future depends on what you do today. – Mahatma Gandhi",
  "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Your time is limited, don't waste it living someone else's life. – Steve Jobs",
  "The best way to predict the future is to create it. – Peter Drucker",
]

interface PomodoroSession {
  date: string
  duration: number
  type: "focus" | "break"
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [quote, setQuote] = useState("")
  const [showQuote, setShowQuote] = useState(false)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [todayFocusTime, setTodayFocusTime] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)

  const { addPoints } = usePilotPoints()
  const { toast } = useToast()

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sessionStartTimeRef = useRef<number | null>(null)

  // Load sessions from localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem("edupilot-pomodoro-sessions")
    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions)
        setSessions(parsedSessions)

        // Calculate today's focus time
        const today = new Date().toISOString().split("T")[0]
        const todaySessions = parsedSessions.filter(
          (session: PomodoroSession) => session.date === today && session.type === "focus",
        )
        const todayMinutes = todaySessions.reduce((acc: number, session: PomodoroSession) => acc + session.duration, 0)
        setTodayFocusTime(todayMinutes)

        // Calculate total sessions
        setTotalSessions(parsedSessions.filter((s: PomodoroSession) => s.type === "focus").length)
      } catch (error) {
        console.error("Failed to parse sessions:", error)
      }
    }
  }, [])

  // Save sessions to localStorage
  const saveSession = (session: PomodoroSession) => {
    const updatedSessions = [...sessions, session]
    setSessions(updatedSessions)
    localStorage.setItem("edupilot-pomodoro-sessions", JSON.stringify(updatedSessions))

    // Update today's focus time
    if (session.type === "focus") {
      setTodayFocusTime((prev) => prev + session.duration)
      setTotalSessions((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up, switch modes
            clearInterval(intervalRef.current!)
            setIsActive(false)

            // Calculate session duration
            if (sessionStartTimeRef.current) {
              const duration = mode === "focus" ? focusTime : breakTime

              // Save completed session
              saveSession({
                date: new Date().toISOString().split("T")[0],
                duration,
                type: mode,
              })

              // Award points for completed focus session
              if (mode === "focus") {
                addPoints(focusTime, `Completed ${focusTime} min focus session!`)
              }
            }

            // Play sound
            const audio = new Audio("/sounds/bell.mp3")
            audio.play().catch((e) => console.error("Error playing sound:", e))

            // Show quote at the end of a focus session
            if (mode === "focus") {
              const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
              setQuote(randomQuote)
              setShowQuote(true)

              // Hide quote after 10 seconds
              setTimeout(() => {
                setShowQuote(false)
              }, 10000)
            }

            // Switch modes
            if (mode === "focus") {
              setMode("break")
              return breakTime * 60
            } else {
              setMode("focus")
              return focusTime * 60
            }
          }
          return prev - 1
        })
      }, 1000)

      // Store session start time
      if (!sessionStartTimeRef.current) {
        sessionStartTimeRef.current = Date.now()
      }
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      sessionStartTimeRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, mode, breakTime, focusTime, addPoints])

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(mode === "focus" ? focusTime * 60 : breakTime * 60)
  }, [mode, focusTime, breakTime])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === "focus" ? focusTime * 60 : breakTime * 60)
    sessionStartTimeRef.current = null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = mode === "focus" ? (1 - timeLeft / (focusTime * 60)) * 100 : (1 - timeLeft / (breakTime * 60)) * 100

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <Tabs
        defaultValue="timer"
        className="w-full"
        onValueChange={(value) => {
          if (value === "settings") {
            setIsActive(false)
            setIsSettingsOpen(true)
          } else {
            setIsSettingsOpen(false)
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="flex flex-col items-center">
          <div className="mb-6 mt-6 flex items-center gap-4">
            <Button
              variant={mode === "focus" ? "default" : "outline"}
              onClick={() => {
                setMode("focus")
                resetTimer()
              }}
              className={cn("w-24", mode === "focus" && "bg-blue-500 hover:bg-blue-600")}
            >
              Focus
            </Button>
            <Button
              variant={mode === "break" ? "default" : "outline"}
              onClick={() => {
                setMode("break")
                resetTimer()
              }}
              className={cn("w-24", mode === "break" && "bg-green-500 hover:bg-green-600")}
            >
              <Coffee className="mr-2 h-4 w-4" />
              Break
            </Button>
          </div>

          <div className="relative mb-8 flex h-48 w-48 items-center justify-center rounded-full border-4 border-muted">
            <svg className="absolute h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="289.02652413026095"
                strokeDashoffset={289.02652413026095 * (1 - progress / 100)}
                className={cn("transition-all duration-1000", mode === "focus" ? "text-blue-500" : "text-green-500")}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              disabled={!isActive && timeLeft === (mode === "focus" ? focusTime * 60 : breakTime * 60)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={toggleTimer}
              size="lg"
              className={cn(
                "w-32",
                mode === "focus" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600",
              )}
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start
                </>
              )}
            </Button>
          </div>

          {/* Motivational Quote */}
          <AnimatePresence>
            {showQuote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 text-center p-4 rounded-lg bg-accent"
              >
                <p className="italic text-sm">{quote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Today's Focus Time</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{todayFocusTime} min</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, (todayFocusTime / 120) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">Goal: 120 minutes</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Total Sessions</h3>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Recent Sessions</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sessions
                .slice(-5)
                .reverse()
                .map((session, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 rounded bg-muted/50">
                    <span>{session.type === "focus" ? "🎯 Focus" : "☕ Break"}</span>
                    <span>{session.duration} min</span>
                    <span className="text-xs text-muted-foreground">{session.date}</span>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Focus Time: {focusTime} min</label>
            </div>
            <Slider value={[focusTime]} min={5} max={60} step={5} onValueChange={(value) => setFocusTime(value[0])} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Break Time: {breakTime} min</label>
            </div>
            <Slider value={[breakTime]} min={1} max={30} step={1} onValueChange={(value) => setBreakTime(value[0])} />
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              setSessions([])
              setTodayFocusTime(0)
              setTotalSessions(0)
              localStorage.removeItem("edupilot-pomodoro-sessions")
              toast({
                title: "Stats Reset",
                description: "All pomodoro session data has been cleared.",
              })
            }}
          >
            Reset All Stats
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
