# Meme Factory - Product Specification v1.0

## Executive Summary

A simple web application that generates three memes with different tones (sarcastic, wholesome, dark humor) from a user-uploaded image and topic, with individual and collage download options.

---

## 1. Scope Definition

### Must-Have Features (v1)

- **Image Upload**
  - Supported formats: PNG, JPG, JPEG
  - Maximum file size: 5MB
  - Client-side validation with user-friendly errors

- **Topic Input**
  - Text input field with 120 character limit
  - Real-time character counter
  - Required field validation

- **Tone Selection**
  - Three distinct tones (pre-selected):
    - Sarcastic
    - Wholesome
    - Dark Humor

- **Meme Generation**
  - Single LLM API call returns 3 captions
  - Structured JSON response format
  - Server-side text overlay on uploaded image
  - Classic meme styling: white text with black outline

- **Download Options**
  - Individual download button per meme (PNG format)
  - Combined 3-up collage download for social posting
  - Proper filename generation with timestamps

### Nice-to-Have Features (Time-boxed)

- **Watermark Toggle**
  - Optional small product signature
  - Bottom-right placement
  - Semi-transparent overlay

- **Text Position Control**
  - Toggle between top and bottom placement
  - Default: top-center

- **Rate Limiting**
  - Simple per-IP hourly cap (~10 requests/hour)
  - Friendly error messages

- **Content Moderation**
  - Topic validation before LLM call
  - Caption moderation after generation
  - Block unsafe content with helpful messaging

### Non-Goals (v1)

- User accounts or authentication
- Database or persistence layer
- Public galleries or social features
- Payment or monetization
- Advanced editing tools
- Mobile native apps

---

## 2. Technical Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **File Upload**: Native HTML5 File API

### Backend
- **API**: Next.js API Routes (serverless functions)
- **Runtime**: Node.js 18+
- **Image Processing**: Sharp library
- **Font**: Impact.ttf (bundled in project)

### AI/LLM
- **Provider**: OpenAI (GPT-4o-mini) or Gemini 1.5 Flash
- **Temperature**: 0.7-0.8 (for creative humor)
- **Max Tokens**: 200 per response
- **Response Format**: Enforced JSON mode

### Content Moderation
- **Primary**: OpenAI Moderation API
- **Fallback**: Keyword filtering for basic safety

### Deployment
- **Platform**: Vercel (optimized for Next.js)
- **Alternative**: Railway, Render, or Hugging Face Spaces
- **Environment**: Environment variables for secrets
- **CDN**: Automatic (Vercel Edge Network)

### Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "sharp": "^0.33.0",
  "openai": "^4.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0"
}
```

---

## 3. User Flow

### Primary Flow (Happy Path)

1. **Landing Page**
   - User sees upload area and topic input
   - Brief description of product
   - Example memes (optional)

2. **Image Upload**
   - User clicks upload area or drags image
   - Client validates file type and size
   - Preview displayed immediately
   - Clear error messages for invalid files

3. **Topic Entry**
   - User types topic (e.g., "Monday mornings")
   - Character counter shows remaining limit
   - Optional preset topics for inspiration

4. **Generation**
   - User clicks "Generate Memes" button
   - Button disabled during processing
   - Loading indicator with progress message
   - Backend workflow:
     - Validate image and topic
     - Run content moderation on topic
     - Call LLM with structured prompt
     - Parse JSON response (3 captions)
     - Moderate generated captions
     - Render text overlay on 3 image copies
     - Create horizontal 3-up collage
     - Return URLs or base64 data

5. **Results Display**
   - Three memes displayed with tone labels
   - Individual download buttons
   - Collage preview with download button
   - "Generate More" option (same image, new captions)
   - "Start Over" to upload new image

### Error Paths

- **Invalid Image**: "Please upload a PNG or JPG under 5MB"
- **No Topic**: "Please enter a topic for your memes"
- **Moderation Flagged**: "Let's keep this safe — try a different topic"
- **LLM Failure**: "Generation failed. Please try again."
- **Rate Limited**: "You've reached the hourly limit. Try again later."
- **Server Error**: "Something went wrong. Please refresh and try again."

---

## 4. LLM Prompt Strategy

### System Instruction
```
You are a meme caption generator. Your ONLY output is valid JSON.
Return exactly 3 short, witty captions for the given topic.
Each caption must be safe-for-work and under 60 characters.
Use these three tones in order: sarcastic, wholesome, dark humor.

