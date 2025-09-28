/**
 * Extracts and parses JSON from a string that might contain markdown or other formatting
 */
export function extractJsonFromString(text: string): any {
  if (!text || typeof text !== "string") {
    return null
  }

  // Clean the text
  let cleanText = text.trim()

  // Remove markdown code blocks
  cleanText = cleanText.replace(/```json\s*/g, "").replace(/```\s*/g, "")

  // Remove any leading/trailing text that's not JSON
  const jsonMatch = cleanText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/)
  if (jsonMatch) {
    cleanText = jsonMatch[1]
  }

  // Try to parse the JSON
  try {
    return JSON.parse(cleanText)
  } catch (error) {
    console.error("Failed to parse JSON:", error)
    console.error("Text was:", cleanText)

    // Try to fix common JSON issues
    try {
      // Fix trailing commas
      let fixedText = cleanText.replace(/,(\s*[}\]])/g, "$1")

      // Fix single quotes to double quotes
      fixedText = fixedText.replace(/'/g, '"')

      // Fix unquoted keys
      fixedText = fixedText.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')

      return JSON.parse(fixedText)
    } catch (secondError) {
      console.error("Failed to parse fixed JSON:", secondError)
      return null
    }
  }
}

// Alternative export name for compatibility
export const extractJSON = extractJsonFromString

export function safeJSONParse(text: string, fallback: any = null): any {
  try {
    return JSON.parse(text)
  } catch {
    return extractJsonFromString(text) || fallback
  }
}
