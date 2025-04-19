/**
 * Extracts JSON from a string that might contain markdown code blocks
 * @param text The text that might contain JSON, possibly within markdown code blocks
 * @returns The parsed JSON object or null if parsing fails
 */
export function extractJsonFromString(text: string): any {
  try {
    // First try to parse the text directly as JSON
    return JSON.parse(text)
  } catch (e) {
    // If that fails, try to extract JSON from markdown code blocks
    try {
      // Look for JSON in code blocks: ```json ... ```
      const jsonCodeBlockRegex = /```(?:json)?\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```/
      const match = text.match(jsonCodeBlockRegex)

      if (match && match[1]) {
        return JSON.parse(match[1])
      }

      // If no code blocks, look for arrays or objects directly
      const jsonRegex = /(\[[\s\S]*?\]|\{[\s\S]*?\})/
      const directMatch = text.match(jsonRegex)

      if (directMatch && directMatch[1]) {
        return JSON.parse(directMatch[1])
      }
    } catch (innerError) {
      console.error("Failed to extract JSON:", innerError)
    }
  }

  return null
}
