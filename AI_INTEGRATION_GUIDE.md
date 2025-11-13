# AI Features Integration Guide

## Overview
Dreamcatcher v2.4.0 introduces comprehensive AI-powered features including:
- **Document Upload & Parsing**: Upload documents and extract tasks automatically
- **Smart Tag Suggestions**: AI-suggested tags based on dream content
- **Auto-Summarization**: Generate dream summaries from fragments
- **Fragment Highlights**: Extract key points from conversations
- **Semantic Search**: Intent-based search beyond keyword matching

---

## Setup

### 1. Install Dependencies
```bash
npm install
```

New dependencies added:
- `openai` - OpenAI API client
- `mammoth` - DOCX file parsing
- `pdf-parse` - PDF file parsing (backend only)

### 2. Configure Environment Variables

Create `.env.local` in project root:
```env
# OpenAI Configuration (Required for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# AI Model Configuration
VITE_AI_MODEL=gpt-4-turbo-preview
VITE_AI_ENABLED=true

# Supabase (Optional for cloud storage)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Debug Mode
VITE_DEBUG_MODE=true
```

### 3. Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account or sign in
3. Navigate to API Keys section
4. Create new secret key
5. Copy key to `.env.local`

---

## Using AI Features in Your UI

### 1. Document Upload Component

Add to Dream Detail View (Summary tab):

```jsx
import DocumentUpload from './components/DocumentUpload';
import { useAuth } from './hooks/useAuth';

// In your component:
const { user } = useAuth();

// In render:
<DocumentUpload 
  dreamId={selectedDream.id}
  onDocumentParsed={(result) => {
    console.log('Parsed document:', result);
    
    // Add extracted todos to dream
    result.parsed.todos.forEach(todo => {
      handleAddTodo(selectedDream.id, todo);
    });
    
    // Optionally update dream summary
    if (result.parsed.summary) {
      handleUpdateDream({
        ...selectedDream,
        summary: result.parsed.summary
      });
    }
  }}
/>
```

### 2. AI Tag Suggestions

Add to Dream Form (Create/Edit):

```jsx
import AIAssistant from './components/AIAssistant';

// In your form component:
const [newDream, setNewDream] = useState({ title: '', description: '', tags: [] });

// In render (after tags input):
<AIAssistant
  dream={newDream}
  type="tags"
  onSuggestionsApplied={(suggestedTags) => {
    setNewDream(prev => ({
      ...prev,
      tags: [...new Set([...prev.tags, ...suggestedTags])] // Merge unique tags
    }));
  }}
/>
```

### 3. Auto-Summarization

Add to Dream Detail View (Summary tab):

```jsx
import AIAssistant from './components/AIAssistant';

// In Dream Detail component:
<AIAssistant
  dream={selectedDream}
  type="summary"
  onSuggestionsApplied={(summaries) => {
    handleUpdateDream({
      ...selectedDream,
      summary: summaries[0]
    });
  }}
/>
```

### 4. Semantic Search

Integrate into existing search:

```jsx
import { useAI } from './hooks/useAI';

// In main component:
const { performSemanticSearch, aiAvailable } = useAI();
const [useSemanticSearch, setUseSemanticSearch] = useState(true);

// Enhanced search function:
const handleSearch = async (query) => {
  if (aiAvailable && useSemanticSearch && query.length > 3) {
    // Use AI semantic search
    const results = await performSemanticSearch(query, dreams);
    return results.map(r => r.dream);
  } else {
    // Fallback to basic text search
    return dreams.filter(d => 
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.description?.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// In search bar UI:
<div className="flex items-center">
  <input 
    type="text" 
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder={aiAvailable ? "Try: 'projects about AI' or 'web apps using React'" : "Search dreams..."}
  />
  {aiAvailable && (
    <button
      onClick={() => setUseSemanticSearch(!useSemanticSearch)}
      className={useSemanticSearch ? 'active' : 'inactive'}
    >
      <Sparkles /> AI Search
    </button>
  )}
</div>
```

### 5. Fragment Highlights

Add to Fragment Detail View:

```jsx
import { useAI } from './hooks/useAI';
import { useState, useEffect } from 'react';

// In Fragment Detail component:
const { getFragmentHighlights } = useAI();
const [highlights, setHighlights] = useState([]);
const [loadingHighlights, setLoadingHighlights] = useState(false);

useEffect(() => {
  async function loadHighlights() {
    if (selectedFragment) {
      setLoadingHighlights(true);
      const extracted = await getFragmentHighlights(selectedFragment);
      setHighlights(extracted);
      setLoadingHighlights(false);
    }
  }
  loadHighlights();
}, [selectedFragment]);

// In render:
{highlights.length > 0 && (
  <div className="highlights-section">
    <h4>Key Highlights</h4>
    <ul>
      {highlights.map((highlight, idx) => (
        <li key={idx}>{highlight}</li>
      ))}
    </ul>
  </div>
)}
```

---

## API Reference

### AI Service (`src/lib/ai.js`)

#### `isAIAvailable()`
Returns whether AI features are configured and available.

#### `generateDreamSummary(dream)`
- **Params**: `dream` - Dream object with fragments
- **Returns**: `Promise<string>` - Generated summary text

