'use client';

import { useState, useCallback, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';
import TopicInput from '@/components/TopicInput';
import MemeGrid from '@/components/MemeGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Meme, GenerateResponse, ErrorResponse } from '@/types/meme';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleImageSelect = useCallback((file: File | null, preview: string | null) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
    setMemes([]);
    setCollageUrl(null);
    setError(null);
    setGenerationTime(null);
  }, []);

  const handleTopicChange = useCallback((value: string) => {
    setTopic(value);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedFile || !topic.trim()) {
      setError('Please upload an image and enter a topic');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setMemes([]);
    setCollageUrl(null);
    setGenerationTime(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          topic: topic.trim(),
        }),
      });

      const data: GenerateResponse | ErrorResponse = await response.json();

      if (!data.success) {
        setError(data.error.message);
        return;
      }

      setMemes(data.memes);
      setCollageUrl(data.collageUrl);
      setGenerationTime(data.generationTime);
      setShowSuccess(true);
      
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Generation error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedFile, topic]);

  const handleGenerateMore = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleStartOver = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTopic('');
    setMemes([]);
    setCollageUrl(null);
    setError(null);
    setGenerationTime(null);
    setShowSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const canGenerate = selectedFile && topic.trim().length > 0 && !isGenerating;
  const progress = [selectedFile, topic.trim()].filter(Boolean).length;

    return (
      <main className="relative min-h-screen overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="glass-premium px-6 py-4 rounded-2xl shadow-glow-success flex items-center gap-3 backdrop-blur-xl border-2 border-green-400/20">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center animate-scale-in">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-800">Memes Generated!</p>
                <p className="text-sm text-gray-600">Completed in {(generationTime! / 1000).toFixed(1)}s ⚡</p>
              </div>
            </div>
          </div>
        )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          {/* Floating Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-2xl animate-pulse-slow" />
            <div className="relative text-7xl sm:text-8xl animate-float">
              <div className="relative">
                🎨
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Title with Gradient Animation */}
          <h1 className="relative text-5xl sm:text-7xl font-black mb-4">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Meme Factory
              </span>
              <span className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meme Factory
              </span>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-medium">
            Transform any image into three hilarious AI-powered memes in seconds
          </p>
          
          {/* Enhanced Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { icon: '⚡', label: '10-sec Generation', color: 'from-yellow-400 to-orange-500' },
              { icon: '🤖', label: 'AI-Powered', color: 'from-blue-400 to-indigo-500' },
              { icon: '🎭', label: '3 Unique Tones', color: 'from-purple-400 to-pink-500' }
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-full opacity-0 group-hover:opacity-100 blur transition duration-300`} />
                <span className="relative inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-semibold text-gray-700 border border-gray-100 group-hover:scale-105 group-hover:-translate-y-0.5">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tone Preview */}
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="text-xl">😏</span> Sarcastic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-xl">🥰</span> Wholesome
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-xl">😈</span> Dark Humor
            </span>
          </div>
        </div>

        {/* Main Content */}
        {memes.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {progress === 0 && 'Get started'}
                  {progress === 1 && 'Almost there!'}
                  {progress === 2 && 'Ready to generate! 🎉'}
                </span>
                <span className="text-sm font-medium text-indigo-600">{progress}/2</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${(progress / 2) * 100}%` }}
                />
              </div>
            </div>

            {/* Input Card */}
            <div className="group relative animate-fade-in">
              {/* Glow Effect on Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500" />
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-6 sm:p-8 space-y-8 border border-white/20">
              {/* Step 1: Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold">
                      1
                    </span>
                    Upload Your Image
                  </label>
                  {selectedFile && (
                    <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Done
                    </span>
                  )}
                </div>
                <ImageUpload onImageSelect={handleImageSelect} previewUrl={previewUrl} />
              </div>

              {/* Step 2: Topic */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                      2
                    </span>
                    Enter Your Topic
                  </label>
                  {topic.trim() && (
                    <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Done
                    </span>
                  )}
                </div>
                <TopicInput value={topic} onChange={handleTopicChange} maxLength={120} />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-red-800">Oops!</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`
                  group relative w-full px-8 py-5 rounded-2xl font-bold text-lg
                  transition-all duration-300 shadow-xl
                  flex items-center justify-center gap-3 overflow-hidden
                  ${canGenerate
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span className={`absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 ${canGenerate ? 'group-hover:opacity-100' : ''}`} />
                <span className="relative flex items-center gap-3">
                  <svg className={`w-6 h-6 ${canGenerate ? 'group-hover:rotate-180' : ''} transition-transform duration-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {canGenerate ? 'Generate Memes ✨' : 'Complete steps above'}
                </span>
              </button>

              {/* Help Text */}
              {!canGenerate && (
                <p className="text-center text-sm text-gray-500">
                  {!selectedFile && !topic.trim() && '👆 Start by uploading an image and entering a topic'}
                  {!selectedFile && topic.trim() && '🖼️ Upload an image to continue'}
                  {selectedFile && !topic.trim() && '💭 Enter a topic to continue'}
                </p>
              )}
              </div>
            </div>

            {/* Loading State */}
            {isGenerating && (
              <div className="mt-8">
                <LoadingSpinner />
              </div>
            )}

            {/* Example Section */}
            {!isGenerating && (
              <div className="mt-12 text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">💡 Try these popular topics:</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Monday mornings', 'When WiFi drops', 'Debugging at 3am', 'Code works first try', 'Client changes mind'].map((example) => (
                    <button
                      key={example}
                      onClick={() => setTopic(example)}
                      className="px-4 py-2 bg-white hover:bg-indigo-50 text-gray-700 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-indigo-300"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-lg">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <span className="text-4xl">🎉</span>
                  Your Memes Are Ready!
                </h2>
                <p className="text-gray-600">
                  Topic: <span className="font-semibold text-indigo-600">&quot;{topic}&quot;</span>
                  {generationTime && (
                    <span className="ml-3 text-sm text-gray-500">
                      • Generated in {(generationTime / 1000).toFixed(1)}s
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handleStartOver}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Memes
              </button>
            </div>

            {/* Meme Grid */}
            {isGenerating ? (
              <LoadingSpinner message="Generating more memes..." />
            ) : (
              <MemeGrid memes={memes} collageUrl={collageUrl} onGenerateMore={handleGenerateMore} />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-sm text-gray-600">
            <span>Powered by</span>
            <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Gemini 2.5 Flash
            </span>
            <span>•</span>
            <a href="/api/health" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
              Status
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            10 requests per hour • FREE tier • Made with ❤️
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
