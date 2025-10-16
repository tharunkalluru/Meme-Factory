# API Documentation - Meme Factory

## Overview

Meme Factory provides a simple REST API for generating memes with AI-powered captions.

**Base URL:** `https://your-app.com`

---

## Authentication

No authentication required for v1. Rate limiting is enforced per IP address.

---

## Endpoints

### 1. Generate Memes

Generate three memes with different tones from an uploaded image and topic.

**Endpoint:** `POST /api/generate`

**Rate Limit:** 10 requests per hour per IP

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "image": "data:image/png;base64,iVBORw0KG...",
  "topic": "Monday mornings",
  "includeWatermark": true,
  "textPosition": "top"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | string | Yes | Base64-encoded image (PNG/JPG, max 5MB) |
| `topic` | string | Yes | Meme topic (max 120 chars) |
| `includeWatermark` | boolean | No | Add watermark (default: true) |
| `textPosition` | string | No | "top" or "bottom" (default: "top") |

#### Response

**Success (200):**
```json
{
  "success": true,
  "memes": [
    {
      "id": "meme-0-1697385600000",
      "tone": "sarcastic",
      "caption": "OH BOY, ANOTHER PRODUCTIVE WEEK AHEAD",
      "imageUrl": "data:image/png;base64,iVBORw0KG..."
    },
    {
      "id": "meme-1-1697385600000",
      "tone": "wholesome",
      "caption": "NEW WEEK, NEW OPPORTUNITIES TO SHINE",
      "imageUrl": "data:image/png;base64,iVBORw0KG..."
    },
    {
      "id": "meme-2-1697385600000",
      "tone": "dark_humor",
      "caption": "ONLY 4 MORE DAYS UNTIL FRIDAY",
      "imageUrl": "data:image/png;base64,iVBORw0KG..."
    }
  ],
  "collageUrl": "data:image/png;base64,iVBORw0KG...",
  "generationTime": 12453
}
```

**Headers:**
```
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2025-10-15T13:00:00.000Z
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Both image and topic are required",
    "retryable": false
  }
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You've reached the hourly limit. Try again in 45 minutes.",
    "retryable": false
  }
}
```

**Headers:**
```
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-10-15T13:00:00.000Z
Retry-After: 2700
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "GENERATION_FAILED",
    "message": "Generation failed. Please try again.",
    "retryable": true
  }
}
```

#### Error Codes

| Code | Description | HTTP Status | Retryable |
|------|-------------|-------------|-----------|
| `INVALID_INPUT` | Missing or invalid parameters | 400 | No |
| `TOPIC_TOO_LONG` | Topic exceeds 120 characters | 400 | No |
| `INVALID_IMAGE` | Invalid base64 image data | 400 | No |
| `IMAGE_TOO_LARGE` | Image exceeds 5MB | 400 | No |
| `CONTENT_FLAGGED` | Topic flagged by moderation | 400 | No |
| `GENERATED_CONTENT_FLAGGED` | Generated caption flagged | 400 | Yes |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 | No |
| `GENERATION_FAILED` | Server error or timeout | 500 | Yes |

---

### 2. Moderate Text

Check if text content is safe for work.

**Endpoint:** `POST /api/moderate`

**Note:** This endpoint is used internally but can be called directly for testing.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Is this content safe?"
}
```

#### Response

**Success (200):**
```json
{
  "flagged": false,
  "categories": [],
  "safe": true
}
```

**Flagged Content:**
```json
{
  "flagged": true,
  "categories": ["hate", "violence"],
  "safe": false
}
```

**Error (400):**
```json
{
  "error": "Text is required"
}
```

---

### 3. Health Check

Check API status and service availability.

**Endpoint:** `GET /api/health`

**Rate Limit:** None

#### Request

```bash
curl https://your-app.com/api/health
```

#### Response

**Healthy (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-15T12:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "llm": "configured",
    "moderation": "configured"
  }
}
```

**Unhealthy (500):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-10-15T12:00:00.000Z",
  "error": "OpenAI API key not configured"
}
```

---

## Rate Limiting

### Limits

- **Default:** 10 requests per hour per IP address
- **Window:** Rolling 60-minute window
- **Scope:** Per IP (X-Forwarded-For header)

### Headers

All API responses include rate limit headers:

```
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2025-10-15T13:00:00.000Z
```

### Handling Rate Limits

**Client-Side:**
```typescript
const response = await fetch('/api/generate', { /* ... */ });

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  const minutes = Math.ceil(parseInt(retryAfter || '0') / 60);
  
  alert(`Rate limit exceeded. Try again in ${minutes} minutes.`);
}
```

---

## Content Moderation

All user inputs and AI-generated outputs are moderated for safety.

### Moderation Categories

- `hate`: Hateful content
- `harassment`: Harassment or bullying
- `violence`: Violence or threats
- `sexual`: Sexual content
- `self-harm`: Self-harm content

### Moderation Flow

1. **Topic Moderation (Pre-LLM)**
   - User topic is checked before sending to AI
   - If flagged: Request rejected with 400 error

2. **Caption Moderation (Post-LLM)**
   - All 3 generated captions are checked
   - If ANY caption flagged: All results blocked

### Bypass (Development Only)

```bash
# .env.local
SKIP_MODERATION=true
```

**Warning:** Never enable in production!

---

## Examples

### Example 1: Generate Memes (JavaScript)

```javascript
async function generateMemes(imageFile, topic) {
  // Convert file to base64
  const reader = new FileReader();
  reader.readAsDataURL(imageFile);
  
  const base64Image = await new Promise((resolve) => {
    reader.onload = () => resolve(reader.result);
  });

  // Call API
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      topic: topic,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error.message);
  }

  return data.memes;
}

