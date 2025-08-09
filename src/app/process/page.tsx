'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import Results from '@/components/Results';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import { ProcessingResult, ApiError } from '@/types/api';

interface ProcessingState {
  isProcessing: boolean;
  results: ProcessingResult['data'] | null;
  error: ApiError | null;
  uploadProgress?: number;
}

export default function ProcessPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [meetingNotes, setMeetingNotes] = useState('');
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    results: null,
    error: null
  });

  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    // Clear any previous results when file changes
    if (processingState.results || processingState.error) {
      setProcessingState(prev => ({ ...prev, results: null, error: null }));
    }
  }, [processingState.results, processingState.error]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMeetingNotes(e.target.value);
    // Clear any previous results when notes change
    if (processingState.results || processingState.error) {
      setProcessingState(prev => ({ ...prev, results: null, error: null }));
    }
  }, [processingState.results, processingState.error]);

  const handleProcessMeeting = useCallback(async () => {
    if (!selectedFile && !meetingNotes.trim()) return;

    setProcessingState({
      isProcessing: true,
      results: null,
      error: null,
      uploadProgress: selectedFile ? 0 : undefined
    });

    try {
      const formData = new FormData();
      
      if (selectedFile) {
        // Validate file size (100MB limit)
        if (selectedFile.size > 100 * 1024 * 1024) {
          throw new Error('FILE_TOO_LARGE');
        }
        
        // Validate file format
        const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'video/mp4'];
        const allowedExtensions = ['.mp3', '.mp4', '.wav', '.m4a'];
        const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
        
        if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
          throw new Error('UNSUPPORTED_FORMAT');
        }
        
        formData.append('audio', selectedFile);
        
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setProcessingState(prev => ({ ...prev, uploadProgress: i }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else {
        formData.append('text', meetingNotes.trim());
      }

      const response = await fetch('/api/process-meeting', {
        method: 'POST',
        body: selectedFile ? formData : JSON.stringify({ text: meetingNotes.trim() }),
        headers: selectedFile ? {} : { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('API_ERROR');
        } else if (response.status === 413) {
          throw new Error('FILE_TOO_LARGE');
        } else {
          throw new Error('API_ERROR');
        }
      }

      const result: ProcessingResult = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('API_ERROR');
      }

      setProcessingState({
        isProcessing: false,
        results: result.data,
        error: null
      });
    } catch (error) {
      let apiError: ApiError;
      
      if (error instanceof Error) {
        switch (error.message) {
          case 'FILE_TOO_LARGE':
            apiError = { message: error.message, type: 'file_too_large' };
            break;
          case 'UNSUPPORTED_FORMAT':
            apiError = { message: error.message, type: 'unsupported_format' };
            break;
          case 'API_ERROR':
            apiError = { message: error.message, type: 'api_error' };
            break;
          default:
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
              apiError = { message: 'Network error', type: 'network_error' };
            } else {
              apiError = { message: error.message, type: 'unknown' };
            }
        }
      } else {
        apiError = { message: 'An unexpected error occurred', type: 'unknown' };
      }
      
      setProcessingState({
        isProcessing: false,
        results: null,
        error: apiError
      });
    }
  }, [selectedFile, meetingNotes]);

  const isProcessButtonEnabled = (selectedFile || meetingNotes.trim().length > 0) && !processingState.isProcessing;

  const handleRetry = useCallback(() => {
    handleProcessMeeting();
  }, [handleProcessMeeting]);

  const handleClearError = useCallback(() => {
    setProcessingState(prev => ({ ...prev, error: null }));
  }, []);

  const handleProcessAnother = useCallback(() => {
    setSelectedFile(null);
    setMeetingNotes('');
    setProcessingState({
      isProcessing: false,
      results: null,
      error: null
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">ActionFlow</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Process Your Meeting</h1>
          <p className="text-lg text-slate-600">Upload an audio file or paste your meeting notes to get started</p>
        </div>

        {/* Input Sections */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              disabled={processingState.isProcessing}
            />

            {/* Text Input Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Or Paste Meeting Notes</h3>
              <textarea
                value={meetingNotes}
                onChange={handleNotesChange}
                placeholder="Paste your meeting notes, transcript, or key discussion points here..."
                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder-slate-400"
                disabled={processingState.isProcessing}
              />
              <p className="text-sm text-slate-500">
                {meetingNotes.length > 0 ? `${meetingNotes.length} characters` : 'Enter your meeting transcript or notes'}
              </p>
            </div>
          </div>

          {/* Process Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleProcessMeeting}
              disabled={!isProcessButtonEnabled}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                isProcessButtonEnabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {processingState.isProcessing ? (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Process Meeting</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {processingState.isProcessing && (
            <Loading 
              uploadProgress={processingState.uploadProgress}
              hasFile={!!selectedFile}
            />
          )}
          
          {processingState.error && (
            <ErrorDisplay 
              error={processingState.error}
              onRetry={handleRetry}
              onClear={handleClearError}
            />
          )}
          
          {processingState.results && (
            <Results 
              results={processingState.results}
              onProcessAnother={handleProcessAnother}
            />
          )}
          
          {!processingState.isProcessing && !processingState.error && !processingState.results && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Process</h3>
              <p className="text-slate-600">Upload an audio file or paste your meeting notes above to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
