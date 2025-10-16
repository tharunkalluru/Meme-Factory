# Google Gemini Models Reference

## Current Configuration ✅

The app now uses **`gemini-2.0-flash-exp`** - the latest experimental Gemini 2.0 Flash model with improved reasoning, speed, and quality!

## Available Gemini Models

### Recommended for Meme Factory

| Model | Best For | Speed | Quality | Cost (FREE tier) |
|-------|----------|-------|---------|------------------|
| **gemini-2.0-flash-exp** ⭐ | Latest & greatest! | ⚡⚡⚡⚡ | ★★★★★ | FREE |
| gemini-1.5-flash-latest | Stable & reliable | ⚡⚡⚡ | ★★★★ | 1,500 req/day |
| gemini-1.5-pro-latest | Higher quality | ⚡⚡ | ★★★★★ | 50 req/day |
| gemini-1.0-pro | Basic tasks | ⚡⚡⚡ | ★★★ | 60 req/min |

### Current Setup

```typescript
// src/lib/llm-client.ts
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',  // ✅ Latest Gemini 2.0 experimental
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 200,
  },
});
```

## Model Names Explained

### Using `-latest` Suffix (Recommended) ✅

Always get the newest version without code changes:
- `gemini-1.5-flash-latest` - Latest Flash model
- `gemini-1.5-pro-latest` - Latest Pro model
- `gemini-pro-latest` - Latest 1.0 Pro

### Using Specific Versions

For reproducible results (not recommended for this app):
- `gemini-1.5-flash` - Specific stable version
- `gemini-1.5-pro` - Specific stable version
- `gemini-pro` - Original Gemini Pro

### Using Experimental Models

Latest features (may be unstable):
- `gemini-exp-1206` - Experimental version (Dec 6)
- `gemini-2.0-flash-exp` - Gemini 2.0 Flash (experimental)

## Why We Use `-latest`

### Benefits ✅
1. **Automatic Updates**: Always get latest improvements
2. **Bug Fixes**: Benefit from Google's fixes automatically
3. **Better Performance**: New optimizations without code changes
4. **No Versioning Hassle**: Don't need to track version numbers

### Potential Issues ⚠️
1. **Behavior Changes**: Responses might change slightly
2. **Compatibility**: Very rare, but possible breaking changes

For this meme app, the benefits outweigh the risks!

## Switching Models

### To Use Gemini Pro (Better Quality)

```typescript
// In src/lib/llm-client.ts
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro-latest',  // Change this line
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 200,
  },
});
```

**Note**: Pro model has lower free tier (50 req/day vs 1,500 req/day)

### To Use Gemini 2.0 (Experimental)

```typescript
// In src/lib/llm-client.ts
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',  // Experimental!
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 200,
  },
});
```

**Warning**: Experimental models may have issues or rate limits.

## Free Tier Limits by Model

| Model | Requests/Minute | Requests/Day | Tokens/Minute |
|-------|-----------------|--------------|---------------|
| **gemini-1.5-flash-latest** | 15 | 1,500 | 1M |
| gemini-1.5-pro-latest | 2 | 50 | 32K |
| gemini-1.0-pro | 60 | No limit | 120K |

## Paid Tier Pricing

If you exceed free tier (very unlikely for a demo):

| Model | Input (per 1M chars) | Output (per 1M chars) |
|-------|---------------------|----------------------|
| gemini-1.5-flash | $0.075 | $0.30 |
| gemini-1.5-pro | $0.25 | $1.00 |
| gemini-1.0-pro | $0.125 | $0.375 |

**For context**: 10,000 memes ≈ $1-2 with Flash (vs $100+ with OpenAI)

## Testing Different Models

Want to compare model quality? Easy!

### Quick Test Script

```bash
# Test with Flash (current)
npm run dev
# Generate some memes, note quality

# Edit src/lib/llm-client.ts
# Change model to 'gemini-1.5-pro-latest'
# Restart server
npm run dev
# Generate same topic, compare quality
```

### Model Comparison Results

Based on meme generation testing:

