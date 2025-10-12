import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { parseDocumentFile, validateDocument, getFileMetadata } from '../lib/documentParser';
import { useAI } from './useAI';

/**
 * Custom hook for document management
 */
export function useDocuments() {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);
  const { parseDocumentContent } = useAI();

  /**
   * Upload and parse a document
   * @param {File} file - The file to upload
   * @param {string} dreamId - The dream ID to attach to
   * @param {string} userId - The user ID (for Supabase)
   * @returns {Promise<Object>} - Parsed document data
   */
  const uploadAndParseDocument = async (file, dreamId, userId = null) => {
    // Validate file
    const validation = validateDocument(file);
    if (!validation.valid) {
      setError(validation.error);
      throw new Error(validation.error);
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Extract text from document
      const text = await parseDocumentFile(file);
      
      // 2. Get file metadata
      const metadata = getFileMetadata(file);

      // 3. Upload to Supabase Storage (if configured)
      let fileUrl = null;
      if (supabase && userId) {
        try {
          const fileName = `${userId}/${dreamId}/${Date.now()}_${file.name}`;
          const { data, error: uploadError } = await supabase.storage
            .from('dream-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.warn('Storage upload failed, continuing with local:', uploadError);
          } else {
            fileUrl = data.path;
          }
        } catch (storageError) {
          console.warn('Storage not configured:', storageError);
        }
      }

      // 4. Parse document with AI
      setParsing(true);
      const parsed = await parseDocumentContent(text, file.name);

      // 5. Create document record
      const documentRecord = {
        dream_id: dreamId,
        title: file.name,
        file_path: fileUrl || `local/${file.name}`,
        file_type: metadata.extension,
        file_size: metadata.size,
        uploaded_at: new Date().toISOString(),
        parsed_todos: parsed.todos?.length || 0,
        parsed_deadlines: parsed.todos?.filter(t => t.deadline).length || 0,
        parsed_at: parsed.parsedAt,
        // Store parsed content for non-Supabase mode
        _localParsed: parsed
      };

      // 6. Save to Supabase (if configured)
      if (supabase && userId) {
        try {
          const { data, error: dbError } = await supabase
            .from('documents')
            .insert([documentRecord])
            .select();

          if (dbError) {
            console.warn('Database insert failed:', dbError);
          } else {
            documentRecord.id = data[0].id;
          }
        } catch (dbError) {
          console.warn('Database not configured:', dbError);
        }
      } else {
        // Generate local ID
        documentRecord.id = `local-${Date.now()}`;
      }

      return {
        document: documentRecord,
        parsed: parsed,
        text: text // Include raw text for reference
      };
    } catch (err) {
      console.error('Error uploading/parsing document:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  /**
   * Delete a document
   */
  const deleteDocument = async (documentId, filePath, userId = null) => {
    setError(null);

    try {
      // Delete from Supabase Storage (if configured)
      if (supabase && userId && !filePath.startsWith('local/')) {
        try {
          await supabase.storage
            .from('dream-documents')
            .remove([filePath]);
        } catch (storageError) {
          console.warn('Storage deletion failed:', storageError);
        }
      }

      // Delete from database (if configured)
      if (supabase && userId) {
        try {
          await supabase
            .from('documents')
            .delete()
            .eq('id', documentId);
        } catch (dbError) {
          console.warn('Database deletion failed:', dbError);
        }
      }

      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    uploading,
    parsing,
    error,
    uploadAndParseDocument,
    deleteDocument
  };
}

