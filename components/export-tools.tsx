"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, FileDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface ExportToolsProps {
  contentType: "summary" | "quiz" | "flashcards" | "mindmap"
  content: string | object
  title?: string
}

export function ExportTools({ contentType, content, title = "EduPilot Export" }: ExportToolsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportAsPDF = async () => {
    setIsExporting(true)

    try {
      // Create a temporary container to render the content
      const container = document.createElement("div")
      container.className = "export-container p-8 bg-white text-black"
      container.style.width = "800px"
      container.style.position = "absolute"
      container.style.left = "-9999px"

      // Add title
      const titleElement = document.createElement("h1")
      titleElement.className = "text-3xl font-bold mb-6"
      titleElement.textContent = title
      container.appendChild(titleElement)

      // Add content based on type
      if (contentType === "summary" || typeof content === "string") {
        // For text content
        const contentElement = document.createElement("div")
        contentElement.className = "prose max-w-none"
        contentElement.innerHTML = typeof content === "string" ? content : JSON.stringify(content, null, 2)
        container.appendChild(contentElement)
      } else {
        // For structured content (quiz, flashcards, etc.)
        const contentElement = document.createElement("pre")
        contentElement.className = "whitespace-pre-wrap"
        contentElement.textContent = JSON.stringify(content, null, 2)
        container.appendChild(contentElement)
      }

      // Add to document temporarily
      document.body.appendChild(container)

      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      // Remove temporary container
      document.body.removeChild(container)

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Save PDF
      pdf.save(`${title.replace(/\s+/g, "_")}.pdf`)

      toast({
        title: "Export successful",
        description: "Your content has been exported as PDF",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your content",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsMarkdown = () => {
    setIsExporting(true)

    try {
      let markdownContent = `# ${title}\n\n`

      if (typeof content === "string") {
        // Convert HTML to markdown (simple version)
        markdownContent += content
          .replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n")
          .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
          .replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n")
          .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
          .replace(/<ul>(.*?)<\/ul>/g, "$1\n")
          .replace(/<li>(.*?)<\/li>/g, "- $1\n")
          .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
          .replace(/<em>(.*?)<\/em>/g, "*$1*")
          .replace(/<br\s*\/?>/g, "\n")
          .replace(/<[^>]*>/g, "")
      } else {
        // For structured content
        if (contentType === "quiz") {
          markdownContent += "## Quiz Questions\n\n"
          const quizContent = Array.isArray(content) ? content : [content]
          quizContent.forEach((question: any, index: number) => {
            markdownContent += `### Question ${index + 1}: ${question.question}\n\n`
            question.options.forEach((option: string) => {
              const isCorrect = option === question.correctAnswer
              markdownContent += `- ${option} ${isCorrect ? "✓" : ""}\n`
            })
            markdownContent += "\n"
          })
        } else if (contentType === "flashcards") {
          markdownContent += "## Flashcards\n\n"
          const flashcards = Array.isArray(content) ? content : [content]
          flashcards.forEach((card: any, index: number) => {
            markdownContent += `### Card ${index + 1}\n\n`
            markdownContent += `**Question:** ${card.question}\n\n`
            markdownContent += `**Answer:** ${card.answer}\n\n`
          })
        } else {
          // Generic JSON content
          markdownContent += "```json\n"
          markdownContent += JSON.stringify(content, null, 2)
          markdownContent += "\n```\n"
        }
      }

      // Create blob and download
      const blob = new Blob([markdownContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.replace(/\s+/g, "_")}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Your content has been exported as Markdown",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your content",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsPDF} disabled={isExporting}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsMarkdown} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
