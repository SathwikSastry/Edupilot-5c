"use client"

import { useState } from "react"

type ToastVariant = "default" | "destructive"

interface Toast {
  title: string
  description?: string
  variant?: ToastVariant
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Toast) => {
    const newToast = { title, description, variant }
    setToasts((prev) => [...prev, newToast])

    // For now, just log to console since we don't have a UI component
    console.log(`Toast: ${title}${description ? ` - ${description}` : ""}`)

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== newToast))
    }, 5000)
  }

  return { toast, toasts }
}
