import { useState } from 'react';
import {
  isAIAvailable,
  generateDreamSummary,
  extractFragmentHighlights,
  suggestTags,
  detectProjectNames,
  parseDocument,
  semanticSearch
} from '../lib/ai';

/**
 * Custom hook for AI operations
 */
export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const aiAvailable = isAIAvailable();

  const generateSummary = async (dream) => {
    if (!aiAvailable) {
      setError('AI features not available. Set VITE_OPENAI_API_KEY in .env.local');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const summary = await generateDreamSummary(dream);
      return summary;
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFragmentHighlights = async (fragment) => {
    if (!aiAvailable) return [];

    setLoading(true);
    setError(null);
    try {
      const highlights = await extractFragmentHighlights(fragment);
      return highlights;
    } catch (err) {
      console.error('Error extracting highlights:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTagSuggestions = async (dream) => {
    if (!aiAvailable) return [];

    setLoading(true);
    setError(null);
    try {
      const tags = await suggestTags(dream);
      return tags;
    } catch (err) {
      console.error('Error suggesting tags:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const detectProjects = async (content) => {
    if (!aiAvailable) return [];

    setLoading(true);
    setError(null);
    try {
      const projects = await detectProjectNames(content);
      return projects;
    } catch (err) {
      console.error('Error detecting projects:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const parseDocumentContent = async (text, fileName) => {
    if (!aiAvailable) {
      throw new Error('AI features not available');
    }

    setLoading(true);
    setError(null);
    try {
      const parsed = await parseDocument(text, fileName);
      return parsed;
    } catch (err) {
      console.error('Error parsing document:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const performSemanticSearch = async (query, dreams) => {
    setLoading(true);
    setError(null);
    try {
      const results = await semanticSearch(query, dreams);
      return results;
    } catch (err) {
      console.error('Error in semantic search:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    aiAvailable,
    loading,
    error,
    generateSummary,
    getFragmentHighlights,
    getTagSuggestions,
    detectProjects,
    parseDocumentContent,
    performSemanticSearch
  };
}

