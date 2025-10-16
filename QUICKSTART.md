# Quick Start - Meme Factory

Get up and running in 5 minutes! ⚡

## 1. Install Dependencies

```bash
npm install
```

## 2. Add Impact Font

```bash
# Mac
mkdir -p public/fonts
cp /System/Library/Fonts/Supplemental/Impact.ttf public/fonts/

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "public\fonts"
Copy-Item "C:\Windows\Fonts\Impact.ttf" -Destination "public\fonts\"

# Linux
sudo apt-get install ttf-mscorefonts-installer
mkdir -p public/fonts
cp /usr/share/fonts/truetype/msttcorefonts/Impact.ttf public/fonts/
```

## 3. Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit and add your OpenAI API key
nano .env.local
```

Add this line:
```
OPENAI_API_KEY=sk-proj-your-key-here
```

Get your API key: https://platform.openai.com/api-keys

## 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 🚀

## 5. Test It Out

1. Upload an image (PNG/JPG, under 5MB)
2. Enter a topic: "Monday mornings"
3. Click "Generate Memes"
4. Wait ~10-15 seconds
5. Download your memes! 🎉

---

## Common Issues

### "Cannot find module 'sharp'"
```bash
npm install --save sharp
```

### "OpenAI API key not found"
- Check `.env.local` exists (not `.env.example`)
- Restart dev server after adding key

### "Font file not found"
- Verify file exists: `ls public/fonts/Impact.ttf`
- Restart dev server

---

## Need Help?

- See [SETUP.md](./SETUP.md) for detailed instructions
- Check [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) for full documentation
- Open an issue on GitHub

---

**Ready to deploy?** See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

