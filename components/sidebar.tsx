"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Calendar, BookOpen, BarChart2, Settings, HelpCircle, LogOut, Clock, Calculator } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background/60 backdrop-blur-md md:block md:w-64">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              EduPilot
            </div>
          </div>

          <nav className="space-y-1.5">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/dashboard" && "bg-accent text-accent-foreground")}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/" && "bg-accent text-accent-foreground")}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>

            <Link href="/tasks">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/tasks" && "bg-accent text-accent-foreground")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Tasks
              </Button>
            </Link>

            <Link href="/study">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/study" && "bg-accent text-accent-foreground")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Study Assistant
              </Button>
            </Link>

            <Link href="/pomodoro">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/pomodoro" && "bg-accent text-accent-foreground")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Pomodoro Timer
              </Button>
            </Link>

            <Link href="/analytics">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/analytics" && "bg-accent text-accent-foreground")}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>

            <Link href="/calculator">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/calculator" && "bg-accent text-accent-foreground")}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculator
              </Button>
            </Link>
          </nav>

          <div className="mt-auto space-y-1.5">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Button>

            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
