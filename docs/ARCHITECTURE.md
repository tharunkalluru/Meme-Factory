# Meme Factory - Technical Architecture

## Overview

Meme Factory is a full-stack web application built with Next.js that generates AI-powered memes with different tones. This document describes the technical architecture, data flow, and key design decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ ImageUpload │  │ TopicInput   │  │ MemeGrid         │   │
│  │ Component   │  │ Component    │  │ Component        │   │
│  └──────┬──────┘  └──────┬───────┘  └────────▲─────────┘   │
│         │                │                     │             │
│         └────────────────┴─────────────────────┘             │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTPS (REST API)
┌──────────────────────────┼───────────────────────────────────┐
│                 Next.js Server (API Routes)                  │
│  ┌───────────────────────┴──────────────────────────────┐   │
│  │                 /api/generate                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │   │
│  │  │ Validate │→ │ Moderate │→ │ LLM Client       │   │   │
│  │  │ Input    │  │ Topic    │  │ (OpenAI)         │   │   │
│  │  └──────────┘  └──────────┘  └────────┬─────────┘   │   │
│  │                                        │             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────▼─────────┐   │   │
│  │  │ Download │← │ Generate │← │ Meme Renderer    │   │   │
│  │  │ Memes    │  │ Collage  │  │ (Sharp)          │   │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Rate Limiter  │  │ Error Handler  │  │ Logger       │  │
│  │ (In-Memory)   │  │ Middleware     │  │ Utility      │  │
│  └───────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────────┐           ┌──────────────────────┐    │
│  │ OpenAI API       │           │ OpenAI Moderation    │    │
│  │ (GPT-4o-mini)    │           │ API                  │    │
│  └──────────────────┘           └──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Layer (React/Next.js)

#### Page Component (`src/app/page.tsx`)
- Main entry point for the application
- Manages global state (uploaded image, topic, generated memes)
- Orchestrates the generation workflow
- Handles error states and loading indicators

#### ImageUpload Component
```typescript
interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
}
```
- Drag-and-drop file upload
- Client-side validation (type, size)
- Instant preview using FileReader
- Clear/reset functionality

#### TopicInput Component
```typescript
interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}
```
- Controlled input with character limit
- Real-time character counter
- Validation feedback
- Optional preset topics

#### MemeGrid Component
```typescript
interface MemeGridProps {
  memes: Meme[];
  collageUrl: string | null;
}

interface Meme {
  id: string;
  tone: 'sarcastic' | 'wholesome' | 'dark_humor';
  caption: string;
  imageUrl: string;
}
```
- Display 3 memes in responsive grid
- Individual download buttons
- Collage preview and download
- "Generate More" functionality

### 2. Backend Layer (API Routes)

#### POST /api/generate

**Request:**
```typescript
interface GenerateRequest {
  image: string; // base64-encoded
  topic: string;
  includeWatermark?: boolean;
  textPosition?: 'top' | 'bottom';
}
```

**Response:**
```typescript
interface GenerateResponse {
  success: true;
  memes: Array<{
    tone: string;
    caption: string;
    imageUrl: string; // base64 data URL
  }>;
  collageUrl: string; // base64 data URL
  generationTime: number; // milliseconds
}
```

**Error Response:**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}
```

**Workflow:**
1. Parse and validate request body
2. Check rate limit for IP address
3. Decode base64 image and validate format
4. Run topic through content moderation
5. Call LLM to generate 3 captions
6. Moderate generated captions
7. Render text on image (3 copies)
8. Create 3-up collage
9. Return base64-encoded results

#### POST /api/moderate

**Purpose:** Standalone moderation endpoint for real-time topic validation

**Request:**
```typescript
interface ModerateRequest {
  text: string;
}
```

**Response:**
```typescript
interface ModerateResponse {
  flagged: boolean;
  categories: string[]; // e.g., ['hate', 'violence']
}
```

#### GET /api/health

**Purpose:** Health check for monitoring and uptime services

**Response:**
```typescript
{
  status: 'healthy',
  timestamp: '2025-10-15T12:00:00.000Z',
  version: '1.0.0',
  services: {
    llm: 'operational',
    moderation: 'operational'
  }
}
```

### 3. Core Libraries

#### Meme Renderer (`lib/meme-renderer.ts`)

**Key Functions:**

```typescript
export async function renderMeme(
  imageBuffer: Buffer,
  caption: string,
  options: RenderOptions
): Promise<Buffer>

