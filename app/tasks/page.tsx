"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2, Edit, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTasks } from "@/hooks/use-tasks"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"

type Priority = "high" | "medium" | "low"

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate(undefined)
    setIsAddingTask(false)
    setEditingTaskId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      completed: false,
    }

    if (editingTaskId) {
      updateTask(editingTaskId, taskData)
    } else {
      addTask(taskData)
    }

    resetForm()
  }

  const startEditing = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    setTitle(task.title)
    setDescription(task.description || "")
    setPriority(task.priority as Priority)
    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
    setEditingTaskId(taskId)
    setIsAddingTask(true)
  }

  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      updateTask(taskId, { ...task, completed: !task.completed })
    }
  }

  const completedTasksCount = tasks.filter((task) => task.completed).length
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground">Organize your study schedule</p>
          </div>

          <Button
            onClick={() => setIsAddingTask(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        {tasks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Progress</h2>
              <span className="text-sm text-muted-foreground">
                {completedTasksCount} of {tasks.length} tasks completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}

        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>{editingTaskId ? "Edit Task" : "Add New Task"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">
                              <span className="flex items-center">
                                <span className="mr-2 h-3 w-3 rounded-full bg-red-500"></span>
                                High
                              </span>
                            </SelectItem>
                            <SelectItem value="medium">
                              <span className="flex items-center">
                                <span className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></span>
                                Medium
                              </span>
                            </SelectItem>
                            <SelectItem value="low">
                              <span className="flex items-center">
                                <span className="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
                                Low
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date (Optional)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingTaskId ? "Update Task" : "Add Task"}</Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <TaskCard
                  task={task}
                  onEdit={() => startEditing(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onToggleComplete={() => toggleTaskCompletion(task.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {tasks.length === 0 && !isAddingTask && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <CalendarIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No tasks yet</h3>
            <p className="mb-4 max-w-md text-sm text-muted-foreground">
              Start by adding your first task to organize your study schedule
            </p>
            <Button onClick={() => setIsAddingTask(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add your first task
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  task: any
  onEdit: () => void
  onDelete: () => void
  onToggleComplete: () => void
}) {
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  }

  return (
    <Card
      className={cn(
        "backdrop-blur-md bg-background/60 border-background/20 transition-all duration-300 hover:shadow-md",
        task.completed && "opacity-70",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn("h-3 w-3 rounded-full", priorityColors[task.priority as keyof typeof priorityColors])}
            />
            <CardTitle className={cn("text-lg", task.completed && "line-through text-muted-foreground")}>
              {task.title}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleComplete} className="h-8 w-8">
            <CheckCircle className={cn("h-5 w-5", task.completed ? "text-green-500" : "text-muted-foreground/40")} />
          </Button>
        </div>
        {task.dueDate && <CardDescription>Due: {format(new Date(task.dueDate), "PPP")}</CardDescription>}
      </CardHeader>
      {task.description && (
        <CardContent className="pb-2">
          <p className={cn("text-sm text-muted-foreground", task.completed && "line-through")}>{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
