"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { usePilotPoints } from "@/hooks/use-pilot-points"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Award, Zap, History } from "lucide-react"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { BarChart } from "@/components/ui/chart"

interface PomodoroSession {
  date: string
  duration: number
  type: "focus" | "break"
}

const QUOTES = [
  "The secret of getting ahead is getting started. – Mark Twain",
  "It always seems impossible until it's done. – Nelson Mandela",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The future depends on what you do today. – Mahatma Gandhi",
  "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
]

export default function PomodoroPage() {
  const [mounted, setMounted] = useState(false)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [todayFocusTime, setTodayFocusTime] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [dailyStats, setDailyStats] = useState<{ name: string; minutes: number }[]>([])
  const [quote, setQuote] = useState("")
  const { points, level } = usePilotPoints()

  useEffect(() => {
    setMounted(true)

    // Set random motivational quote
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    setQuote(randomQuote)

    // Load sessions from localStorage
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

        // Calculate daily stats for the past 7 days
        const last7Days = eachDayOfInterval({
          start: subDays(new Date(), 6),
          end: new Date(),
        }).map((date) => format(date, "yyyy-MM-dd"))

        const timeByDay = last7Days.map((date) => {
          const dayFocusSessions = parsedSessions.filter(
            (session: PomodoroSession) => session.date === date && session.type === "focus",
          )
          const totalMinutes = dayFocusSessions.reduce(
            (acc: number, session: PomodoroSession) => acc + session.duration,
            0,
          )
          return {
            name: format(new Date(date), "EEE"),
            minutes: totalMinutes,
          }
        })

        setDailyStats(timeByDay)
      } catch (error) {
        console.error("Failed to parse sessions:", error)
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Stay focused and productive with timed study sessions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Focus Timer</CardTitle>
                <CardDescription>Set your focus and break intervals</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <PomodoroTimer />

                <div className="mt-8 w-full rounded-lg bg-muted p-4 text-center italic text-sm text-muted-foreground">
                  "{quote}"
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Tabs defaultValue="stats" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="h-[calc(100%-40px)]">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                    <CardDescription>Track your focus time</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <div className="text-2xl font-bold">{todayFocusTime}</div>
                        <div className="text-xs text-muted-foreground">Minutes today</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <div className="text-2xl font-bold">{totalSessions}</div>
                        <div className="text-xs text-muted-foreground">Total sessions</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Daily Focus Time (minutes)</h3>
                      <div className="h-[200px]">
                        <BarChart
                          data={dailyStats}
                          index="name"
                          categories={["minutes"]}
                          colors={["blue"]}
                          valueFormatter={(value) => `${value} min`}
                          className="h-[200px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Recent Sessions</h3>
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
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="h-[calc(100%-40px)]">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Pilot Points</CardTitle>
                    <CardDescription>Earn points as you study</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="relative h-24 w-24 rounded-full border-4 border-muted flex items-center justify-center">
                        <Zap className="h-10 w-10 text-purple-500" />
                        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                          {level}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{points} Points</div>
                      <div className="text-sm text-muted-foreground">Level {level} Pilot</div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">How to earn points</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
                          <span className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            Complete focus session
                          </span>
                          <span>+5-25 points</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
                          <span className="flex items-center">
                            <Award className="mr-2 h-4 w-4 text-yellow-500" />
                            Daily streak bonus
                          </span>
                          <span>+10 × streak</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
                          <span className="flex items-center">
                            <History className="mr-2 h-4 w-4 text-green-500" />
                            Study milestone (60+ min)
                          </span>
                          <span>+50 points</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
