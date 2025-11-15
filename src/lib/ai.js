import OpenAI from 'openai';

// Initialize OpenAI client (optional - null if not configured)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const aiEnabled = import.meta.env.VITE_AI_ENABLED === 'true';
const model = import.meta.env.VITE_AI_MODEL || 'gpt-4-turbo-preview';

export const openai = apiKey && aiEnabled
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // For development - should use backend proxy in production
    })
  : null;

// Check if AI features are available
export function isAIAvailable() {
  return openai !== null;
}

// Log configuration status
if (!openai) {
  console.warn('⚠️ AI features disabled - set VITE_OPENAI_API_KEY in .env.local to enable');
} else {
  console.log('🤖 AI features enabled');
}

/**
 * Generate a summary for a dream based on its fragments
 * @param {Object} dream - The dream object with fragments
 * @returns {Promise<string>} - Generated summary
 */
export async function generateDreamSummary(dream) {
  if (!openai) {
    return 'AI summarization not available. Set VITE_OPENAI_API_KEY to enable.';
  }

  try {
    const fragmentsText = dream.fragments
      ?.map((f, idx) => `Fragment ${idx + 1}: ${f.title}\n${f.content.substring(0, 500)}`)
      .join('\n\n') || '';

    const prompt = `Analyze this project/dream and create a concise 2-3 sentence summary that captures:
1. The main goal/purpose
2. Key features or components
3. Current status or progress

Dream Title: ${dream.title}
Description: ${dream.description || 'No description'}

Fragments:
${fragmentsText}

Summary:`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a technical project analyst. Create concise, actionable summaries of software projects and ideas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

/**
 * Extract highlights/key points from a fragment
 * @param {Object} fragment - The fragment object
 * @returns {Promise<string[]>} - Array of highlight strings
 */
export async function extractFragmentHighlights(fragment) {
  if (!openai) {
    return [];
  }

  try {
    const prompt = `Extract 3-5 key highlights or important points from this conversation fragment. 
Focus on:
- Technical decisions
- Feature requirements
- Action items
- Important insights

Fragment: ${fragment.title}
Content: ${fragment.content.substring(0, 2000)}

Return highlights as a JSON array of strings, e.g., ["highlight 1", "highlight 2"]`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a technical analyst extracting key points from conversations. Return ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.highlights || [];
  } catch (error) {
    console.error('Error extracting highlights:', error);
    return [];
  }
}

/**
 * Suggest tags for a dream based on its content
 * @param {Object} dream - The dream object
 * @returns {Promise<string[]>} - Array of suggested tags
 */
export async function suggestTags(dream) {
  if (!openai) {
    return [];
  }

  try {
    const fragmentsText = dream.fragments
      ?.map(f => f.content.substring(0, 300))
      .join('\n') || '';

    const prompt = `Analyze this project and suggest 5-8 relevant tags that categorize it.
Focus on:
- Technology stack (e.g., react, nodejs, python)
- Project type (e.g., web-app, mobile-app, cli-tool)
- Domain (e.g., productivity, finance, education)
- Features (e.g., ai, real-time, offline-first)

Title: ${dream.title}
Description: ${dream.description || 'No description'}
Content: ${fragmentsText.substring(0, 1000)}

Return tags as a JSON array of lowercase strings, e.g., ["tag1", "tag2"]`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a technical tagger. Return ONLY valid JSON with relevant, specific tags.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.6,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.tags || [];
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return [];
  }
}

/**
 * Detect project names from conversation content
 * @param {string} content - Conversation content
 * @returns {Promise<string[]>} - Array of detected project names
 */
export async function detectProjectNames(content) {
  if (!openai) {
    return [];
  }

  try {
    const prompt = `Analyze this conversation and extract any project names or product names mentioned.
Look for:
- Explicit project names ("building ProjectX", "creating AppName")
- Product names
- System names

Content: ${content.substring(0, 2000)}

Return project names as a JSON array of strings, e.g., ["ProjectName1", "ProjectName2"]
If no projects are mentioned, return an empty array: []`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a project name extractor. Return ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.projects || [];
  } catch (error) {
    console.error('Error detecting project names:', error);
    return [];
  }
}

/**
 * Parse a document and extract todos, deadlines, and tasks
 * @param {string} text - Document text content
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} - Parsed document data
 */
export async function parseDocument(text, fileName) {
  if (!openai) {
    throw new Error('AI features not available');
  }

  try {
    const prompt = `Analyze this document and extract:
1. All TODO items or tasks (with description)
2. All deadlines or dates mentioned
3. Task categories (coding, admin, design, marketing, devops, strategy)
4. Dependencies or blockers mentioned

Document: ${fileName}
Content: ${text.substring(0, 4000)}

Return as JSON with this structure:
{
  "todos": [
    {
      "title": "Task title",
      "description": "Task description",
      "category": "coding|admin|design|marketing|devops|strategy",
      "deadline": "ISO date string or null",
      "priority": 0-2 (0=normal, 1=high, 2=urgent)
    }
  ],
  "summary": "Brief document summary",
  "keyPoints": ["key point 1", "key point 2"]
}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a document analyzer that extracts actionable tasks and information. Return ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      todos: result.todos || [],
      summary: result.summary || '',
      keyPoints: result.keyPoints || [],
      parsedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error parsing document:', error);
    throw new Error(`Failed to parse document: ${error.message}`);
  }
}

/**
 * Semantic search across dreams and fragments
 * @param {string} query - Search query
 * @param {Array} dreams - Array of dreams to search
 * @returns {Promise<Array>} - Ranked search results
 */
export async function semanticSearch(query, dreams) {
  if (!openai) {
    // Fallback to basic text search
    const lowerQuery = query.toLowerCase();
    return dreams
      .filter(dream => {
        const matchesTitle = dream.title.toLowerCase().includes(lowerQuery);
        const matchesDescription = dream.description?.toLowerCase().includes(lowerQuery);
        const matchesFragments = dream.fragments?.some(f =>
          f.content.toLowerCase().includes(lowerQuery)
        );
        return matchesTitle || matchesDescription || matchesFragments;
      })
      .map(dream => ({ dream, score: 1.0, reason: 'text match' }));
  }

  try {
    // Create a search context for AI
    const dreamSummaries = dreams.map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      tags: d.tags,
      fragmentCount: d.fragments?.length || 0
    }));

    const prompt = `Given this search query, rank the following projects by relevance and explain why they match.

Search Query: "${query}"

Projects:
${JSON.stringify(dreamSummaries, null, 2)}

Return as JSON:
{
  "results": [
    {
      "dreamId": number,
      "score": 0-1,
      "reason": "brief explanation"
    }
  ]
}

Sort by score (highest first). Only include projects with score > 0.3`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a semantic search engine. Analyze query intent and match to projects. Return ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Map dream IDs back to dream objects
    return result.results
      .map(r => ({
        dream: dreams.find(d => d.id === r.dreamId),
        score: r.score,
        reason: r.reason
      }))
      .filter(r => r.dream); // Remove any that couldn't be mapped
  } catch (error) {
    console.error('Error in semantic search:', error);
    // Fallback to basic search on error
    return dreams
      .filter(dream => {
        const lowerQuery = query.toLowerCase();
        return dream.title.toLowerCase().includes(lowerQuery) ||
               dream.description?.toLowerCase().includes(lowerQuery);
      })
      .map(dream => ({ dream, score: 1.0, reason: 'text match (fallback)' }));
  }
}

