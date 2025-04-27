"use client"

import { useState } from "react"
import { Calculator, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CalculatorPage() {
  const [isHovered, setIsHovered] = useState(false)

  const handleLaunchCalculator = () => {
    window.open(
      "https://www.wolframcloud.com/obj/sathwiksastryr/Published/ac8adc08-a02c-4a9f-a531-e8939b701c06.nb",
      "_blank",
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl">+</div>
          <div className="absolute top-40 right-20 text-7xl">÷</div>
          <div className="absolute bottom-20 left-1/4 text-8xl">×</div>
          <div className="absolute bottom-40 right-1/3 text-5xl">−</div>
          <div className="absolute top-1/3 left-1/3 text-9xl">√</div>
          <div className="absolute top-2/3 right-1/4 text-6xl">π</div>
          <div className="absolute bottom-10 right-10 text-7xl">=</div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Calculator className="h-16 w-16 text-primary mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 bg-clip-text text-transparent">
                AI-Powered Arithmetic Calculator
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl"
            >
              This intelligent calculator, powered by Wolfram, helps you solve arithmetic expressions instantly and
              accurately. Whether it&apos;s simple operations or complex brackets, EduPilot has you covered!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full max-w-md"
            >
              <Card
                className={`border-2 transition-all duration-300 ${
                  isHovered ? "shadow-lg border-primary/50 shadow-primary/20" : "shadow-md border-border"
                }`}
              >
                <CardContent className="p-0">
                  <Button
                    onClick={handleLaunchCalculator}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="w-full h-auto py-8 text-xl font-semibold flex flex-col items-center gap-4 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-yellow-500/90 hover:from-blue-600 hover:via-purple-600 hover:to-yellow-500 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      Launch Calculator <ExternalLink className="h-5 w-5" />
                    </span>
                  </Button>
                </CardContent>
              </Card>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm text-muted-foreground mt-4 text-center"
              >
                To run the calculator once opened, please press Ctrl + Shift + Enter inside the Wolfram Notebook.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
