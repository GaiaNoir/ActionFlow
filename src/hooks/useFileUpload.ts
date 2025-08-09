'use client';

import { useState, useCallback } from 'react';
import { validateFile } from '@/utils/fileValidation';
import { FileUploadState } from '@/types/file';

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    error: null,
    isValid: false
  });

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setUploadState({
        file: null,
        error: null,
        isValid: false
      });
      return;
    }

    const validation = validateFile(file);
    
    if (validation.isValid) {
      setUploadState({
        file,
        error: null,
        isValid: true
      });
    } else {
      setUploadState({
        file: null,
        error: validation.error || 'Invalid file',
        isValid: false
      });
    }
  }, []);

  const clearFile = useCallback(() => {
    setUploadState({
      file: null,
      error: null,
      isValid: false
    });
  }, []);

  return {
    uploadState,
    handleFileSelect,
    clearFile
  };
}