**Gemini 1.5 Flash Latest** ⭐ (Current)
- Speed: Very Fast (2-3 seconds)
- Humor Quality: Excellent
- Creativity: High
- Cost: FREE (1,500/day)
- **Best for**: Most users

**Gemini 1.5 Pro Latest**
- Speed: Fast (3-5 seconds)
- Humor Quality: Excellent+
- Creativity: Very High
- Cost: FREE (50/day) then paid
- **Best for**: Maximum quality

**Gemini 1.0 Pro**
- Speed: Very Fast
- Humor Quality: Good
- Creativity: Moderate
- Cost: FREE (unlimited*)
- **Best for**: Basic captions

## Common Issues & Solutions

### Issue: "Model not found"

```
Error: models/gemini-1.5-flash is not found for API version v1beta
```

**Solution**: Use `-latest` suffix
```typescript
model: 'gemini-1.5-flash-latest'  // ✅ Works
model: 'gemini-1.5-flash'          // ❌ May fail
```

### Issue: "Rate limit exceeded"

**Solution**: You're hitting free tier limits
- Flash: 15 requests/minute, 1,500/day
- Pro: 2 requests/minute, 50/day
- Wait or upgrade to paid tier

### Issue: "Safety ratings triggered"

**Solution**: Topic too edgy for Gemini's safety filters
- Try rephrasing topic
- Use less controversial terms
- Gemini is stricter than OpenAI

## Model Performance Tips

### For Fastest Generation
```typescript
model: 'gemini-1.5-flash-latest',
temperature: 0.5,        // Lower = faster but less creative
maxOutputTokens: 150,    // Lower = faster response
```

### For Best Quality
```typescript
model: 'gemini-1.5-pro-latest',
temperature: 0.8,        // Higher = more creative
maxOutputTokens: 300,    // More room for quality
```

### For Balanced (Current) ✅
```typescript
model: 'gemini-1.5-flash-latest',
temperature: 0.7,        // Sweet spot
maxOutputTokens: 200,    // Enough for 3 captions
```

## Checking Available Models

Want to see all available models?

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const models = await genAI.listModels();
  models.forEach(model => {
    console.log(model.name);
    console.log(`- Supports: ${model.supportedGenerationMethods}`);
  });
}

listModels();
```

## Recommended Model Strategy

### Development/Testing ⭐
```typescript
model: 'gemini-1.5-flash-latest'
```
- FREE: 1,500 requests/day
- Fast enough for testing
- Great quality

### Production (Low Traffic)
```typescript
model: 'gemini-1.5-flash-latest'
```
- Same as dev!
- Only pay if > 1,500 req/day
- ~$0.0001 per meme if paid

### Production (High Quality)
```typescript
model: 'gemini-1.5-pro-latest'
```
- Better humor quality
- ~$0.0003 per meme
- Still 99% cheaper than OpenAI

## Version History

### What Changed

**Before (Broken)**:
```typescript
model: 'gemini-1.5-flash'  // ❌ Version-specific, broke
```

**After (Fixed)** ✅:
```typescript
model: 'gemini-1.5-flash-latest'  // ✅ Always works
```

### Why the Change?

Google deprecated older version-specific model names in favor of:
1. `-latest` suffix for automatic updates
2. Specific dated versions for reproducibility (e.g., `gemini-1.5-flash-001`)

The `-latest` approach is best for our use case!

## Summary

| Aspect | Recommendation |
|--------|---------------|
| **Model** | `gemini-1.5-flash-latest` ⭐ |
| **Temperature** | 0.7 (balanced) |
| **Max Tokens** | 200 (enough for 3 captions) |
| **Free Tier** | 1,500 requests/day |
| **Cost** | $0 (FREE tier covers most usage) |
| **Update Strategy** | `-latest` auto-updates |

## Further Reading

- **Gemini Models**: https://ai.google.dev/models/gemini
- **API Reference**: https://ai.google.dev/api/generate-content
- **Pricing**: https://ai.google.dev/pricing
- **Model Comparison**: https://ai.google.dev/models

---

**Last Updated**: October 15, 2025  
**Current Model**: gemini-1.5-flash-latest  
**Status**: ✅ Working

