"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LightingCursor } from "@/components/lighting-cursor"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [linkHover, setLinkHover] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)

    const handleLinkHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setLinkHover(true)
      }
    }

    const handleLinkHoverEnd = () => {
      setLinkHover(false)
    }

    const handleMouseLeave = () => {
      setHidden(true)
    }

    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleLinkHoverStart)
    document.addEventListener("mouseout", handleLinkHoverEnd)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleLinkHoverStart)
      document.removeEventListener("mouseout", handleLinkHoverEnd)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Only show custom cursor on desktop
  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false
  if (isMobile) return null

  return (
    <>
      <LightingCursor />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mix-blend-difference"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: clicked ? 0.8 : linkHover ? 1.5 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 h-3 w-3 rounded-full bg-white mix-blend-difference"
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          opacity: hidden || linkHover ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 1500,
          damping: 50,
        }}
      />
    </>
  )
}
