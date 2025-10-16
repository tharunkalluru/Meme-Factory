# Debugging Guide - Meme Factory

## Current Error: 500 Internal Server Error

### Error Details
- **Endpoint**: POST /api/generate
- **Status**: 500 (Internal Server Error)
- **UI Message**: "Failed to render meme"

### Root Cause

You're seeing this error because:

1. **Missing Real API Key**: The `.env.local` file has `GEMINI_API_KEY=test-key-placeholder`
2. **Moderation Skipped**: `SKIP_MODERATION=true` allows the app to start but generation needs real API

### How to Fix

#### Option 1: Get FREE Gemini API Key (Recommended) ✅

1. **Visit Google AI Studio**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Sign in with Google Account**
   - No credit card required
   - Completely FREE!

3. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Select/create a project
   - Copy your key (starts with `AIza...`)

4. **Update .env.local**
   ```bash
   cd "/Users/tharun.kalluru/Desktop/tharun/Meme Factory"
   
   # Edit .env.local
   nano .env.local
   
   # Change this line:
   GEMINI_API_KEY=test-key-placeholder
   
   # To:
   GEMINI_API_KEY=AIzaSy...your-actual-key-here
   
   # Also change:
   SKIP_MODERATION=false
   ```

5. **Restart Server**
   ```bash
   # Stop current server (Ctrl+C in terminal)
   # Then restart:
   npm run dev
   ```

#### Option 2: Quick Test Without Real Generation

If you just want to test the UI without actual AI generation:

```bash
# The UI will work but generation will fail
# This is expected without a real API key
```

### Verification Steps

Once you have a real API key:

1. **Check Health Endpoint**
   ```bash
   curl http://localhost:3000/api/health
   ```
   
   Should show:
   ```json
   {
     "status": "healthy",
     "ai_provider": "Google Gemini",
     "services": {
       "llm": "configured",
       "moderation": "configured"
     }
   }
   ```

2. **Test Generation**
   - Open http://localhost:3000
   - Upload a test image (any PNG/JPG under 5MB)
   - Enter topic: "Monday mornings"
   - Click "Generate Memes"
   - Wait 5-10 seconds
   - Should see 3 memes! 🎉

### Common Errors & Solutions

#### Error: "Invalid API key"
```
Error: [400 Invalid Argument] API key not valid
```

**Solution**: 
- Verify key starts with `AIza`
- No extra spaces in .env.local
- Key is active in Google AI Studio

#### Error: "Rate limit exceeded"
```
Error: [429 Too Many Requests]
```

**Solution**:
- FREE tier: 15 requests/minute
- Wait 60 seconds
- Check usage: https://aistudio.google.com/

#### Error: "Model not found"
```
Error: models/gemini-2.0-flash-exp is not found
```

**Solution**:
- Model name might have changed
- Try: `gemini-1.5-flash-latest` (stable)
- Or: `gemini-pro` (basic)

#### Error: "Failed to render meme" (Current Issue)
```
POST /api/generate 500 (Internal Server Error)
```

**Solutions**:
1. **Add real API key** (see Option 1 above)
2. **Check server logs**:
   ```bash
   # Look at terminal where you ran 'npm run dev'
   # Should show actual error message
   ```
3. **Check font file**:
   ```bash
   ls -la public/fonts/Impact.ttf
   # Should show file exists
   ```

### Debugging Checklist

When generation fails, check:

- [ ] Real Gemini API key in .env.local
- [ ] SKIP_MODERATION=false (for production)
- [ ] Server restarted after .env.local changes
- [ ] Impact font exists: `public/fonts/Impact.ttf`
- [ ] Image is PNG/JPG and under 5MB
- [ ] Topic is under 120 characters
- [ ] No network issues (check console)
- [ ] Check server terminal for error logs

### Getting More Help

#### View Server Logs
```bash
# Terminal where you ran 'npm run dev' shows:
# - API calls
# - Error messages
# - Generation progress
# - Timing information
```

#### Check Browser Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for failed requests
```

#### Enable Verbose Logging

Edit `src/lib/llm-client.ts` and add:
```typescript
console.log('Calling Gemini with topic:', topic);
console.log('API Key present:', !!process.env.GEMINI_API_KEY);
```

### Test Cases

#### Successful Generation (with real API key)
```
1. Upload: test-image.jpg (500KB)
2. Topic: "Monday mornings"
3. Result: 3 memes + collage in ~10 seconds
```

#### Expected Failures (without API key)
```
1. Upload image
2. Enter topic
3. Click generate
4. Result: "Failed to render meme" (this is expected!)
```

### Model Information

**Current Model**: `gemini-2.0-flash-exp`

**Available Models**:
- `gemini-2.0-flash-exp` - Latest experimental (what you're using)
- `gemini-1.5-flash-latest` - Stable, 1,500 req/day FREE
- `gemini-1.5-pro-latest` - Higher quality, 50 req/day FREE

**Note**: There is no "Gemini 2.5" yet. Gemini 2.0 is the latest!

To change model:
```typescript
// In src/lib/llm-client.ts
model: 'gemini-1.5-flash-latest'  // More stable
// or
model: 'gemini-2.0-flash-exp'     // Latest (current)
```

### Quick Fix Commands

```bash
# 1. Get to project directory
cd "/Users/tharun.kalluru/Desktop/tharun/Meme Factory"

# 2. Check if server is running
ps aux | grep "next dev"

# 3. Stop server if running
pkill -f "next dev"

# 4. Update environment (add your real key!)
echo "GEMINI_API_KEY=AIzaSy...your-key" > .env.local
echo "SKIP_MODERATION=false" >> .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# 5. Restart server
npm run dev

# 6. Test in browser
open http://localhost:3000
```

### Success Indicators

You'll know it's working when:

✅ Health check returns "healthy"
✅ Server logs show "LLM call completed in XXms"
✅ Browser shows 3 generated memes
✅ Download buttons work
✅ Collage is created
✅ No errors in console

### Still Not Working?

If you've added a real API key and it still fails:

1. **Check API Key Validity**
   ```bash
   curl -H "Content-Type: application/json" \
        -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
        -H "x-goog-api-key: YOUR_API_KEY" \
        https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
   ```

2. **Try Simpler Model**
   - Edit `src/lib/llm-client.ts`
   - Change to: `model: 'gemini-1.5-flash-latest'`
   - Restart server

3. **Check Google AI Studio**
   - Visit: https://aistudio.google.com/
   - Verify API key is active
   - Check quota/usage

4. **Review Full Error**
   - Look at server terminal
   - Note exact error message
   - Search docs: https://ai.google.dev/docs

---

**Need immediate help?**
- Docs: See README.md, GEMINI_SETUP.md
- API Status: http://localhost:3000/api/health
- Server Logs: Terminal where you ran `npm run dev`

**Remember**: The app needs a REAL Gemini API key to generate memes!
Get yours FREE at: https://aistudio.google.com/app/apikey

---

Last Updated: October 15, 2025

