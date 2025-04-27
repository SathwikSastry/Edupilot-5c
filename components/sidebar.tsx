"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, BookOpen, Clock, Home, ListTodo, Calculator } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/study"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/study" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Study Assistant</span>
            </Link>
            <Link
              href="/tasks"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/tasks" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <ListTodo className="mr-2 h-4 w-4" />
              <span>Tasks</span>
            </Link>
            <Link
              href="/pomodoro"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/pomodoro" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              <span>Pomodoro</span>
            </Link>
            <Link
              href="/analytics"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/analytics" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/calculator"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/calculator" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
