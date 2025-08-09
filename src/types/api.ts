export interface ProcessingResult {
  success: boolean;
  data?: {
    summary: string;
    actionItems: string[];
    decisions: string[];
    followUps: string[];
    nextSteps: string[];
  };
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  type: 'file_too_large' | 'unsupported_format' | 'api_error' | 'network_error' | 'unknown';
}
