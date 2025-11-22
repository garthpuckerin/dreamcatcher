import React, { useState } from 'react'
import { Sparkles, Loader2, Tag, FileText, Lightbulb } from 'lucide-react'
import { useAI } from '../hooks/useAI'

/**
 * AI Assistant component for smart suggestions
 */
export default function AIAssistant({ dream, onSuggestionsApplied, type = 'tags' }) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { aiAvailable, getTagSuggestions, generateSummary, error } = useAI()

  const handleGetSuggestions = async () => {
    setLoading(true)
    setShowSuggestions(true)

    try {
      if (type === 'tags') {
        const tags = await getTagSuggestions(dream)
        setSuggestions(tags)
      } else if (type === 'summary') {
        const summary = await generateSummary(dream)
        setSuggestions([summary])
      }
    } catch (err) {
      console.error('Error getting suggestions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestions = () => {
    if (onSuggestionsApplied) {
      onSuggestionsApplied(suggestions)
    }
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleApplySingle = suggestion => {
    if (onSuggestionsApplied) {
      onSuggestionsApplied([suggestion])
    }
  }

  if (!aiAvailable) {
    return (
      <div className="text-sm text-gray-500 italic flex items-center">
        <Sparkles className="w-4 h-4 mr-1" />
        AI suggestions unavailable (set VITE_OPENAI_API_KEY)
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleGetSuggestions}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-md text-sm transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>
              {type === 'tags' && 'Suggest Tags'}
              {type === 'summary' && 'Generate Summary'}
            </span>
          </>
        )}
      </button>

      {error && (
        <div className="text-sm text-red-400 flex items-center">
          <span>{error}</span>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center">
              {type === 'tags' && (
                <>
                  <Tag className="w-4 h-4 mr-1" />
                  Suggested Tags
                </>
              )}
              {type === 'summary' && (
                <>
                  <FileText className="w-4 h-4 mr-1" />
                  Generated Summary
                </>
              )}
            </h4>
          </div>

          {type === 'tags' && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplySingle(tag)}
                  className="px-3 py-1 bg-gray-600 hover:bg-blue-600 text-sm text-gray-200 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {type === 'summary' && (
            <div className="bg-gray-800 rounded-md p-3">
              <p className="text-gray-300 text-sm">{suggestions[0]}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleApplySuggestions}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              {type === 'tags' ? 'Add All Tags' : 'Use This Summary'}
            </button>
            <button
              onClick={() => {
                setShowSuggestions(false)
                setSuggestions([])
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
