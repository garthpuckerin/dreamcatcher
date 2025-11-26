/**
 * Document Parser Utilities
 * Handles different file types and extracts text content
 */

import mammoth from 'mammoth'

/**
 * Parse different document types and extract text
 * @param {File} file - The file object to parse
 * @returns {Promise<string>} - Extracted text content
 */
export async function parseDocumentFile(file) {
  const fileType = file.name.split('.').pop().toLowerCase()

  switch (fileType) {
    case 'txt':
    case 'md':
      return parseTextFile(file)

    case 'docx':
      return parseDocxFile(file)

    case 'pdf':
      return parsePdfFile(file)

    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}

/**
 * Parse text/markdown files
 */
async function parseTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      resolve(e.target.result)
    }

    reader.onerror = () => {
      reject(new Error('Failed to read text file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Parse DOCX files using mammoth
 */
async function parseDocxFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })

    if (result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages)
    }

    return result.value
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error.message}`)
  }
}

/**
 * Parse PDF files
 * Note: pdf-parse doesn't work in browser, so we'll use a simplified approach
 * In production, this should be handled by a backend service
 */
async function parsePdfFile(_file) {
  // For now, we'll return an error message
  // In production, implement backend PDF parsing
  throw new Error('PDF parsing requires backend service. Please convert to TXT or DOCX format.')
}

/**
 * Validate file before parsing
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export function validateDocument(file) {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['txt', 'md', 'docx', 'pdf']
  const fileType = file.name.split('.').pop().toLowerCase()

  if (!allowedTypes.includes(fileType)) {
    return {
      valid: false,
      error: `Unsupported file type. Allowed: ${allowedTypes.join(', ')}`,
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: 10MB`,
    }
  }

  return { valid: true }
}

/**
 * Get file metadata
 */
export function getFileMetadata(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension: file.name.split('.').pop().toLowerCase(),
    lastModified: new Date(file.lastModified).toISOString(),
  }
}