// Usage
const fileInput = document.querySelector('input[type="file"]');
const memes = await generateMemes(fileInput.files[0], 'Monday mornings');
console.log(memes);
```

### Example 2: Download Meme

```javascript
function downloadMeme(imageUrl, filename) {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Usage
downloadMeme(meme.imageUrl, `meme-${meme.tone}-${Date.now()}.png`);
```

### Example 3: Check Rate Limit

```javascript
async function checkRateLimit() {
  const response = await fetch('/api/generate', {
    method: 'HEAD', // Don't actually generate
  });

  const remaining = response.headers.get('X-RateLimit-Remaining');
  const resetAt = new Date(response.headers.get('X-RateLimit-Reset'));

  console.log(`Remaining: ${remaining}`);
  console.log(`Resets at: ${resetAt.toLocaleString()}`);
}
```

### Example 4: Moderate Text Before Submission

```javascript
async function isTopicSafe(topic) {
  const response = await fetch('/api/moderate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: topic }),
  });

  const data = await response.json();
  return data.safe;
}

// Usage
const topic = 'Monday mornings';
if (await isTopicSafe(topic)) {
  // Proceed with generation
} else {
  alert('Please try a different topic');
}
```

### Example 5: cURL Request

```bash
# Generate memes
curl -X POST https://your-app.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/png;base64,iVBORw0KG...",
    "topic": "Monday mornings"
  }'

# Check health
curl https://your-app.com/api/health

# Moderate text
curl -X POST https://your-app.com/api/moderate \
  -H "Content-Type: application/json" \
  -d '{"text": "Is this safe?"}'
```

---

## Best Practices

### 1. Client-Side Validation

Validate inputs before calling API to save rate limit quota:

```javascript
function validateInputs(file, topic) {
  // Check file type
  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    return 'Please upload a PNG or JPG image';
  }

  // Check file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'Image must be under 5MB';
  }

  // Check topic length
  if (topic.length === 0) {
    return 'Please enter a topic';
  }

  if (topic.length > 120) {
    return 'Topic must be 120 characters or less';
  }

  return null; // Valid
}
```

### 2. Error Handling

Always handle errors gracefully:

```javascript
try {
  const response = await fetch('/api/generate', { /* ... */ });
  const data = await response.json();

  if (!data.success) {
    // Show user-friendly error
    showError(data.error.message);
    
    // Log for debugging
    console.error('Generation failed:', data.error);
    
    // Retry if retryable
    if (data.error.retryable) {
      showRetryButton();
    }
    
    return;
  }

  // Success path
  displayMemes(data.memes);
} catch (error) {
  // Network error
  showError('Connection failed. Please check your internet.');
}
```

### 3. Loading States

Show progress during generation (10-15 seconds):

```javascript
button.disabled = true;
button.textContent = 'Generating...';

const spinner = document.createElement('div');
spinner.className = 'spinner';
button.appendChild(spinner);

try {
  const memes = await generateMemes(file, topic);
  displayMemes(memes);
} finally {
  button.disabled = false;
  button.textContent = 'Generate Memes';
  spinner.remove();
}
```

### 4. Rate Limit Tracking

Track remaining quota:

```javascript
let rateLimitRemaining = 10;

async function generate() {
  if (rateLimitRemaining === 0) {
    alert('Rate limit exceeded. Try again later.');
    return;
  }

  const response = await fetch('/api/generate', { /* ... */ });
  
  rateLimitRemaining = parseInt(
    response.headers.get('X-RateLimit-Remaining') || '0'
  );

  updateUI(`${rateLimitRemaining} generations remaining`);
}
```

---

## Performance

### Typical Latencies

| Step | Time | Notes |
|------|------|-------|
| Image upload | 1-2s | Depends on image size and network |
| Topic validation | <1s | Fast moderation check |
| LLM generation | 3-5s | OpenAI API call |
| Caption moderation | <1s | Fast moderation check |
| Meme rendering | 2-3s | Parallel processing (3 memes) |
| Collage creation | 1s | Image composition |
| **Total** | **8-12s** | Typical end-to-end time |

### Optimization Tips

1. **Reduce Image Size**: Smaller images process faster
2. **Shorter Topics**: Less tokens = faster LLM response
3. **Skip Watermark**: Slightly faster rendering
4. **Reuse Image**: Generate more captions for same image

---

## Changelog

### v1.0.0 (October 15, 2025)

- Initial release
- Three tone support: sarcastic, wholesome, dark humor
- Rate limiting: 10 requests/hour
- Content moderation: OpenAI Moderation API
- Image formats: PNG, JPG (max 5MB)
- Collage generation

---

## Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/meme-factory/issues)
- **API Status:** [Health Check](/api/health)
- **Email:** api-support@meme-factory.app

---

**Last Updated:** October 15, 2025

