import { type NextRequest, NextResponse } from "next/server"

// Placeholder for OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ""
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

// Default model - can be configured
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct:free"

// System prompts for different tasks
const SYSTEM_PROMPTS = {
  summarize:
    "You are a helpful assistant that creates concise, well-structured summaries of academic content. Focus on key concepts, main ideas, and important details.",
  quiz: 'You are a quiz generator. Create multiple-choice questions based on the provided content. Return a JSON array of questions with the format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..."}]',
  flashcards:
    'You are a flashcard generator. Create study flashcards based on the provided content. Return a JSON array with the format: [{"question": "...", "answer": "..."}]',
  mindmap:
    'You are a mind map generator. Create a hierarchical mind map structure based on the provided content. Return a JSON object with the format: {"title": "...", "children": [{"title": "...", "children": [...]}]}',
  askdoubt:
    "You are a knowledgeable tutor. Answer the student's question based on the provided study material. Be clear, helpful, and educational in your response.",
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: "AI API not configured",
          message: "OpenRouter API key is not set. Please configure OPENROUTER_API_KEY environment variable.",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { task, content, prompt } = body

    // Validate required fields
    if (!task) {
      return NextResponse.json({ error: "Task is required" }, { status: 400 })
    }

    if (!SYSTEM_PROMPTS[task as keyof typeof SYSTEM_PROMPTS]) {
      return NextResponse.json({ error: "Invalid task type" }, { status: 400 })
    }

    // Build the user message based on task type
    let userMessage = ""

    if (task === "askdoubt") {
      if (!prompt || !content) {
        return NextResponse.json(
          { error: "Both question and content are required for doubt clearing" },
          { status: 400 },
        )
      }
      userMessage = `Study Material: ${content}\n\nQuestion: ${prompt}`
    } else {
      if (!content) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 })
      }
      userMessage = content
    }

    // Make request to OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "EduPilot",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS[task as keyof typeof SYSTEM_PROMPTS],
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenRouter API error:", errorData)

      return NextResponse.json(
        {
          error: "AI service error",
          message: errorData.error?.message || "Failed to process request",
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json({ error: "Invalid response from AI service" }, { status: 500 })
    }

    const result = data.choices[0].message.content

    return NextResponse.json({
      success: true,
      result,
      task,
      usage: data.usage,
    })
  } catch (error) {
    console.error("API route error:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "EduPilot AI API",
    status: "ready",
    configured: !!OPENROUTER_API_KEY,
  })
}
