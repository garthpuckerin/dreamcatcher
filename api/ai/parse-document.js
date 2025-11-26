import OpenAI from 'openai'
import { withMiddleware, sanitizeString, validateBody, errorResponse } from '../lib/utils.js'

async function handler(req, res) {
  const errors = validateBody(req.body, {
    content: { required: true, type: 'string', maxLength: 50000 },
    filename: { type: 'string', maxLength: 255 },
  })

  if (errors) {
    return errorResponse(res, 400, 'Validation failed', errors)
  }

  const { content, filename } = req.body
  const truncatedContent = sanitizeString(content, 10000)

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const prompt = `Analyze this document and extract structured information:

Filename: ${sanitizeString(filename, 255) || 'Unknown'}
Content:
${truncatedContent}

Extract and return a JSON object with:
{
  "title": "Suggested title for a dream/goal based on content",
  "description": "Brief summary of the document (2-3 sentences)",
  "tasks": ["Extracted action items or todos"],
  "tags": ["Relevant category tags"],
  "deadlines": ["Any dates or deadlines mentioned (ISO format if possible)"],
  "priority": "low|medium|high (based on urgency indicators)"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.3,
  })

  const responseContent = completion.choices[0]?.message?.content?.trim()

  let parsed
  try {
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseContent)
  } catch {
    parsed = {
      title: filename || 'Imported Document',
      description: responseContent.slice(0, 200),
      tasks: [],
      tags: [],
      deadlines: [],
      priority: 'medium',
    }
  }

  return res.status(200).json(parsed)
}

export default withMiddleware(handler, { rateLimit: { limit: 5, windowMs: 60000 } })
