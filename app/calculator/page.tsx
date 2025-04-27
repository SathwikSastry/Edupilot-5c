"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { ExternalLink } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

export default function CalculatorPage() {
  const [isHovered, setIsHovered] = useState(false)

  const handleLaunchCalculator = () => {
    window.open(
      "https://www.wolframcloud.com/obj/sathwiksastryr/Published/ac8adc08-a02c-4a9f-a531-e8939b701c06.nb",
      "_blank",
    )
  }

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-8rem)]">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">AI-Powered Arithmetic Calculator</h1>
            <p className="text-muted-foreground">Solve arithmetic expressions instantly and accurately</p>
          </div>

          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden opacity-5">
              <div className="absolute left-1/4 top-10 text-6xl font-bold">1 + 1 = 2</div>
              <div className="absolute left-2/3 top-20 text-5xl font-bold">√64 = 8</div>
              <div className="absolute left-1/5 top-40 text-4xl font-bold">3² = 9</div>
              <div className="absolute left-1/2 top-60 text-7xl font-bold">π</div>
              <div className="absolute left-1/4 top-80 text-5xl font-bold">∑</div>
              <div className="absolute left-3/4 top-30 text-6xl font-bold">∫</div>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
              <Card className="max-w-2xl w-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    AI-Powered Arithmetic Calculator
                  </CardTitle>
                  <CardDescription className="text-lg mt-4">
                    This intelligent calculator, powered by Wolfram, helps you solve arithmetic expressions instantly
                    and accurately. Whether it&apos;s simple operations or complex brackets, EduPilot has you covered!
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className="w-full max-w-md"
                  >
                    <Button
                      onClick={handleLaunchCalculator}
                      className={`w-full h-20 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ${
                        isHovered ? "shadow-lg shadow-purple-500/30" : ""
                      }`}
                    >
                      Launch Calculator
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>

                  <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-center">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      To run the calculator once opened, please press{" "}
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + Shift + Enter</kbd> inside
                      the Wolfram Notebook.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <FeatureCard
                      title="Instant Calculations"
                      description="Get immediate results for your arithmetic expressions"
                    />
                    <FeatureCard
                      title="Complex Operations"
                      description="Handles brackets, exponents, and multi-step calculations"
                    />
                    <FeatureCard title="Wolfram Powered" description="Leverages the computational knowledge engine" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="backdrop-blur-md bg-background/60 border-background/20 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