interface RenderOptions {
  fontPath: string;
  position: 'top' | 'bottom';
  watermark?: {
    text: string;
    enabled: boolean;
  };
}
```

**Algorithm:**
1. Load image with Sharp
2. Resize if > 1600px (maintain aspect ratio)
3. Calculate optimal font size based on image width
4. Wrap text to fit within 92% of width
5. Render text with stroke effect (black outline)
6. Add watermark if enabled
7. Return PNG buffer

**Text Rendering Details:**
- Use Sharp's `composite` with SVG overlay for text
- Generate SVG with `<text>` element and `stroke`/`fill` attributes
- All caps transformation via CSS `text-transform`
- Center alignment via SVG `text-anchor="middle"`

#### LLM Client (`lib/llm-client.ts`)

**Key Functions:**

```typescript
export async function generateCaptions(
  topic: string
): Promise<Caption[]>

interface Caption {
  tone: 'sarcastic' | 'wholesome' | 'dark_humor';
  text: string;
}
```

**Implementation:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateCaptions(topic: string): Promise<Caption[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 200,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `Topic: ${topic}\nGenerate 3 meme captions.`
      }
    ]
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result.captions;
}
```

**Retry Logic:**
- If invalid JSON: retry once with simplified prompt
- If timeout: throw error (client handles)
- Log all attempts and latencies

#### Content Moderation (`lib/moderation.ts`)

**Key Functions:**

```typescript
export async function moderateText(
  text: string
): Promise<ModerationResult>

interface ModerationResult {
  flagged: boolean;
  categories: string[];
  safe: boolean;
}
```

**Implementation:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function moderateText(text: string): Promise<ModerationResult> {
  const response = await openai.moderations.create({
    input: text
  });

  const result = response.results[0];
  
  return {
    flagged: result.flagged,
    categories: Object.keys(result.categories).filter(
      key => result.categories[key]
    ),
    safe: !result.flagged
  };
}
```

**Fallback:**
- If API fails, use basic keyword filter
- Keywords: hate speech, violence, NSFW terms
- Case-insensitive matching

#### Rate Limiter (`lib/rate-limiter.ts`)

**Key Functions:**

```typescript
export function checkRateLimit(
  ip: string
): RateLimitResult

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}
```

**Implementation:**
```typescript
// In-memory store (resets on server restart)
const requestCounts = new Map<string, RequestLog>();

interface RequestLog {
  count: number;
  firstRequestAt: Date;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = new Date();
  const log = requestCounts.get(ip);

  // No previous requests
  if (!log) {
    requestCounts.set(ip, { count: 1, firstRequestAt: now });
    return { allowed: true, remaining: 9, resetAt: addHours(now, 1) };
  }

  // Window expired, reset
  const hourAgo = addHours(now, -1);
  if (log.firstRequestAt < hourAgo) {
    requestCounts.set(ip, { count: 1, firstRequestAt: now });
    return { allowed: true, remaining: 9, resetAt: addHours(now, 1) };
  }

  // Within window, check count
  if (log.count >= 10) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: addHours(log.firstRequestAt, 1)
    };
  }

  // Increment and allow
  log.count++;
  return {
    allowed: true,
    remaining: 10 - log.count,
    resetAt: addHours(log.firstRequestAt, 1)
  };
}
```

**Note:** For production with multiple servers, use Redis or similar distributed cache.

## Data Flow

### Generation Workflow

```
1. User uploads image
   └─> Client validates (type, size)
       └─> Preview displayed immediately

2. User enters topic
   └─> Character counter updates
       └─> Optional: real-time moderation preview

3. User clicks "Generate Memes"
   └─> Client sends POST to /api/generate
       ├─> image (base64)
       └─> topic (string)

4. Server processes request
   ├─> Rate limit check
   ├─> Decode and validate image
   ├─> Moderate topic
   ├─> Call LLM for captions
   ├─> Moderate captions
   ├─> Render 3 memes in parallel
   ├─> Generate collage
   └─> Return results

5. Client receives response
   └─> Display memes in grid
       ├─> Show individual download buttons
       └─> Show collage with download button

6. User downloads meme(s)
   └─> Trigger browser download
       └─> Filename: meme-{tone}-{timestamp}.png
```

### Error Handling Flow

```
Error occurs
├─> Client-side validation error
│   └─> Show inline error message
│       └─> Highlight problematic field
│
├─> Rate limit error (429)
│   └─> Show countdown timer
│       └─> Disable submit button
│
├─> Moderation flag
│   └─> Show friendly message
│       └─> Suggest alternative topic
│
├─> LLM timeout/error
│   └─> Show retry button
│       └─> Log error for debugging
│
└─> Unknown server error (500)
    └─> Show generic error message
        └─> Suggest page refresh
