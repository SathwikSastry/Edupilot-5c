"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Scissors, HelpCircle, BookOpen, BrainCircuit, RotateCcw, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FlashcardViewer } from "@/components/flashcard-viewer"
import { MindMapNotebook } from "@/components/mind-map-notebook"
import { QuizGenerator } from "@/components/quiz-generator"
import { ExportTools } from "@/components/export-tools"
import { VoiceInteraction } from "@/components/voice-interaction"
import ReactMarkdown from "react-markdown"

export default function StudyPage() {
  const [studyText, setStudyText] = useState("")
  const [activeTab, setActiveTab] = useState("input")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string>("")
  const [resultType, setResultType] = useState<string>("")
  const [question, setQuestion] = useState<string>("")
  const { toast } = useToast()

  const processStudyText = async (action: string) => {
    if (!studyText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to process",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setActiveTab("result")
    setResultType(action)

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: action,
          content: studyText,
          prompt: action === "askdoubt" ? question : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} text`)
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error(`Error ${action}ing text:`, error)
      toast({
        title: "Processing failed",
        description: `There was an error ${action === "askdoubt" ? "answering your question" : "processing your text"}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceCapture = (text: string) => {
    setQuestion(text)
    if (studyText.trim()) {
      processStudyText("askdoubt")
    } else {
      toast({
        title: "Empty input",
        description: "Please enter some study text first",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI Study Assistant</h1>
          <p className="text-muted-foreground">Transform your study materials with AI</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="result" disabled={!result && !isProcessing}>
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Material</CardTitle>
                <CardDescription>Paste your notes, textbook excerpts, or any study material</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your study text here..."
                  className="min-h-[300px]"
                  value={studyText}
                  onChange={(e) => setStudyText(e.target.value)}
                />

                {/* Voice interaction and question input */}
                <div className="mt-4 space-y-4">
                  <VoiceInteraction onTextCapture={handleVoiceCapture} />

                  <div>
                    <label htmlFor="question" className="mb-2 block text-sm font-medium">
                      Have a question about this material?
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="question"
                        placeholder="Type your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                      <Button
                        onClick={() => processStudyText("askdoubt")}
                        disabled={!question.trim() || !studyText.trim()}
                        className="bg-purple-500 hover:bg-purple-600 whitespace-nowrap"
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Ask
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button onClick={() => processStudyText("summarize")} className="bg-blue-500 hover:bg-blue-600">
                  <Scissors className="mr-2 h-4 w-4" />
                  Summarize
                </Button>
                <Button onClick={() => setActiveTab("quiz")} className="bg-green-500 hover:bg-green-600">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Generate Quiz
                </Button>
                <Button onClick={() => setActiveTab("mindmap")} className="bg-amber-500 hover:bg-amber-600">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Create Mind Map
                </Button>
                <Button onClick={() => setActiveTab("flashcards")} className="bg-pink-500 hover:bg-pink-600">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Flashcards
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="result" className="mt-6">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-lg font-medium">Processing your text...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>
                          {resultType === "summarize"
                            ? "Summary"
                            : resultType === "askdoubt"
                              ? "Answer to Your Question"
                              : "Result"}
                        </CardTitle>
                        <CardDescription>
                          {resultType === "summarize"
                            ? "A concise summary of your study material"
                            : resultType === "askdoubt"
                              ? `"${question}"`
                              : "AI-generated content based on your input"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExportTools
                          contentType="summary"
                          content={result}
                          title={resultType === "summarize" ? "Study Summary" : "Study Answer"}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => processStudyText(resultType)}
                          title="Regenerate"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{result}</ReactMarkdown>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("input")}>
                        Back to Input
                      </Button>
                      <Button
                        onClick={() => {
                          setResult("")
                          setActiveTab("input")
                        }}
                      >
                        Start New
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <QuizGenerator studyText={studyText} onBack={() => setActiveTab("input")} />
          </TabsContent>

          <TabsContent value="mindmap" className="mt-6">
            <MindMapNotebook studyText={studyText} onBack={() => setActiveTab("input")} />
          </TabsContent>

          <TabsContent value="flashcards" className="mt-6">
            <FlashcardViewer studyText={studyText} onBack={() => setActiveTab("input")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
