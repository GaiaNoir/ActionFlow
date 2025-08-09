# File Upload Functionality Documentation

## Overview
The Meeting Action Items app now includes comprehensive file upload functionality for processing audio recordings. This document outlines the implementation details and usage.

## Features

### 1. FileUpload Component (`src/components/FileUpload.tsx`)
A reusable React component that provides:

- **Drag-and-drop functionality**: Users can drag audio files directly onto the upload area
- **Click-to-browse**: Alternative file selection via file browser
- **File validation**: Automatic validation of file type and size
- **Visual feedback**: Different states for drag-over, success, and error conditions
- **File information display**: Shows selected file name and size
- **Clear file option**: Allows users to remove selected files

### 2. Supported File Types
- **Audio formats**: MP3, MP4, WAV, M4A
- **Video formats**: MOV (for audio extraction)
- **File size limit**: 100MB maximum

### 3. File Validation (`src/utils/fileValidation.ts`)
Comprehensive validation including:
- File size checking (100MB limit)
- MIME type validation
- File extension validation (fallback)
- User-friendly error messages

### 4. TypeScript Types (`src/types/file.ts`)
Proper TypeScript definitions for:
- File upload state management
- Validation results
- Supported file types and extensions

## Usage

### Basic Implementation
```tsx
import FileUpload from '@/components/FileUpload';

function MyComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <FileUpload 
      onFileSelect={setSelectedFile}
      className="my-custom-class"
    />
  );
}
```

### With Custom Hook
```tsx
import { useFileUpload } from '@/hooks/useFileUpload';

function MyComponent() {
  const { uploadState, handleFileSelect, clearFile } = useFileUpload();

  return (
    <FileUpload onFileSelect={handleFileSelect} />
  );
}
```

## Component States

### 1. Default State
- Shows upload area with drag-and-drop instructions
- Displays supported file formats
- Neutral styling

### 2. Drag Over State
- Blue border and background
- "Drop your file here" message
- Visual feedback for active drag operation

### 3. Success State
- Green border and background
- File name and size display
- Success checkmark icon
- Option to clear file

### 4. Error State
- Red border and background
- Error message display
- Option to try again

## File Processing Flow

1. **File Selection**: User drags/drops or selects file
2. **Validation**: File type and size validation
3. **State Update**: Component state reflects validation result
4. **User Feedback**: Visual feedback based on validation
5. **Processing**: File ready for processing when valid

## Error Handling

The system provides comprehensive error handling for:
- Invalid file types
- Files exceeding size limit
- Network errors during processing
- General processing failures

## Accessibility Features

- Keyboard navigation support
- Screen reader friendly
- Clear visual indicators
- Descriptive error messages

## Performance Considerations

- File validation happens client-side for immediate feedback
- Large file handling with progress indicators
- Efficient state management to prevent unnecessary re-renders

## Future Enhancements

Potential improvements could include:
- Multiple file upload support
- Upload progress indicators
- File preview functionality
- Batch processing capabilities
- Cloud storage integration

## Dependencies

The file upload functionality uses:
- React hooks for state management
- TypeScript for type safety
- Tailwind CSS for styling
- Native HTML5 drag-and-drop API