```

## Performance Optimizations

### 1. Image Processing
- **Parallel meme rendering**: Use `Promise.all()` for 3 memes
- **Downscaling**: Resize images > 1600px before processing
- **Format optimization**: Output PNG for text clarity

### 2. API Efficiency
- **Single LLM call**: Get all 3 captions in one request
- **Streaming disabled**: Full response for JSON parsing
- **Timeout**: 30-second limit prevents hanging

### 3. Client Optimizations
- **Local preview**: Show image before upload
- **Lazy loading**: Load fonts on demand
- **Debouncing**: Character counter updates

### 4. Caching Strategy
- **Static assets**: CDN-cached (fonts, images)
- **API responses**: No caching (dynamic content)
- **Temp files**: Cleaned up after 1 hour

## Security Considerations

### 1. Input Validation
- File type whitelist (PNG, JPG only)
- File size limit (5MB)
- Topic length limit (120 chars)
- Base64 validation

### 2. Content Safety
- Two-stage moderation (topic + captions)
- Keyword fallback if API fails
- Block all results if any caption flagged

### 3. Rate Limiting
- IP-based tracking
- Prevents abuse and cost overruns
- Graceful error messages

### 4. Secret Management
- Environment variables only
- Never commit API keys
- Rotate keys regularly

### 5. CORS & CSP
- Strict CORS policy (same-origin)
- Content Security Policy headers
- HTTPS only in production

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────┐
│     Vercel Edge Network (CDN)           │
│  ┌───────────────────────────────────┐  │
│  │  Static Assets (fonts, images)    │  │
│  └───────────────────────────────────┘  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│     Vercel Serverless Functions         │
│  ┌───────────────────────────────────┐  │
│  │  Next.js App (SSR + API Routes)   │  │
│  │  ┌─────────────┐ ┌─────────────┐  │  │
│  │  │ /api/gen    │ │ /api/mod    │  │  │
│  │  └─────────────┘ └─────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         External APIs                   │
│  ┌──────────────┐  ┌────────────────┐  │
│  │ OpenAI API   │  │ Moderation API │  │
│  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────┘
```

**Key Points:**
- Each API route is a separate serverless function
- Cold start: ~2-3 seconds
- Execution timeout: 10 seconds (hobby), 60s (pro)
- Memory: 1GB default
- Auto-scaling based on traffic

### Environment Configuration

```bash
# Production
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=https://meme-factory.app
SKIP_MODERATION=false
RATE_LIMIT_MAX=10

# Development
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SKIP_MODERATION=true  # for faster testing
RATE_LIMIT_MAX=100    # higher limit for dev
```

## Monitoring & Observability

### Logging Strategy

```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata: {
    requestId: string;
    ip?: string;
    duration?: number;
    error?: string;
  };
}
```

**What to Log:**
- All API requests (with request ID)
- LLM call latency and token usage
- Moderation results (flagged items)
- Rate limit hits
- Errors with stack traces
- Generation success/failure

**What NOT to Log:**
- User images (privacy)
- Full topics (privacy)
- API keys or secrets

### Metrics to Track

- **Generation success rate**: % of successful completions
- **Average generation time**: End-to-end latency
- **LLM latency**: Time spent in OpenAI API
- **Moderation flag rate**: % of requests flagged
- **Rate limit hit rate**: % of requests rate-limited
- **Error rate by type**: Categorize errors

### Alerting

- Error rate > 10% for 5 minutes
- LLM latency > 10 seconds
- Moderation flag rate > 50%
- Rate limit exhaustion (API costs)

## Testing Strategy

### Unit Tests
- Meme renderer text wrapping
- Rate limiter logic
- Input validation functions
- Moderation keyword filter

### Integration Tests
- Full generation workflow
- Error handling paths
- Rate limit enforcement
- Moderation blocking

### E2E Tests
- Upload → Generate → Download flow
- Error states (invalid image, flagged topic)
- Mobile responsiveness
- Cross-browser compatibility

### Load Tests
- Concurrent requests (10, 50, 100)
- Large image processing (5MB files)
- Rate limit behavior under load

## Future Architecture Considerations

### v2 Enhancements

1. **Database Layer**
   - Store meme history per user
   - Analytics and popular topics
   - User preferences

2. **Caching Layer**
   - Redis for rate limiting (multi-server)
   - Caption caching for repeated topics
   - Rendered meme caching

3. **Queue System**
   - Async processing for large batches
   - Priority queue for paid users
   - Retry logic for failed jobs

4. **CDN Strategy**
   - Serve rendered memes from CDN
   - Pre-generate popular templates
   - Edge functions for faster response

5. **Microservices**
   - Separate rendering service (high CPU)
   - Dedicated moderation service
   - Independent scaling

---

**Document Version**: 1.0  
**Last Updated**: October 15, 2025  
**Maintainer**: Engineering Team

