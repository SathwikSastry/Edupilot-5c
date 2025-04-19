"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { useTasks } from "@/hooks/use-tasks"
import { useUser } from "@/context/user-context"
import { PieChart, LineChart, BarChart } from "@/components/ui/chart"
import { Clock, Award, BookOpen, CheckCircle2 } from "lucide-react"
import { PomodoroTimer } from "@/components/pomodoro-timer"

export default function DashboardPage() {
  const { tasks } = useTasks()
  const { userData } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const completedTasks = tasks.filter((task) => task.completed)
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  // Calculate tasks by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  // Mock data for charts
  const studyTimeData = [
    { name: "Mon", hours: 2 },
    { name: "Tue", hours: 3 },
    { name: "Wed", hours: 1.5 },
    { name: "Thu", hours: 4 },
    { name: "Fri", hours: 2.5 },
    { name: "Sat", hours: 1 },
    { name: "Sun", hours: 3.5 },
  ]

  const quizScoresData = [
    { name: "Quiz 1", score: 85 },
    { name: "Quiz 2", score: 92 },
    { name: "Quiz 3", score: 78 },
    { name: "Quiz 4", score: 88 },
  ]

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
          <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          <p className="text-muted-foreground">Track your study progress and achievements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tasks Completed"
            value={`${completedTasks.length}/${tasks.length}`}
            description={`${completionRate}% completion rate`}
            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          />

          <StatsCard
            title="Study Streak"
            value="7 days"
            description="Keep it up!"
            icon={<Award className="h-5 w-5 text-yellow-500" />}
          />

          <StatsCard
            title="Study Time"
            value="18.5 hours"
            description="This week"
            icon={<Clock className="h-5 w-5 text-blue-500" />}
          />

          <StatsCard
            title="Flashcards Reviewed"
            value="124"
            description="Last 30 days"
            icon={<BookOpen className="h-5 w-5 text-purple-500" />}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Study Time</CardTitle>
              <CardDescription>Hours spent studying per day</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={studyTimeData}
                index="name"
                categories={["hours"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} hrs`}
                className="h-[300px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Scores</CardTitle>
              <CardDescription>Performance on recent quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={quizScoresData}
                index="name"
                categories={["score"]}
                colors={["purple"]}
                valueFormatter={(value) => `${value}%`}
                className="h-[300px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
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

          <Card>
            <CardHeader>
              <CardTitle>Pomodoro Timer</CardTitle>
              <CardDescription>Stay focused with timed study sessions</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PomodoroTimer />
            </CardContent>
          </Card>
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
