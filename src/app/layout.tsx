import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meme Factory - AI-Powered Meme Generator',
  description: 'Transform any image into three hilarious memes with different tones — instantly.',
  keywords: ['meme', 'generator', 'AI', 'funny', 'sarcastic', 'wholesome', 'dark humor'],
  authors: [{ name: 'Meme Factory' }],
  openGraph: {
    title: 'Meme Factory - AI-Powered Meme Generator',
    description: 'Transform any image into three hilarious memes with different tones',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {children}
      </body>
    </html>
  );
}

