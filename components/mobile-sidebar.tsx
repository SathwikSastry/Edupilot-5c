"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { BarChart3, BookOpen, Clock, Home, ListTodo, LogOut, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/user-context"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useUser()

  // Close the sidebar when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px] pr-0">
        <div className="px-2 py-6 flex flex-col h-full">
          <div className="space-y-3">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/study"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === "/study" ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Study Assistant</span>
              </Link>
              <Link
                href="/tasks"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === "/tasks" ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <ListTodo className="mr-2 h-4 w-4" />
                <span>Tasks</span>
              </Link>
              <Link
                href="/pomodoro"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === "/pomodoro" ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <Clock className="mr-2 h-4 w-4" />
                <span>Pomodoro</span>
              </Link>
              <Link
                href="/analytics"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === "/analytics" ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/calculator"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === "/calculator" ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </Link>
            </nav>
          </div>
          <div className="mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
