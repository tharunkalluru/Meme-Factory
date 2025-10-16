'use client';

import { useState, useCallback } from 'react';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

const PRESET_TOPICS = [
  { text: 'Monday mornings', emoji: '☕' },
  { text: 'When the WiFi drops', emoji: '📶' },
  { text: 'Debugging at 3am', emoji: '🐛' },
  { text: 'Code works first try', emoji: '🎉' },
  { text: 'Client changes mind', emoji: '🔄' },
  { text: 'Meeting that could be an email', emoji: '📧' },
];

export default function TopicInput({ value, onChange, maxLength }: TopicInputProps) {
  const [showPresets, setShowPresets] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  }, [onChange, maxLength]);

  const handlePresetClick = useCallback((preset: string) => {
    onChange(preset);
    setShowPresets(false);
  }, [onChange]);

  const remaining = maxLength - value.length;
  const isNearLimit = remaining < 20;
  const progress = (value.length / maxLength) * 100;

  return (
    <div className="w-full space-y-3">
      {/* Input Container */}
      <div className="relative">
        <div className={`
          relative rounded-xl border-2 transition-all duration-300
          ${isFocused
            ? 'border-purple-500 shadow-lg shadow-purple-100'
            : value ? 'border-green-300 shadow-md' : 'border-gray-300 shadow-sm'
          }
        `}>
          {/* Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>

          <input
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g., 'Monday mornings' or 'When code works first try'"
            className="w-full pl-14 pr-32 py-4 bg-transparent rounded-xl
                     focus:outline-none text-lg font-medium text-gray-800
                     placeholder:text-gray-400"
            maxLength={maxLength}
          />

          {/* Right Section */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Character Count */}
            <span
              className={`text-sm font-bold px-2.5 py-1 rounded-lg transition-colors ${
                isNearLimit
                  ? 'text-orange-600 bg-orange-50'
                  : value.length > 0
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-400 bg-gray-100'
              }`}
            >
              {remaining}
            </span>

            {/* Ideas Button */}
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showPresets
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
              aria-label="Show preset topics"
              title="Get topic ideas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {value.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-xl overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isNearLimit ? 'bg-orange-400' : 'bg-gradient-to-r from-green-400 to-green-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Preset Topics Dropdown */}
      {showPresets && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">💡 Try these popular topics:</p>
            <button
              onClick={() => setShowPresets(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_TOPICS.map((preset) => (
              <button
                key={preset.text}
                onClick={() => handlePresetClick(preset.text)}
                className="flex items-center gap-2 px-4 py-3 text-left rounded-lg
                         hover:bg-purple-50 hover:border-purple-200
                         transition-all duration-200 border border-gray-200
                         group text-sm font-medium text-gray-700"
              >
                <span className="text-xl group-hover:scale-125 transition-transform duration-200">
                  {preset.emoji}
                </span>
                <span className="group-hover:text-purple-600 transition-colors">
                  {preset.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!value && (
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Describe a relatable situation or feeling for your meme
        </p>
      )}

      {isNearLimit && (
        <p className="text-sm text-orange-600 font-medium flex items-center gap-2 animate-pulse">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          You&apos;re close to the character limit!
        </p>
      )}
    </div>
  );
}
