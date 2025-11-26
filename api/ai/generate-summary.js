import OpenAI from 'openai';

// In-memory rate limiting
const rateLimit = new Map();

function checkRateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimit.get(identifier) || [];
  const recentRequests = userRequests.filter(time => now - time < windowMs);

  if (recentRequests.length >= limit) {
    return false;
  }

  recentRequests.push(now);
  rateLimit.set(identifier, recentRequests);
  return true;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const identifier = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(identifier)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  const { title, description, tasks = [], type = 'summary' } = req.body;

  if (!title && !description) {
    return res.status(400).json({ error: 'Title or description is required' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let prompt;
    
    if (type === 'highlights') {
      prompt = `Extract 3-5 key highlights/takeaways from this dream/goal:

Title: ${title || 'N/A'}
Description: ${description || 'N/A'}
Tasks: ${tasks.map(t => `- ${t.text} (${t.completed ? 'done' : 'pending'})`).join('\n') || 'None'}

Return ONLY a JSON array of highlight strings.
Example: ["Main objective is X", "Key milestone achieved", "Blocked by Y"]`;
    } else {
      prompt = `Generate a concise 2-3 sentence summary of this dream/goal:

Title: ${title || 'N/A'}
Description: ${description || 'N/A'}
Tasks: ${tasks.map(t => `- ${t.text} (${t.completed ? 'done' : 'pending'})`).join('\n') || 'None'}

Focus on: current status, main objectives, and any blockers.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (type === 'highlights') {
      let highlights;
      try {
        highlights = JSON.parse(content);
      } catch {
        highlights = content.split('\n').filter(line => line.trim()).slice(0, 5);
      }
      return res.status(200).json({ highlights });
    }

    return res.status(200).json({ summary: content });
  } catch (error) {
    console.error('Summary generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }
    
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
}
