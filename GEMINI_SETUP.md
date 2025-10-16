# Using Google Gemini API with Meme Factory

This project has been configured to use **Google Gemini API** instead of OpenAI.

## Why Gemini?

- **Free Tier**: Generous free tier with 1,500 requests per day
- **Fast**: Gemini 1.5 Flash is extremely quick
- **Cost-Effective**: Much cheaper than OpenAI for high volume
- **Powerful**: Excellent at creative tasks like meme captions
- **No Credit Card**: Free tier doesn't require credit card

## Getting Your Gemini API Key

### Step 1: Visit Google AI Studio

Go to: **https://aistudio.google.com/app/apikey**

### Step 2: Sign In

- Sign in with your Google account
- No credit card required for free tier

### Step 3: Create API Key

1. Click **"Get API Key"** or **"Create API Key"**
2. Select or create a project
3. Click **"Create API key in new project"** or use existing
4. Copy your API key (starts with `AIza...`)

### Step 4: Add to Environment

```bash
# Edit .env.local
GEMINI_API_KEY=AIzaSy...your-actual-key-here
```

## Quick Start

```bash
# 1. Get your Gemini API key from https://aistudio.google.com/app/apikey

# 2. Update .env.local
echo "GEMINI_API_KEY=AIzaSy...your-key" > .env.local
echo "SKIP_MODERATION=false" >> .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# 3. Install dependencies (already done if you followed main setup)
npm install

# 4. Run the app
npm run dev
```

## Free Tier Limits

Google Gemini 1.5 Flash Free Tier:
- **15 requests per minute (RPM)**
- **1 million tokens per minute (TPM)**  
- **1,500 requests per day (RPD)**

This is **MORE than enough** for testing and low-traffic demos!

## Gemini vs OpenAI Comparison

| Feature | Gemini 1.5 Flash (Free) | GPT-4o-mini (Paid) |
|---------|------------------------|---------------------|
| **Cost** | FREE (1,500 req/day) | ~$0.15 per 1M tokens |
| **Speed** | Very Fast | Fast |
| **Quality** | Excellent | Excellent |
| **Free Tier** | Yes, generous | No |
| **Rate Limit** | 15 RPM | Varies by tier |
| **Best For** | Development, demos | Production at scale |

## Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=AIzaSy...

# Optional
SKIP_MODERATION=false          # Enable AI-powered moderation
RATE_LIMIT_MAX=10             # Max requests per hour
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Using Gemini 1.5 Pro (Paid Tier)

If you need more powerful responses, upgrade to Gemini 1.5 Pro:

```typescript
// In src/lib/llm-client.ts, change:
model: 'gemini-1.5-flash'
// to:
model: 'gemini-1.5-pro'
```

**Note**: Pro tier has costs (~$0.00025 per 1K chars input)

## Content Moderation with Gemini

Unlike OpenAI, Gemini doesn't have a dedicated moderation endpoint. We've implemented two approaches:

1. **AI-Powered Moderation** (when `SKIP_MODERATION=false`)
   - Uses Gemini to analyze content safety
   - Checks for: hate speech, harassment, violence, sexual content, etc.
   - More intelligent than keyword filtering

2. **Keyword Filtering** (fallback)
   - If Gemini fails, uses basic keyword blacklist
   - Fast but less accurate

## Testing

```bash
# Test with Gemini
npm run dev

# Open http://localhost:3000
# Upload image, enter topic, generate memes
```

## API Response Format

Gemini returns the same JSON structure as OpenAI:

```json
{
  "captions": [
    {"tone": "sarcastic", "text": "OH BOY, ANOTHER MEETING"},
    {"tone": "wholesome", "text": "GREAT OPPORTUNITY TO COLLABORATE"},
    {"tone": "dark_humor", "text": "PERFECT TIME FOR MY WILL UPDATE"}
  ]
}
```

## Troubleshooting

### Issue: "API key not valid"

**Solution**: 
- Verify your key starts with `AIza`
- Check it's copied correctly (no extra spaces)
- Ensure you've enabled the Generative AI API in Google Cloud

### Issue: "Rate limit exceeded"

**Solution**:
- Free tier: 15 requests per minute
- Wait 60 seconds or upgrade to paid tier
- Check usage at: https://aistudio.google.com/

### Issue: "Response not JSON"

**Solution**:
- Gemini sometimes returns markdown code blocks
- Our code automatically strips ```json and ``` markers
- If issues persist, check the retry logic in `llm-client.ts`

### Issue: "Safety ratings triggered"

**Solution**:
- Gemini has built-in safety filters
- Some topics may be blocked by Gemini's safety settings
- Try rephrasing your topic to be more neutral

## Cost Estimation

### Free Tier (Development)
- **1,500 requests/day FREE**
- Perfect for: Testing, demos, personal projects
- **Cost: $0/month**

### Paid Tier (Production)
If you exceed free tier:
- **Gemini 1.5 Flash**: $0.075 per 1M input chars (~$0.0001 per meme)
- **Gemini 1.5 Pro**: $0.25 per 1M input chars (~$0.0003 per meme)
- Still **10-100x cheaper than OpenAI**

**Example**: 10,000 memes/month
- OpenAI GPT-4o-mini: ~$100-150
- Gemini 1.5 Flash: ~$1-2
- **Savings: 99%**

## Switching Back to OpenAI

If you want to switch back to OpenAI:

1. Install OpenAI package:
   ```bash
   npm install openai
   npm uninstall @google/generative-ai
   ```

2. Update `src/lib/llm-client.ts` and `src/lib/moderation.ts`
   (restore original OpenAI code from git history)

3. Update `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-proj-...
   ```

## Additional Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Quickstart**: https://ai.google.dev/tutorials/quickstart
- **API Keys**: https://aistudio.google.com/app/apikey

## Support

For Gemini-specific issues:
- Google AI Studio: https://aistudio.google.com/
- Community: https://developers.googleblog.com/

For Meme Factory issues:
- GitHub Issues: [your-repo]/issues
- Documentation: See README.md

---

**Last Updated**: October 15, 2025  
**Gemini Version**: 1.5 Flash  
**Status**: ✅ Production Ready

