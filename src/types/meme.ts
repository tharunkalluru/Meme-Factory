// Type definitions for Meme Factory

export type MemeTone = 'sarcastic' | 'wholesome' | 'dark_humor';

export interface Caption {
  tone: MemeTone;
  text: string;
}

export interface Meme {
  id: string;
  tone: MemeTone;
  caption: string;
  imageUrl: string; // base64 data URL
}

export interface GenerateRequest {
  image: string; // base64-encoded
  topic: string;
  includeWatermark?: boolean;
  textPosition?: 'top' | 'bottom';
}

export interface GenerateResponse {
  success: true;
  memes: Meme[];
  collageUrl: string;
  generationTime: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface ModerateRequest {
  text: string;
}

export interface ModerateResponse {
  flagged: boolean;
  categories: string[];
  safe: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export interface RenderOptions {
  fontPath: string;
  position: 'top' | 'bottom';
  watermark?: {
    text: string;
    enabled: boolean;
  };
}

export interface LLMResponse {
  captions: Caption[];
}

export interface ModerationResult {
  flagged: boolean;
  categories: string[];
  safe: boolean;
}

