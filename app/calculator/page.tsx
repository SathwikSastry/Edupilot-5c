"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, ExternalLink } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/sidebar"

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

          <div className="relative mx-auto max-w-3xl">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -left-10 top-10 text-6xl opacity-5">1 + 1 = 2</div>
              <div className="absolute left-1/2 top-1/3 text-5xl opacity-5">x² + y² = z²</div>
              <div className="absolute bottom-10 right-10 text-7xl opacity-5">∫</div>
              <div className="absolute bottom-1/3 left-10 text-4xl opacity-5">∑</div>
              <div className="absolute right-1/4 top-1/4 text-5xl opacity-5">π</div>
              <div className="absolute bottom-1/4 left-1/3 text-6xl opacity-5">√</div>
            </div>

            <Card className="border-2 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
                  AI-Powered Arithmetic Calculator
                </CardTitle>
                <CardDescription className="text-lg mt-4">
                  This intelligent calculator, powered by Wolfram, helps you solve arithmetic expressions instantly and
                  accurately. Whether it's simple operations or complex brackets, EduPilot has you covered!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  className="w-full max-w-md"
                >
                  <Button
                    onClick={handleLaunchCalculator}
                    className={`w-full h-24 text-xl transition-all duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 hover:shadow-lg ${
                      isHovered ? "shadow-xl shadow-purple-200 dark:shadow-purple-900/30" : ""
                    }`}
                  >
                    <Calculator className="mr-2 h-6 w-6" />
                    Launch Calculator
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-muted">
                  <p className="text-center font-medium">
                    To run the calculator once opened, please press{" "}
                    <kbd className="px-2 py-1 bg-background rounded border">Ctrl + Shift + Enter</kbd> inside the
                    Wolfram Notebook.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center text-center text-sm text-muted-foreground">
                <p>Powered by Wolfram Cloud technology for accurate and efficient calculations.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
