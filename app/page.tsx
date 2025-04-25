"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { motion, useScroll, useTransform } from "framer-motion"
import { usePilotPoints } from "@/hooks/use-pilot-points"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FloatingButton } from "@/components/floating-button"
import { BookOpen, Calendar, Brain, Award, Sparkles, ChevronDown } from "lucide-react"
import Link from "next/link"

// Import useUser
import { useUser } from "@/context/user-context"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { checkAndUpdateStreak } = usePilotPoints()
  const containerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  // Add useUser hook in the HomePage component
  const { userData } = useUser()

  useEffect(() => {
    setMounted(true)
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen overflow-hidden" ref={containerRef}>
      <AnimatedBackground />

      {/* Hero Section */}
      <motion.div style={{ opacity, scale, y }} className="container relative z-10 mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl">
            EduPilot
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Your AI-powered study companion for academic excellence
          </p>
        </motion.div>

        <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <FloatingButton href="/tasks" icon={<Calendar className="mr-2 h-5 w-5" />} label="Plan Tasks" color="blue" />
          <FloatingButton
            href="/study"
            icon={<BookOpen className="mr-2 h-5 w-5" />}
            label="Study Smarter"
            color="purple"
          />
          <FloatingButton
            href="/dashboard"
            icon={<Brain className="mr-2 h-5 w-5" />}
            label="Track Progress"
            color="pink"
          />
        </div>

        <motion.button
          onClick={scrollToFeatures}
          className="mx-auto flex items-center justify-center text-muted-foreground hover:text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1, duration: 1 },
            y: { repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" },
          }}
        >
          <span className="mr-2">Discover Features</span>
          <ChevronDown className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <div ref={featuresRef} className="relative z-10 bg-background/80 backdrop-blur-lg py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">
              Supercharge Your{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Learning
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              EduPilot combines AI-powered tools with proven study techniques to help you learn more effectively
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-blue-500" />}
              title="Smart Task Management"
              description="Organize your study schedule with priority levels and due dates. Never miss an assignment again."
              delay={0.1}
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-purple-500" />}
              title="AI Study Assistant"
              description="Get summaries, quizzes, and mind maps generated from your study materials with a single click."
              delay={0.2}
            />
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-pink-500" />}
              title="Interactive Flashcards"
              description="Create and review flashcards generated from your notes. Perfect for memorization and quick reviews."
              delay={0.3}
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-yellow-500" />}
              title="Progress Tracking"
              description="Visualize your learning journey with detailed analytics and insights about your study habits."
              delay={0.4}
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-green-500" />}
              title="Pomodoro Timer"
              description="Stay focused with customizable study sessions and breaks. Optimize your concentration and productivity."
              delay={0.5}
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-orange-500" />}
              title="Gamified Learning"
              description="Earn Pilot Points for completing tasks and maintaining study streaks. Make learning fun and engaging."
              delay={0.6}
            />
          </div>

          {/* Update the button in the motion.div at the end of the Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href={userData?.name ? "/dashboard" : "/auth"}>
                {userData?.name ? "Go to Dashboard" : "Get Started Today"}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="backdrop-blur-md bg-background/60 border-background/20 shadow-lg transition-all duration-300 hover:shadow-xl group">
        <CardContent className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