Output format:
{
  "captions": [
    {"tone": "sarcastic", "text": "caption here"},
    {"tone": "wholesome", "text": "caption here"},
    {"tone": "dark_humor", "text": "caption here"}
  ]
}

Rules:
- NO explanations or additional text
- NO offensive, hateful, or NSFW content
- Keep each caption punchy and meme-appropriate
- Use classic meme language and structure
```

### User Instruction Template
```
Topic: {user_topic}
Generate 3 meme captions (max 60 chars each) with the required tones.
Be witty but family-friendly.
```

### Parameters
- **Model**: gpt-4o-mini
- **Temperature**: 0.7
- **Max Tokens**: 200
- **Response Format**: JSON mode (enforced)
- **Timeout**: 30 seconds

### Retry Logic
- If invalid JSON: Retry once with simplified prompt
- If moderation fails: Don't retry, show error
- If timeout: Show error, suggest shorter topic

### Logging
- Log latency for each LLM call
- Log token usage
- Log moderation results
- Track retry attempts

---

## 5. Content Moderation Plan

### Two-Stage Moderation

#### Stage 1: Topic Moderation (Pre-LLM)
- Run user topic through OpenAI Moderation API
- Check categories: hate, harassment, violence, sexual, self-harm
- Threshold: Any category flagged = block
- Response time: < 1 second

#### Stage 2: Caption Moderation (Post-LLM)
- Run all 3 generated captions through moderation
- If ANY caption flagged: block all results
- Fallback: Simple keyword filter if API fails

### Error Messaging
```
Flagged Topic:
"Let's keep this safe for everyone. Please try a different topic!"

