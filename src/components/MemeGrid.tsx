'use client';

import { Meme } from '@/types/meme';
import { useCallback, useState } from 'react';

interface MemeGridProps {
  memes: Meme[];
  collageUrl: string | null;
  onGenerateMore: () => void;
}

const TONE_LABELS: Record<string, { label: string; emoji: string; color: string; gradient: string }> = {
  sarcastic: {
    label: 'Sarcastic',
    emoji: '😏',
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
  },
  wholesome: {
    label: 'Wholesome',
    emoji: '🥰',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
  },
  dark_humor: {
    label: 'Dark Humor',
    emoji: '😈',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
  },
};

export default function MemeGrid({ memes, collageUrl, onGenerateMore }: MemeGridProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = useCallback((imageUrl: string, filename: string, id?: string) => {
    if (id) setDownloadingId(id);
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloadingId(null), 1000);
  }, []);

  if (memes.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-8">
      {/* Individual Memes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memes.map((meme) => {
          const toneInfo = TONE_LABELS[meme.tone] || {
            label: meme.tone,
            emoji: '😀',
            color: 'from-gray-500 to-gray-600',
            gradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
          };
          const isDownloading = downloadingId === meme.id;

          return (
            <div
              key={meme.id}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-500 overflow-hidden animate-fade-in hover:-translate-y-2"
              style={{ animationDelay: `${memes.indexOf(meme) * 100}ms` }}
            >
              {/* Gradient Glow on Hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${toneInfo.color} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition duration-500`} />
              
              {/* Card Content */}
              <div className="relative">
                {/* Tone Header */}
                <div className={`p-5 bg-gradient-to-r ${toneInfo.color}`}>
                  <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{toneInfo.emoji}</span>
                    <span className="font-bold text-gray-800 text-base">{toneInfo.label}</span>
                  </div>
                </div>

                {/* Meme Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meme.imageUrl}
                    alt={`${toneInfo.label} meme`}
                    className="w-full h-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  />
                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-700 transform -translate-x-full group-hover:translate-x-full" />
                </div>

                {/* Caption & Actions */}
                <div className={`p-6 space-y-4 ${toneInfo.gradient}`}>
                  {/* Caption */}
                  <div className="min-h-[60px] flex items-center">
                    <p className="text-sm text-gray-700 italic line-clamp-3 font-medium leading-relaxed">
                      &quot;{meme.caption}&quot;
                    </p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(meme.imageUrl, `meme-${meme.tone}-${Date.now()}.png`, meme.id)}
                    disabled={isDownloading}
                    className={`
                      group/btn relative w-full px-4 py-3.5 rounded-xl font-bold text-white overflow-hidden
                      transition-all duration-300 shadow-lg hover:shadow-2xl
                      flex items-center justify-center gap-2
                      bg-gradient-to-r ${toneInfo.color}
                      hover:scale-[1.03] active:scale-[0.97]
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    
                    {isDownloading ? (
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download Meme
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collage Section */}
      {collageUrl && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="text-3xl">🎨</span>
                  <span>3-Up Collage</span>
                </h3>
                <p className="text-indigo-100 mt-1">Perfect for sharing on social media</p>
              </div>
              <div className="hidden sm:flex gap-2">
                {['Instagram', 'Twitter', 'Facebook'].map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Collage Image */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={collageUrl}
                alt="Meme collage"
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-2xl" />
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleDownload(collageUrl, `meme-collage-${Date.now()}.png`, 'collage')}
              disabled={downloadingId === 'collage'}
              className={`
                flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700
                transition-all duration-200 font-bold text-lg
                flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {downloadingId === 'collage' ? (
                <>
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Collage
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <button
          onClick={onGenerateMore}
          className="group px-8 py-4 bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600
                   border-2 border-indigo-600 hover:border-transparent
                   text-indigo-600 hover:text-white rounded-xl
                   transition-all duration-300 font-bold text-lg
                   flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                   hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Generate More Memes
        </button>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">💡</div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Pro Tips:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Click &quot;Generate More&quot; for fresh captions with the same image
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Use the collage for easy sharing across multiple platforms
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Each meme is high-quality PNG for perfect printing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
