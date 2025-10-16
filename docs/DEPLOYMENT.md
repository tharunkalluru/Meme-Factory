# Deployment Guide - Meme Factory

This guide covers deploying Meme Factory to various platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Vercel Deployment (Recommended)](#vercel-deployment)
4. [Railway Deployment](#railway-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [x] OpenAI API key with billing enabled
- [x] Git repository (GitHub, GitLab, etc.)
- [x] Node.js 18+ installed locally (for testing)
- [x] All tests passing locally

### Local Testing

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Run development server
npm run dev

# Test the app at http://localhost:3000
# Upload an image, enter a topic, generate memes

# Build for production
npm run build

# Test production build
npm start
```

---

## Environment Variables

All deployment platforms require these environment variables:

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-proj-abc123...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public URL of your app | `http://localhost:3000` |
| `SKIP_MODERATION` | Skip content moderation (dev only) | `false` |
| `RATE_LIMIT_MAX` | Max requests per hour per IP | `10` |
| `RATE_LIMIT_WINDOW` | Rate limit window in seconds | `3600` |
| `ENABLE_WATERMARK` | Enable watermark on memes | `true` |
| `WATERMARK_TEXT` | Watermark text | `meme-factory.app` |

---

## Vercel Deployment

**Recommended for Next.js apps.** Free tier includes generous limits.

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/meme-factory.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add `OPENAI_API_KEY` with your key
   - Add any optional variables
   - Apply to Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your app is live! 🎉

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? meme-factory
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add OPENAI_API_KEY production

# Deploy to production
vercel --prod
```

### Vercel Configuration

The included `vercel.json` configures:
- 1GB memory for API routes (needed for image processing)
- 60-second timeout (generous for LLM calls)
- Security headers (XSS, clickjacking protection)

### Vercel Limits (Free Tier)

- 100GB bandwidth/month
- 100 hours serverless function execution/month
- 10-second timeout (hobby), 60s (pro)
- Perfect for demos and low-traffic apps

---

## Railway Deployment

**Good for long-running processes and predictable pricing.**

### Prerequisites

- Railway account ([railway.app](https://railway.app))
- GitHub repository

### Steps

1. **Connect Repository**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Build**
   - Railway auto-detects Next.js
   - Build command: `npm run build`
   - Start command: `npm start`

3. **Set Environment Variables**
   - In project settings, add variables:
     ```
     OPENAI_API_KEY=sk-proj-...
     NEXT_PUBLIC_APP_URL=https://your-app.railway.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Railway provides a public URL

### Railway Pricing

- $5/month credit on free tier
- Pay per usage: ~$0.000463/GB-hour
- Typical app: ~$5-10/month

---

## Docker Deployment

**For self-hosting or custom infrastructure.**

### Build and Run Locally

```bash
# Build image
docker build -t meme-factory .

# Run container
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-proj-... \
  meme-factory

# Test at http://localhost:3000
```

### Deploy to Container Registry

#### Docker Hub

```bash
# Tag image
docker tag meme-factory yourusername/meme-factory:latest

# Push to Docker Hub
docker push yourusername/meme-factory:latest
```

#### Deploy to Any Host

```bash
# On your server (via SSH)
docker pull yourusername/meme-factory:latest

docker run -d \
  -p 3000:3000 \
  -e OPENAI_API_KEY=sk-proj-... \
  --restart unless-stopped \
  --name meme-factory \
  yourusername/meme-factory:latest
```

### Docker Compose (Optional)

```yaml
# docker-compose.yml
version: '3.8'

services:
  meme-factory:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_APP_URL=https://yourdomain.com
    restart: unless-stopped
```

```bash
# Run with docker-compose
docker-compose up -d
```

---

## Post-Deployment

### 1. Verify Health

```bash
# Check health endpoint
curl https://your-app.com/api/health

# Expected response:
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

### 2. Test Full Workflow

1. Upload a test image
2. Enter a topic: "Testing deployment"
3. Click "Generate Memes"
4. Verify all 3 memes render correctly
5. Download individual meme and collage
6. Check console for errors

### 3. Monitor Logs

#### Vercel
```bash
vercel logs --follow
```

#### Railway
- View logs in Railway dashboard
- Filter by severity

#### Docker
```bash
docker logs -f meme-factory
```

### 4. Set Up Monitoring

#### Uptime Monitoring

Use [UptimeRobot](https://uptimerobot.com) (free):
- Monitor: `https://your-app.com/api/health`
- Check interval: 5 minutes
- Alert: Email/SMS on downtime

#### Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

### 5. Custom Domain (Optional)

#### Vercel
1. Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. HTTPS auto-configured

#### Railway
1. Project Settings → Domains
2. Add custom domain
3. Update CNAME record to Railway

---

## Troubleshooting

### Build Failures

#### Error: "Cannot find module 'sharp'"

**Solution:**
```bash
# Ensure sharp is in dependencies (not devDependencies)
npm install --save sharp

# Clear cache and rebuild
rm -rf node_modules .next
npm install
npm run build
```

#### Error: "Out of memory"

**Solution:**
- Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096"`
- Reduce image processing size in `meme-renderer.ts`

### Runtime Errors

#### Error: "OpenAI API key not found"

**Solution:**
- Verify `OPENAI_API_KEY` is set in environment
- Check for typos in variable name
- Restart app after setting variable

#### Error: "Rate limit exceeded" (OpenAI)

**Solution:**
- Check OpenAI dashboard for usage
- Upgrade OpenAI plan if needed
- Add better error handling for 429 responses

#### Error: "Function timeout"

**Solution:**
- Increase timeout (Vercel Pro: 60s)
- Optimize image processing (reduce max dimension)
- Consider queueing for large images

### Performance Issues

#### Slow Generation (>30 seconds)

**Checklist:**
- [ ] Image size > 5MB? Reduce it
- [ ] LLM timeout? Check OpenAI status
- [ ] Cold start? First request is slower
- [ ] Network latency? Check server region

**Optimizations:**
- Use smaller images (< 2MB)
- Reduce max image dimension (current: 1600px)
- Use GPT-4o-mini (faster than GPT-4)

#### High Memory Usage

**Solution:**
```typescript
// In meme-renderer.ts, reduce max dimension
const MAX_IMAGE_DIMENSION = 1200; // Down from 1600
```

### Content Moderation Issues

#### False Positives (Safe Content Flagged)

**Solution:**
- Review moderation categories in logs
- Adjust keyword filter if using fallback
- Temporarily disable: `SKIP_MODERATION=true` (dev only!)

#### False Negatives (Unsafe Content Passes)

**Solution:**
- Add keywords to `UNSAFE_KEYWORDS` in `moderation.ts`
- Report to OpenAI if API miscategorized
- Consider stricter thresholds

### Rate Limiting

#### Users Hitting Limits Too Quickly

**Solution:**
```bash
# Increase limits (use with caution)
RATE_LIMIT_MAX=20
RATE_LIMIT_WINDOW=3600
```

#### Rate Limits Not Working

**Issue:** In-memory store resets on serverless cold starts

**Solution:**
- Use Redis for persistent rate limiting
- Example: Upstash Redis (free tier)

---

## Scaling Considerations

### v1 Architecture (Current)

- Serverless functions (Vercel/Railway)
- In-memory rate limiting
- Synchronous processing
- Good for: 0-1000 requests/day

### v2 Architecture (Future)

For higher traffic (>1000 requests/day):

1. **Queue System**
   - Use BullMQ + Redis for async processing
   - Return job ID immediately
   - Poll for completion

2. **Caching Layer**
   - Redis for rate limiting (distributed)
   - Cache common topics/captions
   - CDN for rendered memes

3. **Database**
   - PostgreSQL for meme history
   - User accounts and preferences
   - Analytics

4. **Microservices**
   - Separate rendering service (high CPU)
   - Dedicated moderation service
   - Independent scaling

---

## Cost Estimates

### Free Tier Deployment

| Platform | Cost | Limits |
|----------|------|--------|
| Vercel (Hobby) | $0 | 100GB bandwidth, 100 hours compute |
| Railway (Free) | $0 | $5 monthly credit (~50-100 generations) |
| OpenAI (Pay-as-you-go) | ~$0.01/generation | GPT-4o-mini + moderation |

**Expected:** ~$0-5/month for low traffic demo

### Production Deployment

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| Vercel Pro | $20 | Better limits, team features |
| OpenAI API | $10-100 | Depends on traffic |
| Redis (Upstash) | $0-10 | For rate limiting |
| Domain | $10-15 | .com domain |

**Expected:** ~$40-145/month for 1000-10000 requests

---

## Security Checklist

Pre-launch security review:

- [ ] Environment variables not in Git
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] Content moderation enabled
- [ ] Rate limiting active
- [ ] Security headers set (see `vercel.json`)
- [ ] No API keys in client-side code
- [ ] File upload validation working
- [ ] Error messages don't leak secrets

---

## Rollback Procedure

If something goes wrong:

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Railway
- Go to Deployments
- Click previous successful deployment
- Click "Redeploy"

### Docker
```bash
# Keep previous image tagged
docker tag meme-factory:latest meme-factory:backup

# Rollback
docker stop meme-factory
docker rm meme-factory
docker run -d ... meme-factory:backup
```

---

## Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/meme-factory/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/meme-factory/discussions)
- **Email:** support@meme-factory.app

---

**Last Updated:** October 15, 2025

