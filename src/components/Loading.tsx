'use client';

import { useState, useEffect } from 'react';

interface LoadingProps {
  type: 'processing' | 'uploading' | 'transcribing' | 'analyzing';
  progress?: number;
}

const PROCESSING_STAGES = [
  { key: 'uploading', label: 'Uploading file...', duration: 2000, icon: 'upload' },
  { key: 'transcribing', label: 'Transcribing audio...', duration: 15000, icon: 'microphone' },
  { key: 'analyzing', label: 'Analyzing content...', duration: 8000, icon: 'brain' },
  { key: 'generating', label: 'Generating results...', duration: 5000, icon: 'document' }
];

export default function Loading({ type, progress }: LoadingProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(30);

  useEffect(() => {
    if (type === 'processing') {
      const timer = setInterval(() => {
        setStageProgress(prev => {
          if (prev >= 100) {
            if (currentStage < PROCESSING_STAGES.length - 1) {
              setCurrentStage(curr => curr + 1);
              return 0;
            }
            return 100;
          }
          return prev + (100 / (PROCESSING_STAGES[currentStage].duration / 500));
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [type, currentStage]);

  useEffect(() => {
    if (type === 'processing') {
      const totalRemaining = PROCESSING_STAGES
        .slice(currentStage)
        .reduce((acc, stage, index) => {
          if (index === 0) {
            return acc + (stage.duration * (100 - stageProgress) / 100);
          }
          return acc + stage.duration;
        }, 0);
      
      setEstimatedTimeRemaining(Math.ceil(totalRemaining / 1000));
    }
  }, [currentStage, stageProgress, type]);

  const getStageIcon = (iconType: string, isActive: boolean) => {
    const className = `w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`;
    
    switch (iconType) {
      case 'upload':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case 'microphone':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'brain':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'document':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (type === 'uploading' && progress !== undefined) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-slate-700 text-lg font-medium mb-4">Uploading file...</p>
        <div className="max-w-xs mx-auto">
          <div className="bg-slate-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-2">{progress}% complete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      {/* Main Processing Icon */}
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          {PROCESSING_STAGES.map((stage, index) => (
            <div key={stage.key} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                index <= currentStage 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-200 text-slate-400'
              }`}>
                {getStageIcon(stage.icon, index <= currentStage)}
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                index === currentStage ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {stage.key.charAt(0).toUpperCase() + stage.key.slice(1)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="bg-slate-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${((currentStage * 100) + stageProgress) / PROCESSING_STAGES.length}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <p className="text-slate-700 text-lg font-medium mb-2">
        {PROCESSING_STAGES[currentStage]?.label || 'Processing your meeting...'}
      </p>
      <p className="text-slate-500 text-sm mb-6">
        Estimated time remaining: {estimatedTimeRemaining}s
      </p>
      
      {/* Enhanced Skeleton Loaders */}
      <div className="mt-8 space-y-6 max-w-3xl mx-auto">
        {/* Summary Skeleton */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-200 rounded-lg"></div>
            <div className="h-5 bg-blue-200 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-blue-200 rounded w-full"></div>
            <div className="h-4 bg-blue-200 rounded w-4/5"></div>
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Action Items Skeleton */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-yellow-200 rounded-lg"></div>
            <div className="h-5 bg-yellow-200 rounded w-28"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-200 rounded-full mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-yellow-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-yellow-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions Skeleton */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-200 rounded-lg"></div>
            <div className="h-5 bg-green-200 rounded w-36"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-green-200 rounded w-full"></div>
            <div className="h-4 bg-green-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
