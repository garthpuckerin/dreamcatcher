import OpenAI from 'openai';

// In-memory rate limiting
const rateLimit = new Map();

function checkRateLimit(identifier, limit = 30, windowMs = 60000) {
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

  const { query, dreams = [] } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  if (!dreams || dreams.length === 0) {
    return res.status(200).json({ results: [] });
  }

  // Limit the number of dreams to analyze
  const maxDreams = 50;
  const truncatedDreams = dreams.slice(0, maxDreams);

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const dreamsContext = truncatedDreams.map((d, i) => 
      `[${i}] Title: ${d.title || 'Untitled'} | Tags: ${d.tags?.join(', ') || 'none'} | Description: ${(d.description || '').slice(0, 100)}`
    ).join('\n');

    const prompt = `Given this search query: "${query}"

Find the most relevant dreams from this list and return their indices in order of relevance.
Only return dreams that are genuinely relevant to the query.

Dreams:
${dreamsContext}

Return ONLY a JSON array of indices (numbers) of matching dreams, most relevant first.
If no dreams match, return an empty array: []
Example: [3, 7, 1]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    
    let indices;
    try {
      indices = JSON.parse(content);
    } catch {
      // Try to extract numbers
      indices = content.match(/\d+/g)?.map(Number) || [];
    }

    // Filter valid indices and map back to dream IDs
    const validIndices = indices.filter(i => i >= 0 && i < truncatedDreams.length);
    const results = validIndices.map(i => ({
      id: truncatedDreams[i].id,
      score: 1 - (validIndices.indexOf(i) * 0.1), // Decreasing relevance score
      title: truncatedDreams[i].title
    }));

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Semantic search error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }
    
    return res.status(500).json({ error: 'Failed to perform semantic search' });
  }
}
