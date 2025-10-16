# Setup Guide - Meme Factory

Quick start guide to get Meme Factory running locally in under 5 minutes.

## Prerequisites

- Node.js 18 or higher ([download](https://nodejs.org/))
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Step-by-Step Setup

### 1. Clone or Download

```bash
# If using Git
git clone https://github.com/yourusername/meme-factory.git
cd meme-factory

# Or download ZIP and extract
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js (web framework)
- React (UI library)
- Sharp (image processing)
- OpenAI (AI API client)
- TypeScript and other dev tools

**Time: ~2-3 minutes**

### 3. Get Impact Font

The Impact font is required for classic meme styling. 

**Option A: System Font (Mac/Windows)**
```bash
# Create fonts directory
mkdir -p public/fonts

# Mac: Copy from system
cp /System/Library/Fonts/Supplemental/Impact.ttf public/fonts/

# Windows: Copy from system (run in PowerShell)
# Copy-Item "C:\Windows\Fonts\Impact.ttf" -Destination "public\fonts\"

# Linux: Install ttf-mscorefonts-installer
sudo apt-get install ttf-mscorefonts-installer
cp /usr/share/fonts/truetype/msttcorefonts/Impact.ttf public/fonts/
```

**Option B: Download Alternative**

If Impact isn't available, download a free alternative:

1. Visit [Google Fonts](https://fonts.google.com/)
2. Download "Anton" or "Oswald" (Impact-like fonts)
3. Save as `public/fonts/Impact.ttf`

**Note:** The app will work with any bold sans-serif font, but Impact is traditional.

### 4. Set Up Environment Variables

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local and add your OpenAI API key
# Use your preferred text editor:
nano .env.local
# or
code .env.local
# or
vim .env.local
```

Add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**How to get an OpenAI API key:**

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-proj-`)
6. Paste it in `.env.local`

**Cost:** GPT-4o-mini is very cheap (~$0.01 per meme generation)

### 5. Start Development Server

```bash
npm run dev
```

You should see:
```
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

### 6. Test the App

1. Open browser to [http://localhost:3000](http://localhost:3000)
2. Drag and drop an image or click to upload
3. Enter a topic (e.g., "Monday mornings")
4. Click "Generate Memes"
5. Wait ~10-15 seconds
6. See your three memes! 🎉

---

## Common Issues

### Issue: "Cannot find module 'sharp'"

**Solution:**
```bash
npm install --save sharp
npm run dev
```

### Issue: "OpenAI API key not found"

**Solution:**
- Check that `.env.local` exists (not `.env.example`)
- Verify the key starts with `sk-proj-`
- Restart the dev server after adding the key

### Issue: "Font file not found"

**Solution:**
```bash
# Check if font exists
ls public/fonts/Impact.ttf

# If not, copy from system (Mac)
cp /System/Library/Fonts/Supplemental/Impact.ttf public/fonts/
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the process using port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## Verification Checklist

Before considering setup complete:

- [ ] `npm run dev` starts without errors
- [ ] App loads at http://localhost:3000
- [ ] Can upload PNG/JPG image
- [ ] Can enter topic
- [ ] Can generate memes (test with simple topic)
- [ ] All 3 memes render correctly
- [ ] Can download individual meme
- [ ] Can download collage
- [ ] No console errors (press F12 in browser)

---

## Next Steps

### Development

- Read [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) for full requirements
- Check [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for technical details
- Review [docs/API.md](./docs/API.md) for API documentation

### Customization

- Edit `src/lib/llm-client.ts` to modify AI prompt
- Edit `src/lib/meme-renderer.ts` to change text styling
- Edit `src/components/` to customize UI
- Edit `.env.local` to change rate limits, watermark, etc.

### Production Deployment

- Follow [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for deployment guides
- Recommended: Vercel (easiest for Next.js)
- Alternative: Railway, Docker, or any Node.js host

---

## Quick Test Script

Save this as `test.sh` to quickly verify setup:

```bash
#!/bin/bash

echo "🧪 Testing Meme Factory setup..."

# Check Node version
echo "Checking Node.js version..."
node -v | grep -E "v1[89]\.|v[2-9][0-9]\." || {
  echo "❌ Node.js 18+ required"
  exit 1
}
echo "✅ Node.js version OK"

# Check if dependencies installed
echo "Checking dependencies..."
[ -d "node_modules" ] || {
  echo "❌ Dependencies not installed. Run: npm install"
  exit 1
}
echo "✅ Dependencies installed"

# Check if font exists
echo "Checking Impact font..."
[ -f "public/fonts/Impact.ttf" ] || {
  echo "⚠️  Impact font not found at public/fonts/Impact.ttf"
  echo "   Copy from system or use alternative font"
}

# Check if .env.local exists
echo "Checking environment variables..."
[ -f ".env.local" ] || {
  echo "❌ .env.local not found. Run: cp .env.example .env.local"
  exit 1
}

# Check if API key is set
grep -q "sk-proj-" .env.local || {
  echo "❌ OpenAI API key not set in .env.local"
  exit 1
}
echo "✅ Environment configured"

echo ""
echo "🎉 Setup looks good! Run: npm run dev"
```

Make it executable:
```bash
chmod +x test.sh
./test.sh
```

---

## Development Workflow

### Daily Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Make changes to code
# Files auto-reload on save

# 3. Test in browser
# http://localhost:3000

# 4. Check for errors
npm run lint
npm run type-check

# 5. Commit changes
git add .
git commit -m "feat: your feature description"
```

### Before Committing

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build test
npm run build
```

---

## Getting Help

- **Documentation:** Check all `.md` files in project root and `docs/`
- **Issues:** [GitHub Issues](https://github.com/yourusername/meme-factory/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/meme-factory/discussions)
- **Email:** setup-help@meme-factory.app

---

## Optional Enhancements

### VS Code Setup

Install recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Error Translator

### Git Hooks (Pre-commit Checks)

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

### Better Logging

```bash
npm install pino pino-pretty
```

Then use in development:
```bash
npm run dev | pino-pretty
```

---

**Setup complete! Start building amazing memes! 🎨**

Last Updated: October 15, 2025

