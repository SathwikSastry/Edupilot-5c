"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { useTasks } from "@/hooks/use-tasks"
import { useUser } from "@/context/user-context"
import { usePilotPoints } from "@/hooks/use-pilot-points"
import { PieChart, LineChart, BarChart } from "@/components/ui/chart"
import { Clock, Award, CheckCircle2, Zap, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { format, subDays, eachDayOfInterval } from "date-fns"

interface PomodoroSession {
  date: string
  duration: number
  type: "focus" | "break"
}

export default function AnalyticsPage() {
  const { tasks } = useTasks()
  const { userData } = useUser()
  const { points, level, streak } = usePilotPoints()
  const [mounted, setMounted] = useState(false)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [studyTimeByDay, setStudyTimeByDay] = useState<{ name: string; hours: number }[]>([])
  const [taskCompletionData, setTaskCompletionData] = useState<{ name: string; completed: number }[]>([])

  useEffect(() => {
    setMounted(true)

    // Load pomodoro sessions
    const storedSessions = localStorage.getItem("edupilot-pomodoro-sessions")
    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions)
        setSessions(parsedSessions)

        // Calculate study time by day for the past 7 days
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
            hours: Number.parseFloat((totalMinutes / 60).toFixed(1)),
          }
        })

        setStudyTimeByDay(timeByDay)
      } catch (error) {
        console.error("Failed to parse sessions:", error)
      }
    } else {
      // Set default data if no sessions exist
      const defaultData = [
        { name: "Mon", hours: 1.5 },
        { name: "Tue", hours: 2.0 },
        { name: "Wed", hours: 0.5 },
        { name: "Thu", hours: 3.0 },
        { name: "Fri", hours: 2.5 },
        { name: "Sat", hours: 1.0 },
        { name: "Sun", hours: 2.0 },
      ]
      setStudyTimeByDay(defaultData)
    }

    // Generate task completion data
    const defaultTaskData = [
      { name: "Mon", completed: 3 },
      { name: "Tue", completed: 5 },
      { name: "Wed", completed: 2 },
      { name: "Thu", completed: 4 },
      { name: "Fri", completed: 6 },
      { name: "Sat", completed: 1 },
      { name: "Sun", completed: 3 },
    ]
    setTaskCompletionData(defaultTaskData)
  }, [])

  if (!mounted) return null

  const completedTasks = tasks.filter((task) => task.completed)
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  // Calculate tasks by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length || 2
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length || 5
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length || 3

  // Calculate total study time
  const totalStudyMinutes = sessions
    .filter((session) => session.type === "focus")
    .reduce((acc, session) => acc + session.duration, 0)

  const totalStudyHours = Number.parseFloat((totalStudyMinutes / 60).toFixed(1)) || 18.5

  // Calculate points to next level
  const pointsToNextLevel = level * level * 100 - points
  const progressToNextLevel = 100 - Math.min(100, (pointsToNextLevel / (level * 100)) * 100)

  const tasksByPriorityData = [
    { name: "High", value: highPriorityTasks },
    { name: "Medium", value: mediumPriorityTasks },
    { name: "Low", value: lowPriorityTasks },
  ]

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Study Analytics</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatsCard
              title="Tasks Completed"
              value={`${completedTasks.length}/${tasks.length}`}
              description={`${completionRate}% completion rate`}
              icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatsCard
              title="Study Streak"
              value={`${streak} days`}
              description="Keep it up!"
              icon={<Award className="h-5 w-5 text-yellow-500" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatsCard
              title="Study Time"
              value={`${totalStudyHours} hours`}
              description="Total focus time"
              icon={<Clock className="h-5 w-5 text-blue-500" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <StatsCard
              title="Pilot Points"
              value={points.toString()}
              description={`Level ${level}`}
              icon={<Zap className="h-5 w-5 text-purple-500" />}
            />
          </motion.div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Study Time</CardTitle>
                <CardDescription>Hours spent studying per day</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={studyTimeByDay}
                  index="name"
                  categories={["hours"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} hrs`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tasks Completed</CardTitle>
                <CardDescription>Tasks completed per day</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={taskCompletionData}
                  index="name"
                  categories={["completed"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value} tasks`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
                <CardDescription>Distribution of your tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={tasksByPriorityData}
                  index="name"
                  categories={["value"]}
                  colors={["red", "yellow", "green"]}
                  valueFormatter={(value) => `${value} tasks`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Level Progress</CardTitle>
                  <CardDescription>
                    Level {level} • {points} points
                  </CardDescription>
                </div>
                <Target className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {level + 1}</span>
                    <span>{progressToNextLevel.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-2" />
                  <div className="text-xs text-muted-foreground">{pointsToNextLevel} more points needed</div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
                      <span className="flex items-center">
                        <Award className="mr-2 h-4 w-4 text-yellow-500" />
                        {streak} Day Streak
                      </span>
                      <span className="text-xs text-muted-foreground">+{streak * 10} points</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
                      <span className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Task Completion
                      </span>
                      <span className="text-xs text-muted-foreground">+{completedTasks.length * 5} points</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
                      <span className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-blue-500" />
                        Study Sessions
                      </span>
                      <span className="text-xs text-muted-foreground">+{totalStudyMinutes} points</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
