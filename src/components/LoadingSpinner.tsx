'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Generating your memes...' }: LoadingSpinnerProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center space-y-8">
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-24 h-24 border-8 border-indigo-200 rounded-full animate-pulse" />
        
        {/* Spinning Ring */}
        <div className="absolute inset-0 w-24 h-24 border-8 border-transparent border-t-indigo-600 border-r-purple-600 rounded-full animate-spin" />
        
        {/* Inner Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl animate-bounce-slow">🎨</span>
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-3">
        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {message}
        </p>
        <p className="text-gray-500 text-sm">
          This may take 5-10 seconds...
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        {[
          { icon: '🤖', label: 'AI Thinking', delay: '0s' },
          { icon: '✍️', label: 'Writing Captions', delay: '0.2s' },
          { icon: '🎨', label: 'Creating Memes', delay: '0.4s' },
        ].map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-md animate-pulse"
            style={{ animationDelay: step.delay }}
          >
            <span className="text-2xl">{step.icon}</span>
            <span className="font-medium text-gray-700 text-sm">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Loading Bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-loading-bar" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
