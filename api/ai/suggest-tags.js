import OpenAI from 'openai';

// In-memory rate limiting (resets on cold start)
const rateLimit = new Map();

function checkRateLimit(identifier, limit = 20, windowMs = 60000) {
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
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting by IP
  const identifier = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(identifier)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  const { title, description, existingTags = [] } = req.body;

  if (!title && !description) {
    return res.status(400).json({ error: 'Title or description is required' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Analyze this dream/goal and suggest 3-5 relevant tags.

Title: ${title || 'N/A'}
Description: ${description || 'N/A'}
Existing tags in system: ${existingTags.join(', ') || 'None'}

Return ONLY a JSON array of tag strings, prioritizing existing tags when relevant.
Example: ["work", "urgent", "project-alpha"]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    let tags;

    try {
      tags = JSON.parse(content);
    } catch {
      // Fallback: extract words that look like tags
      tags = content.match(/["']([^"']+)["']/g)?.map(t => t.replace(/["']/g, '')) || [];
    }

    return res.status(200).json({ tags });
  } catch (error) {
    console.error('Tag suggestion error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }
    
    return res.status(500).json({ error: 'Failed to generate tag suggestions' });
  }
}