Flagged Captions:
"Our system couldn't generate safe content for this topic. Try something else!"
```

### Bypass (Development Only)
- Environment variable: `SKIP_MODERATION=true`
- Never enabled in production

---

## 6. Meme Rendering Specification

### Typography
- **Font**: Impact (bundled as `Impact.ttf`)
- **Fallback**: Arial Black, sans-serif
- **Color**: White (#FFFFFF)
- **Outline**: Black (#000000), 3-4px stroke
- **Style**: ALL CAPS transformation

### Text Sizing Algorithm
1. Start with base size: `imageWidth / 12`
2. Render text and check if it exceeds 90% of image width
3. If exceeded, reduce font size by 10% and check wrapping
4. If text wraps beyond 3 lines, reduce size again
5. Minimum font size: `imageWidth / 20`

### Text Positioning
- **Default**: Top-center
- **Horizontal**: Centered with 4% margin on each side
- **Vertical**: 5% from top (or bottom if position = "bottom")
- **Line Height**: 1.1x font size
- **Max Lines**: 3 (force ellipsis if exceeded)

### Text Wrapping
- Max width: 92% of image width
- Word-based wrapping (no mid-word breaks)
- Center-align all lines
- Even spacing between lines

### Watermark (Optional)
- **Text**: "meme-factory.app" or custom
- **Position**: Bottom-right corner
- **Offset**: 2% from edges
- **Font Size**: `imageWidth / 40`
- **Opacity**: 30%
- **Color**: White with black outline (subtle)

### Image Optimization
- **Max Dimension**: 1600px (longest edge)
- **Maintain Aspect Ratio**: Yes
- **Quality**: 90% for JPEG, lossless for PNG
- **Output Format**: PNG (preserves text quality)

### Collage Specification
- **Layout**: Horizontal 3-up (side-by-side)
- **Spacing**: 20px gap between images
- **Background**: White or transparent
- **Individual Size**: Each meme scaled to 600px width
- **Total Size**: ~1840px width × (height of tallest)
- **Output**: PNG format

---

## 7. Rate Limiting & Reliability

### Rate Limiting
- **Strategy**: In-memory IP-based tracking
- **Limit**: 10 requests per hour per IP
- **Reset**: Rolling window (60 minutes from first request)
- **Response**: 429 status code with friendly message
- **Header**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Error Handling
```typescript
// Standardized error response
{
  success: false,
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "You've hit the hourly limit. Try again later.",
    retryAfter: 3600 // seconds
  }
}
```

### Retry Logic (Client-Side)
- LLM timeout: Retry once after 2 seconds
- Network error: Retry once immediately
- 500 errors: Don't retry, show error
- 429 errors: Show rate limit message, no retry

### Reliability Measures
- Graceful degradation if LLM unavailable
- Fallback error messages for all failure points
- Automatic cleanup of temp files (after 1 hour)
- Request timeout: 45 seconds total
- Logging for debugging (no PII)

---

## 8. Performance Targets

### Timing Benchmarks
- **Image Upload**: < 2 seconds for 5MB file
- **Topic Validation**: < 1 second
- **LLM Response**: < 5 seconds
- **Meme Rendering**: < 3 seconds per meme
- **Collage Creation**: < 2 seconds
- **Total Time**: < 15 seconds (upload to results)
- **Target**: < 20 seconds on free-tier infrastructure

### Resource Limits
- **Memory**: < 512MB per request
- **CPU**: Optimize image processing (use Sharp)
- **Storage**: No persistent storage (temp files only)
- **Temp File Cleanup**: Every hour via cron or on-demand

### Optimization Strategies
- Downscale large images before processing
- Parallel meme rendering (Promise.all)
- Lazy load fonts (preload Impact.ttf)
- Client-side image preview (no server upload for preview)
- CDN caching for static assets

---

## 9. QA Checklist

### Functional Tests

**Upload & Input**
- [ ] PNG upload works (< 5MB)
- [ ] JPG/JPEG upload works (< 5MB)
- [ ] Files > 5MB rejected with clear error
- [ ] Invalid file types (GIF, PDF, etc.) rejected
- [ ] Topic input accepts up to 120 characters
- [ ] Topics > 120 chars truncated or rejected
- [ ] Character counter updates in real-time

**Generation**
- [ ] LLM returns exactly 3 captions
- [ ] Each caption has correct tone label
- [ ] Captions are unique and contextual
- [ ] Button disables during generation
- [ ] Loading indicator shows progress

**Rendering**
- [ ] Text is white with black outline (readable)
- [ ] Text is properly centered
- [ ] Long captions wrap to 2-3 lines
- [ ] Font size scales appropriately
- [ ] No text overflow or clipping
- [ ] Watermark appears if enabled (subtle)

**Downloads**
- [ ] Individual meme downloads work (PNG)
- [ ] Collage download works (PNG)
- [ ] Filenames include timestamp
- [ ] Downloads work on Chrome, Firefox, Safari
- [ ] Downloads work on mobile browsers

### Edge Case Tests

**Visual Edge Cases**
- [ ] Very bright background (text still readable)
- [ ] Very dark background (text still readable)
- [ ] Solid color images (rendering works)
- [ ] Extremely wide images (rendering works)
- [ ] Extremely tall images (rendering works)
- [ ] Very short captions (e.g., "LOL")
- [ ] Maximum length captions (60 chars)

**Input Edge Cases**
- [ ] Empty topic → button disabled
- [ ] No image uploaded → button disabled
- [ ] Special characters in topic (emojis, symbols)
- [ ] Very long words in topic (no line breaking)
- [ ] Multiple spaces in topic (normalized)

**Error Conditions**
- [ ] Moderation flags unsafe topic
- [ ] Moderation flags unsafe caption
- [ ] LLM returns invalid JSON → retry works
- [ ] LLM timeout → error shown
- [ ] Network error → graceful message
- [ ] Rate limit hit → friendly message with timer

### Stability Tests
- [ ] No unhandled exceptions in normal use
- [ ] No console errors in browser
- [ ] No 500 errors in API logs
- [ ] Memory usage stays under 512MB
- [ ] Temp files are cleaned up
- [ ] Concurrent requests don't crash server
- [ ] LLM latency logged correctly

### Cross-Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & iOS)
- [ ] Edge (desktop)

### Accessibility
- [ ] All buttons have ARIA labels
- [ ] Image upload has keyboard support
- [ ] Error messages are screen-reader friendly
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible on all interactive elements

---

## 10. Deployment Specification

### Environment Variables
```bash
# Required
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://meme-factory.app

