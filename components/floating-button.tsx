"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingButtonProps {
  href: string
  icon: React.ReactNode
  label: string
  color?: "blue" | "purple" | "pink"
}

export function FloatingButton({ href, icon, label, color = "blue" }: FloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0 })
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null)

  const colorVariants = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
  }

  useEffect(() => {
    if (!buttonRef) return

    const updateButtonPosition = () => {
      const rect = buttonRef.getBoundingClientRect()
      setButtonPosition({ x: rect.left, y: rect.top })
      setButtonDimensions({ width: rect.width, height: rect.height })
    }

    updateButtonPosition()
    window.addEventListener("resize", updateButtonPosition)
    window.addEventListener("scroll", updateButtonPosition)

    return () => {
      window.removeEventListener("resize", updateButtonPosition)
      window.removeEventListener("scroll", updateButtonPosition)
    }
  }, [buttonRef])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const calculateDistance = () => {
    if (!buttonRef) return 0

    const buttonCenterX = buttonPosition.x + buttonDimensions.width / 2
    const buttonCenterY = buttonPosition.y + buttonDimensions.height / 2

    const deltaX = mousePosition.x - buttonCenterX
    const deltaY = mousePosition.y - buttonCenterY

    // Calculate distance but limit the movement
    const maxDistance = 10
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance)
    const angle = Math.atan2(deltaY, deltaX)

    return {
      x: Math.cos(angle) * distance * 0.2,
      y: Math.sin(angle) * distance * 0.2,
    }
  }

  const movement = calculateDistance()

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={{
        x: isHovered ? movement.x : 0,
        y: isHovered ? movement.y : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 0.8,
        }}
        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/30 blur-xl"
      />

      <Link href={href} passHref>
        <Button
          ref={setButtonRef}
          size="lg"
          className={cn(
            "relative h-14 min-w-40 overflow-hidden rounded-full bg-gradient-to-r px-8 text-lg font-semibold shadow-lg transition-all duration-300",
            colorVariants[color],
          )}
        >
          {icon}
          {label}

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 -z-10 bg-gradient-to-r from-white/10 to-transparent opacity-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x - buttonPosition.x}px ${
                mousePosition.y - buttonPosition.y
              }px, rgba(255, 255, 255, 0.15), transparent 100px)`,
            }}
          />
        </Button>
      </Link>
    </motion.div>
  )
}
