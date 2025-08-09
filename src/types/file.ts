export interface FileUploadState {
  file: File | null;
  error: string | null;
  isValid: boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/m4a',
  'video/mp4',
  'video/quicktime'
] as const;

export const SUPPORTED_EXTENSIONS = [
  '.mp3',
  '.mp4',
  '.wav',
  '.m4a',
  '.mov'
] as const;

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

export type SupportedAudioType = typeof SUPPORTED_AUDIO_TYPES[number];
export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number];