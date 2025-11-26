import OpenAI from 'openai'
import { withMiddleware, sanitizeString, validateBody, errorResponse } from '../lib/utils.js'

async function handler(req, res) {
  const errors = validateBody(req.body, {
    title: { type: 'string', maxLength: 500 },
    description: { type: 'string', maxLength: 5000 },
    tasks: { type: 'array', maxItems: 100 },
    type: { type: 'string', maxLength: 20 },
  })

  if (errors) {
    return errorResponse(res, 400, 'Validation failed', errors)
  }

  const { title, description, tasks = [], type = 'summary' } = req.body

  if (!title && !description) {
    return errorResponse(res, 400, 'Title or description is required')
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const tasksText =
    tasks
      .slice(0, 50)
      .map(t => `- ${sanitizeString(t.text, 200)} (${t.completed ? 'done' : 'pending'})`)
      .join('\n') || 'None'

  let prompt
  if (type === 'highlights') {
    prompt = `Extract 3-5 key highlights/takeaways from this dream/goal:

Title: ${sanitizeString(title, 500) || 'N/A'}
Description: ${sanitizeString(description, 2000) || 'N/A'}
Tasks: ${tasksText}

Return ONLY a JSON array of highlight strings.
Example: ["Main objective is X", "Key milestone achieved", "Blocked by Y"]`
  } else {
    prompt = `Generate a concise 2-3 sentence summary of this dream/goal:

Title: ${sanitizeString(title, 500) || 'N/A'}
Description: ${sanitizeString(description, 2000) || 'N/A'}
Tasks: ${tasksText}

Focus on: current status, main objectives, and any blockers.`
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.5,
  })

  const content = completion.choices[0]?.message?.content?.trim()

  if (type === 'highlights') {
    let highlights
    try {
      highlights = JSON.parse(content)
    } catch {
      highlights = content
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 5)
    }
    return res.status(200).json({ highlights })
  }

  return res.status(200).json({ summary: content })
}

export default withMiddleware(handler, { rateLimit: { limit: 10, windowMs: 60000 } })
