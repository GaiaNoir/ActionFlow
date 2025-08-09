import { 
  SUPPORTED_AUDIO_TYPES, 
  SUPPORTED_EXTENSIONS, 
  MAX_FILE_SIZE,
  FileValidationResult 
} from '@/types/file';

export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB. Current size: ${Math.round(file.size / (1024 * 1024))}MB`
    };
  }

  // Check file type
  const isValidType = SUPPORTED_AUDIO_TYPES.includes(file.type as any);
  
  // Check file extension as fallback
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidExtension = SUPPORTED_EXTENSIONS.includes(fileExtension as any);

  if (!isValidType && !isValidExtension) {
    return {
      isValid: false,
      error: `Unsupported file type. Please upload: ${SUPPORTED_EXTENSIONS.join(', ')}`
    };
  }

  return { isValid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}