# Optional
SKIP_MODERATION=false
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=3600
WATERMARK_TEXT=meme-factory.app
ENABLE_WATERMARK=true
```

### Deployment Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure
- Add environment variables in Vercel dashboard
- Set region to nearest user base
- Enable Edge Functions for API routes
- Configure custom domain (optional)
```

**Pros**: 
- Zero-config for Next.js
- Automatic HTTPS & CDN
- Generous free tier
- Built-in analytics

**Cons**:
- Serverless cold starts (~2-3s)
- 10-second execution limit (hobby tier)

### Deployment Option B: Railway
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Deploy
railway up

# Or via GitHub integration
git push origin main
```

**Pros**:
- Long-running processes
- Better for image processing
- Simple pricing

**Cons**:
- Requires Docker config
- Manual scaling

### Deployment Option C: Hugging Face Spaces (Streamlit Alternative)
Not recommended for Next.js, but viable if pivoting to Python/Streamlit.

### Health Check Endpoint
```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}
```

### Monitoring
- **Logs**: Vercel logs or Railway logs
- **Errors**: Capture and log all API errors
- **Metrics**: Track generation time, success rate, rate limit hits
- **Uptime**: Use UptimeRobot or similar (free tier)

### Pre-Launch Checklist
- [ ] All environment variables set
- [ ] Impact.ttf font bundled correctly
- [ ] API keys valid and funded
- [ ] Rate limiting enabled
- [ ] Content moderation enabled
- [ ] Health check endpoint works
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Error tracking enabled
- [ ] QA checklist completed

### Post-Launch Monitoring
- Monitor LLM API usage and costs
- Track success/error rates
- Monitor generation times
- Watch for rate limit patterns
- Check moderation flag rates
- Gather user feedback

---

## Appendix

### Meme Caption Best Practices
- Use ALL CAPS for maximum impact
- Keep it short (under 60 chars ideal)
- Reference common situations
- Use present tense
- Avoid complex vocabulary
- One clear joke per caption

### Example Generations

**Topic**: "Monday mornings"
```json
{
  "captions": [
    {"tone": "sarcastic", "text": "OH BOY, ANOTHER PRODUCTIVE WEEK AHEAD"},
    {"tone": "wholesome", "text": "NEW WEEK, NEW OPPORTUNITIES TO SHINE"},
    {"tone": "dark_humor", "text": "ONLY 4 MORE DAYS UNTIL FRIDAY"}
  ]
}
```

**Topic**: "When the WiFi drops"
```json
{
  "captions": [
    {"tone": "sarcastic", "text": "GREAT TIME FOR HUMAN INTERACTION"},
    {"tone": "wholesome", "text": "PERFECT MOMENT FOR A BOOK BREAK"},
    {"tone": "dark_humor", "text": "GUESS I'LL JUST STARE AT THE WALL"}
  ]
}
```

### Future Considerations (v2+)
- Multiple font options
- Animated GIF support
- Template library (preset backgrounds)
- Social sharing direct to platforms
- Meme history (local storage)
- A/B testing different caption styles
- Multi-language support
- Custom tone definitions

---

**Document Version**: 1.0  
**Last Updated**: October 15, 2025  
**Status**: Ready for Implementation

