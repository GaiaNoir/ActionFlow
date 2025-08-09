'use client';

import { useState, useRef, useCallback } from 'react';
import { validateFile, formatFileSize } from '@/utils/fileValidation';
import { FileUploadState } from '@/types/file';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  disabled?: boolean;
  className?: string;
}

export default function FileUpload({ onFileSelect, selectedFile, disabled = false, className = '' }: FileUploadProps) {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: selectedFile || null,
    error: null,
    isValid: !!selectedFile
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileValidation = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (validation.isValid) {
      const newState: FileUploadState = {
        file,
        error: null,
        isValid: true
      };
      setUploadState(newState);
      onFileSelect(file);
    } else {
      const newState: FileUploadState = {
        file: null,
        error: validation.error || 'Invalid file',
        isValid: false
      };
      setUploadState(newState);
      onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!disabled) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileValidation(files[0]);
      }
    }
  }, [handleFileValidation, disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileValidation(files[0]);
      }
    }
  }, [handleFileValidation, disabled]);

  const handleClearFile = useCallback(() => {
    setUploadState({
      file: null,
      error: null,
      isValid: false
    });
    onFileSelect(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const getDropzoneStyles = () => {
    if (uploadState.error) {
      return 'border-red-300 bg-red-50 hover:border-red-400';
    }
    if (uploadState.isValid && uploadState.file) {
      return 'border-green-300 bg-green-50 hover:border-green-400';
    }
    if (isDragOver) {
      return 'border-blue-500 bg-blue-50';
    }
    return 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Upload Audio Recording</h3>
        {uploadState.file && (
          <button
            onClick={handleClearFile}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Clear file
          </button>
        )}
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${getDropzoneStyles()}`}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
        onClick={disabled ? undefined : handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.mp4,.wav,.m4a,.mov"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-3">
          {uploadState.error ? (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">Upload Error</p>
              <p className="text-sm text-red-600">{uploadState.error}</p>
              <p className="text-xs text-slate-500 mt-2">Click to try again</p>
            </>
          ) : uploadState.isValid && uploadState.file ? (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-green-700 font-medium truncate max-w-xs mx-auto">
                  {uploadState.file.name}
                </p>
                <p className="text-sm text-green-600">
                  {formatFileSize(uploadState.file.size)} • Ready to process
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-2">Click to select a different file</p>
            </>
          ) : (
            <>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                isDragOver ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                <svg className={`w-6 h-6 ${isDragOver ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className={`font-medium ${isDragOver ? 'text-blue-700' : 'text-slate-700'}`}>
                  {isDragOver ? 'Drop your file here' : 'Drop audio file here or click to browse'}
                </p>
                <p className="text-sm text-slate-500">
                  Supports MP3, MP4, WAV, M4A, MOV • Max 100MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File info display */}
      {uploadState.file && uploadState.isValid && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 truncate max-w-xs">
                  {uploadState.file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(uploadState.file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearFile}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}