import React, { useState, useRef } from 'react'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useDocuments } from '../hooks/useDocuments'
import { useAuth } from '../hooks/useAuth'

export default function DocumentUpload({ dreamId, onDocumentParsed }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null) // null, 'uploading', 'parsing', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef(null)
  const { uploadAndParseDocument, uploading, parsing, error: _error } = useDocuments()
  const { user } = useAuth()

  const handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = e => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async file => {
    setUploadStatus('uploading')
    setStatusMessage(`Uploading ${file.name}...`)

    try {
      const result = await uploadAndParseDocument(file, dreamId, user?.id)

      setUploadStatus('success')
      setStatusMessage(
        `Successfully parsed ${file.name} - found ${result.parsed.todos?.length || 0} tasks`
      )

      // Notify parent component
      if (onDocumentParsed) {
        onDocumentParsed(result)
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus(null)
        setStatusMessage('')
      }, 3000)
    } catch (err) {
      setUploadStatus('error')
      setStatusMessage(err.message)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Upload Document
      </h3>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'
        } ${uploadStatus === 'uploading' || uploadStatus === 'parsing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={uploadStatus === 'uploading' || uploadStatus === 'parsing' ? null : onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.md,.docx,.pdf"
          onChange={handleChange}
          disabled={uploading || parsing}
        />

        {!uploadStatus && (
          <>
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">Drop a document here or click to browse</p>
            <p className="text-sm text-gray-500">Supports: TXT, MD, DOCX, PDF (max 10MB)</p>
          </>
        )}

        {uploadStatus === 'uploading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300">{statusMessage}</p>
          </div>
        )}

        {uploadStatus === 'parsing' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-300">Parsing document with AI...</p>
            <p className="text-sm text-gray-500 mt-2">Extracting tasks and deadlines</p>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-gray-300">{statusMessage}</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-300 mb-2">Upload failed</p>
            <p className="text-sm text-red-400">{statusMessage}</p>
            <button
              onClick={e => {
                e.stopPropagation()
                setUploadStatus(null)
                setStatusMessage('')
              }}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p className="flex items-center mb-2">
          <span className="font-semibold mr-2">AI will extract:</span>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Tasks and TODO items</li>
          <li>Deadlines and dates</li>
          <li>Task categories (coding, admin, design, etc.)</li>
          <li>Document summary and key points</li>
        </ul>
      </div>
    </div>
  )
}
