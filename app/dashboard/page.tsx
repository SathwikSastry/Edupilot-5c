"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { useUser } from "@/context/user-context"
import { useTasks } from "@/hooks/use-tasks"
import { usePilotPoints } from "@/hooks/use-pilot-points"
import { format } from "date-fns"
import {
  Calendar,
  BookOpen,
  Clock,
  BarChart2,
  CheckCircle,
  Brain,
  Zap,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { userData } = useUser()
  const { tasks } = useTasks()
  const { points, level, streak } = usePilotPoints()
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState("")

  // Update the useEffect to fix the redirection logic
  useEffect(() => {
    setMounted(true)

    // Redirect to auth page if not logged in, but with a check to prevent immediate redirection
    if (typeof window !== "undefined") {
      // Only redirect after the component has mounted and we're sure userData is null
      if (mounted && !userData?.name) {
        router.push("/auth")
      }
    }

    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [userData, router, mounted])

  if (!mounted || !userData) return null

  // Calculate task stats
  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && !task.completed)
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  // Get today's date in readable format
  const today = format(new Date(), "EEEE, MMMM d, yyyy")

  // Calculate points to next level
  const pointsToNextLevel = level * level * 100 - points
  const progressToNextLevel = 100 - Math.min(100, (pointsToNextLevel / (level * 100)) * 100)

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {userData.name}
              </span>
            </h1>
            <p className="text-muted-foreground">{today}</p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatsCard
              title="Pilot Points"
              value={points.toString()}
              description={`Level ${level}`}
              icon={<Zap className="h-5 w-5 text-purple-500" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatsCard
              title="Tasks Completed"
              value={`${completedTasks.length}/${tasks.length}`}
              description={`${completionRate}% completion rate`}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <StatsCard
              title="High Priority"
              value={`${highPriorityTasks.length}`}
              description="Tasks need attention"
              icon={<Calendar className="h-5 w-5 text-red-500" />}
            />
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goal Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Your Study Goal</CardTitle>
                  <CardDescription>Track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">{userData.goal || "Become a better student"}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Level Progress</span>
                        <span>{progressToNextLevel.toFixed(0)}%</span>
                      </div>
                      <Progress value={progressToNextLevel} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {pointsToNextLevel} more points to Level {level + 1}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="ml-auto">
                    <Link href="/analytics">
                      View Analytics <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Quick Access */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick Access</CardTitle>
                  <CardDescription>Jump to your favorite tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <QuickAccessButton
                      href="/tasks"
                      icon={<Calendar className="h-5 w-5" />}
                      label="Task Manager"
                      color="bg-blue-500"
                    />
                    <QuickAccessButton
                      href="/study"
                      icon={<BookOpen className="h-5 w-5" />}
                      label="Study Assistant"
                      color="bg-purple-500"
                    />
                    <QuickAccessButton
                      href="/pomodoro"
                      icon={<Clock className="h-5 w-5" />}
                      label="Pomodoro Timer"
                      color="bg-green-500"
                    />
                    <QuickAccessButton
                      href="/analytics"
                      icon={<BarChart2 className="h-5 w-5" />}
                      label="Analytics"
                      color="bg-amber-500"
                    />
                    <QuickAccessButton
                      href="/study"
                      icon={<Brain className="h-5 w-5" />}
                      label="Mind Maps"
                      color="bg-pink-500"
                    />
                    <QuickAccessButton
                      href="/study"
                      icon={<Sparkles className="h-5 w-5" />}
                      label="Flashcards"
                      color="bg-indigo-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Pending Tasks</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/tasks">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {pendingTasks.length > 0 ? (
                    <div className="space-y-3">
                      {pendingTasks.slice(0, 4).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            />
                            <span className="font-medium truncate max-w-[180px]">{task.title}</span>
                          </div>
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(task.dueDate), "MMM d")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No pending tasks</p>
                      <Button asChild variant="outline" size="sm" className="mt-2">
                        <Link href="/tasks">Add Task</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl">Daily Motivation</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="italic text-muted-foreground">
                    "The secret of getting ahead is getting started. The secret of getting started is breaking your
                    complex overwhelming tasks into small manageable tasks, and then starting on the first one."
                  </blockquote>
                  <p className="text-right mt-2 font-medium">— Mark Twain</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ by Sathwik</p>
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

function QuickAccessButton({
  href,
  icon,
  label,
  color,
}: {
  href: string
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-all"
      >
        <div className={`rounded-full p-2 ${color} text-white`}>{icon}</div>
        <span className="text-sm">{label}</span>
      </Button>
    </Link>
  )
}
