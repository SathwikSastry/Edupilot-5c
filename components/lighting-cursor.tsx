"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function LightingCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)
    const handleMouseLeave = () => setHidden(true)

    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Only show lighting effect on desktop
  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false
  if (isMobile) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-xl"
      animate={{
        x: position.x - 32,
        y: position.y - 32,
        scale: clicked ? 0.8 : 1,
        opacity: hidden ? 0 : 0.6,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    />
  )
}
