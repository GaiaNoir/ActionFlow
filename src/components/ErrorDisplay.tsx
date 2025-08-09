'use client';

import { ApiError } from '@/types/api';

interface ErrorDisplayProps {
  error: ApiError;
  onRetry: () => void;
  onClear: () => void;
}

export default function ErrorDisplay({ error, onRetry, onClear }: ErrorDisplayProps) {
  const getErrorMessage = (error: ApiError): string => {
    switch (error.type) {
      case 'file_too_large':
        return 'File must be under 100MB. Please try a smaller file.';
      case 'unsupported_format':
        return 'Please upload MP3, MP4, WAV, or M4A files.';
      case 'api_error':
        return 'Processing failed. Please try again in a moment.';
      case 'network_error':
        return 'Connection issue. Check your internet and retry.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const getErrorIcon = (type: ApiError['type']) => {
    switch (type) {
      case 'file_too_large':
      case 'unsupported_format':
        return (
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'network_error':
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const canRetry = error.type === 'api_error' || error.type === 'network_error';

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {getErrorIcon(error.type)}
      </div>
      <p className="text-red-700 text-lg font-medium mb-2">Processing Error</p>
      <p className="text-red-600 text-sm mb-6 max-w-md mx-auto">
        {getErrorMessage(error)}
      </p>
      
      <div className="flex justify-center space-x-3">
        {canRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Retry</span>
          </button>
        )}
        
        <button
          onClick={onClear}
          className="px-4 py-2 text-slate-600 hover:text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
