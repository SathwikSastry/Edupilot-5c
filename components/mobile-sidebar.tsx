"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Calendar, BookOpen, BarChart2, Settings, HelpCircle, LogOut, Menu, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Update the routes array to include dashboard
  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      name: "Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      name: "Study",
      href: "/study",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      name: "Pomodoro",
      href: "/pomodoro",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
            EduPilot
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full py-4">
          <div className="flex-1 px-2 space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", pathname === route.href && "bg-accent text-accent-foreground")}
                >
                  {route.icon}
                  {route.name}
                </Button>
              </Link>
            ))}
          </div>
          <div className="px-2 space-y-1 border-t pt-4">
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
      </SheetContent>
    </Sheet>
  )
}