#### `extractFragmentHighlights(fragment)`
- **Params**: `fragment` - Fragment object with content
- **Returns**: `Promise<string[]>` - Array of highlight strings

#### `suggestTags(dream)`
- **Params**: `dream` - Dream object
- **Returns**: `Promise<string[]>` - Array of suggested tags

#### `detectProjectNames(content)`
- **Params**: `content` - Text content to analyze
- **Returns**: `Promise<string[]>` - Array of detected project names

#### `parseDocument(text, fileName)`
- **Params**: 
  - `text` - Document text content
  - `fileName` - Original file name
- **Returns**: `Promise<Object>` - Parsed document data with todos, summary, keyPoints

#### `semanticSearch(query, dreams)`
- **Params**: 
  - `query` - Search query string
  - `dreams` - Array of dreams to search
- **Returns**: `Promise<Array>` - Ranked search results with scores

---

### Document Parser (`src/lib/documentParser.js`)

#### `parseDocumentFile(file)`
Extracts text from various document types.
- **Params**: `file` - File object
- **Returns**: `Promise<string>` - Extracted text
- **Supports**: TXT, MD, DOCX (PDF requires backend)

#### `validateDocument(file)`
Validates file type and size before parsing.
- **Params**: `file` - File to validate
- **Returns**: `{ valid: boolean, error?: string }`

#### `getFileMetadata(file)`
Extracts file metadata.
- **Returns**: Object with name, size, type, extension, lastModified

---

### Custom Hooks

#### `useAI()`
Hook for AI operations.

**Returns**:
```javascript
{
  aiAvailable: boolean,
  loading: boolean,
  error: string|null,
  generateSummary: (dream) => Promise<string>,
  getFragmentHighlights: (fragment) => Promise<string[]>,
  getTagSuggestions: (dream) => Promise<string[]>,
  detectProjects: (content) => Promise<string[]>,
  parseDocumentContent: (text, fileName) => Promise<Object>,
  performSemanticSearch: (query, dreams) => Promise<Array>
}
```

#### `useDocuments()`
Hook for document management.

**Returns**:
```javascript
{
  uploading: boolean,
  parsing: boolean,
  error: string|null,
  uploadAndParseDocument: (file, dreamId, userId) => Promise<Object>,
  deleteDocument: (documentId, filePath, userId) => Promise<boolean>
}
```

---

## Cost Management

### OpenAI API Pricing (as of 2025)
- **GPT-4 Turbo**: ~$0.01-0.03 per request
- **Average monthly cost** (moderate use): $5-20

### Cost Optimization Tips
1. **Cache results**: Store generated summaries and tags
2. **Batch operations**: Process multiple items together
3. **Use GPT-3.5 for simple tasks**: Set `VITE_AI_MODEL=gpt-3.5-turbo`
4. **Implement rate limiting**: Debounce AI calls
5. **Offer local fallbacks**: Basic text analysis when AI unavailable

---

## Production Considerations

### Security
⚠️ **Important**: Current implementation uses `dangerouslyAllowBrowser: true` for OpenAI client.

**For production**:
1. Move AI operations to backend API
2. Implement API key rotation
3. Add rate limiting per user
4. Use environment-specific keys

### Backend Proxy Example

```javascript
// Backend (Node.js/Express)
app.post('/api/ai/summarize', authenticateUser, async (req, res) => {
  const { dreamData } = req.body;
  
  try {
    const summary = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [/* ... */]
    });
    
    res.json({ summary: summary.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend
async function generateSummary(dream) {
  const response = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamData: dream })
  });
  return response.json();
}
```

---

## Troubleshooting

### AI Features Not Working
1. **Check API key**: Verify `VITE_OPENAI_API_KEY` in `.env.local`
2. **Restart dev server**: `npm run dev` after env changes
3. **Check browser console**: Look for API errors
4. **Verify API quota**: Check OpenAI dashboard

### Document Parsing Issues
- **DOCX not parsing**: Check mammoth installation
- **PDF not supported**: Use TXT/DOCX or implement backend PDF parser
- **File too large**: Max size is 10MB

### Slow Performance
- **Switch to GPT-3.5**: Faster and cheaper
- **Reduce content size**: Limit fragment content sent to API
- **Implement caching**: Store AI results in database

---

## Testing

See `AI_TEST_PLAN.md` for comprehensive testing procedures.

### Quick Test
1. Set `VITE_OPENAI_API_KEY` in `.env.local`
2. Restart dev server
3. Create a dream with some content
4. Click "Suggest Tags" - should see AI-generated tags
5. Click "Generate Summary" - should see summary
6. Upload a TXT file with tasks - should extract todos

---

## Future Enhancements

### Planned for v2.5
- [ ] Natural language todo creation ("remind me to deploy on Friday")
- [ ] Smart dependencies detection ("this task blocks that task")
- [ ] Automated progress updates from git commits
- [ ] Voice-to-todo using Whisper API
- [ ] Multi-language support

### Planned for v3.0
- [ ] Local AI models (Ollama integration)
- [ ] Custom fine-tuned models for project detection
- [ ] AI project assistant chat interface
- [ ] Predictive task scheduling

---

## Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **API Docs**: [OpenAI Documentation](https://platform.openai.com/docs)

