"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

interface Task {
  id: string
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  dueDate?: string
  completed: boolean
  createdAt: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // Load tasks from localStorage on mount
    const storedTasks = localStorage.getItem("edupilot-tasks")
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks))
      } catch (error) {
        console.error("Failed to parse tasks:", error)
      }
    }
  }, [])

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
    localStorage.setItem("edupilot-tasks", JSON.stringify(updatedTasks))
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
    }

    const updatedTasks = [...tasks, newTask]
    saveTasks(updatedTasks)
    return newTask
  }

  const updateTask = (id: string, taskData: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...taskData } : task))

    saveTasks(updatedTasks)
  }

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    saveTasks(updatedTasks)
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  }
}
