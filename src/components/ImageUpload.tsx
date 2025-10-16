'use client';

import { useState, useCallback } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
}

export default function ImageUpload({ onImageSelect, previewUrl }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return 'Please upload a PNG or JPG image';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'Image must be under 5MB';
    }

    return null;
  };

  const handleFile = useCallback((file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(file, result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleClear = useCallback(() => {
    onImageSelect(null!, null!);
    setError(null);
  }, [onImageSelect]);

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-3 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
            transition-all duration-300 group
            ${isDragging
              ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
          />
          <div className="space-y-4">
            {/* Upload Icon */}
            <div className="flex justify-center">
              <div className={`
                p-4 rounded-full transition-all duration-300
                ${isDragging
                  ? 'bg-indigo-100 scale-110'
                  : 'bg-gray-100 group-hover:bg-indigo-50 group-hover:scale-110'
                }
              `}>
                <svg
                  className={`w-12 h-12 transition-colors duration-300 ${
                    isDragging ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                {isDragging ? '📥 Drop your image here' : '📤 Upload your image'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
            </div>

            {/* Requirements */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-600 border border-gray-200">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                PNG or JPG
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-600 border border-gray-200">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Max 5MB
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group animate-fade-in">
          {/* Image Preview */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-2 ring-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain bg-gray-50"
            />
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={handleClear}
                className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 px-6 py-3 bg-white hover:bg-red-500 text-gray-800 hover:text-white rounded-xl font-semibold shadow-2xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Image
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg px-4 py-2 shadow-md">
            <span className="font-medium">✅ Image uploaded successfully</span>
            <button
              onClick={handleClear}
              className="text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
