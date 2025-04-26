"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useUser } from "@/context/user-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { BookOpen, Calendar, BarChart2, Home, LogOut } from "lucide-react"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { usePilotPoints } from "@/hooks/use-pilot-points"

export function Navbar() {
  const pathname = usePathname()
  const { userData, logout } = useUser()
  const { points } = usePilotPoints()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = "/auth"
  }

  // Update the navLinks array to include dashboard
  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
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
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-200",
        isScrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              EduPilot
            </span>
          </Link>

          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {link.icon}
                    {link.name}
                    {pathname === link.href && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[1.5px] left-0 h-[2px] w-full bg-primary"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {userData?.name && (
            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm font-medium">
                <span className="text-muted-foreground">Points:</span> <span className="text-primary">{points}</span>
              </div>
            </div>
          )}

          <ModeToggle />

          {userData?.name ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden md:flex">
                Welcome, {userData.name}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hidden md:flex">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild className="hidden md:flex">
              <Link href="/auth">Get Started</Link>
            </Button>
          )}

          <MobileSidebar />
        </div>
      </div>
    </header>
  )
}
