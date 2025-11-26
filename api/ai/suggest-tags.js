import OpenAI from 'openai'
import { withMiddleware, sanitizeString, validateBody, errorResponse } from '../lib/utils.js'

async function handler(req, res) {
  const errors = validateBody(req.body, {
    title: { type: 'string', maxLength: 500 },
    description: { type: 'string', maxLength: 5000 },
    existingTags: { type: 'array', maxItems: 100 },
  })

  if (errors) {
    return errorResponse(res, 400, 'Validation failed', errors)
  }

  const { title, description, existingTags = [] } = req.body

  if (!title && !description) {
    return errorResponse(res, 400, 'Title or description is required')
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const prompt = `Analyze this dream/goal and suggest 3-5 relevant tags.

Title: ${sanitizeString(title, 500) || 'N/A'}
Description: ${sanitizeString(description, 2000) || 'N/A'}
Existing tags in system: ${existingTags.slice(0, 50).join(', ') || 'None'}

Return ONLY a JSON array of tag strings, prioritizing existing tags when relevant.
Example: ["work", "urgent", "project-alpha"]`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
    temperature: 0.3,
  })

  const content = completion.choices[0]?.message?.content?.trim()
  let tags

  try {
    tags = JSON.parse(content)
  } catch {
    tags = content.match(/["']([^"']+)["']/g)?.map(t => t.replace(/["']/g, '')) || []
  }

  return res.status(200).json({ tags })
}

export default withMiddleware(handler, { rateLimit: { limit: 20, windowMs: 60000 } })
