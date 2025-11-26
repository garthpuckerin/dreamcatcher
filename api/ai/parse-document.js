import OpenAI from 'openai';

// In-memory rate limiting
const rateLimit = new Map();

function checkRateLimit(identifier, limit = 5, windowMs = 60000) {
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
  if (!checkRateLimit(identifier, 5)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  const { content, filename } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Document content is required' });
  }

  // Limit content size to prevent abuse
  const maxContentLength = 10000;
  const truncatedContent = content.slice(0, maxContentLength);

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Analyze this document and extract structured information:

Filename: ${filename || 'Unknown'}
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
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3,
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();
    
    let parsed;
    try {
      // Try to extract JSON from response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseContent);
    } catch {
      // Fallback structure
      parsed = {
        title: filename || 'Imported Document',
        description: responseContent.slice(0, 200),
        tasks: [],
        tags: [],
        deadlines: [],
        priority: 'medium'
      };
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Document parsing error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }
    
    return res.status(500).json({ error: 'Failed to parse document' });
  }
}
