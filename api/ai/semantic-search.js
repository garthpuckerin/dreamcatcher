import OpenAI from 'openai'
import { withMiddleware, sanitizeString, validateBody, errorResponse } from '../lib/utils.js'

async function handler(req, res) {
  const errors = validateBody(req.body, {
    query: { required: true, type: 'string', maxLength: 500 },
    dreams: { required: true, type: 'array', maxItems: 100 }
  })
  
  if (errors) {
    return errorResponse(res, 400, 'Validation failed', errors)
  }

  const { query, dreams } = req.body

  if (!dreams || dreams.length === 0) {
    return res.status(200).json({ results: [] })
  }

  const maxDreams = 50
  const truncatedDreams = dreams.slice(0, maxDreams)

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const dreamsContext = truncatedDreams.map((d, i) => 
    `[${i}] Title: ${sanitizeString(d.title, 100) || 'Untitled'} | Tags: ${(d.tags || []).slice(0, 5).join(', ') || 'none'} | Description: ${sanitizeString(d.description, 100) || ''}`
  ).join('\n')

  const prompt = `Given this search query: "${sanitizeString(query, 200)}"

Find the most relevant dreams from this list and return their indices in order of relevance.
Only return dreams that are genuinely relevant to the query.

Dreams:
${dreamsContext}

Return ONLY a JSON array of indices (numbers) of matching dreams, most relevant first.
If no dreams match, return an empty array: []
Example: [3, 7, 1]`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
    temperature: 0.2,
  })

  const content = completion.choices[0]?.message?.content?.trim()
  
  let indices
  try {
    indices = JSON.parse(content)
  } catch {
    indices = content.match(/\d+/g)?.map(Number) || []
  }

  const validIndices = indices.filter(i => i >= 0 && i < truncatedDreams.length)
  const results = validIndices.map((i, rank) => ({
    id: truncatedDreams[i].id,
    score: 1 - (rank * 0.1),
    title: truncatedDreams[i].title
  }))

  return res.status(200).json({ results })
}

export default withMiddleware(handler, { rateLimit: { limit: 30, windowMs: 60000 } })
