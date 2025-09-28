"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Home, BookOpen, CheckSquare, BarChart3, Timer, User, Settings, Trophy, Target, Brain, Zap } from "lucide-react"
import { useUser } from "@/context/user-context"
import { usePilotPoints } from "@/hooks/use-pilot-points"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick access",
  },
  {
    name: "Study Assistant",
    href: "/study",
    icon: BookOpen,
    description: "AI-powered study tools",
  },
  {
    name: "Task Manager",
    href: "/tasks",
    icon: CheckSquare,
    description: "Organize your tasks",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Track your progress",
  },
  {
    name: "Pomodoro Timer",
    href: "/pomodoro",
    icon: Timer,
    description: "Focus with time management",
  },
]

const quickActions = [
  {
    name: "Quick Study",
    href: "/study",
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    name: "New Task",
    href: "/tasks",
    icon: Target,
    color: "bg-green-500",
  },
  {
    name: "Focus Session",
    href: "/pomodoro",
    icon: Zap,
    color: "bg-orange-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { points, level, nextLevelPoints } = usePilotPoints()

  if (!user) {
    return null
  }

  return (
    <div className="hidden md:flex h-full w-64 flex-col fixed left-0 top-16 bottom-0 bg-background border-r">
      <ScrollArea className="flex-1 px-3 py-4">
        {/* User Stats */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Pilot Points</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Level {level}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-lg">{points}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(points % 1000) / 10}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{nextLevelPoints - points} points to next level</p>
        </div>

        {/* Navigation */}
        <div className="space-y-1 mb-6">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Navigation</h3>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto p-3",
                    isActive && "bg-primary/10 text-primary border-primary/20",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick Actions
          </h3>
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Button variant="ghost" className="w-full justify-start p-3">
                <div className={cn("mr-3 h-8 w-8 rounded-full flex items-center justify-center", action.color)}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{action.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-3 border-t">
        <div className="space-y-1">
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-3 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
