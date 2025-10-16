# 🎨 Meme Factory

> Transform any image into three hilarious memes with different tones — instantly.

A simple web app that generates three memes (sarcastic, wholesome, dark humor) from your uploaded image and topic. Download individually or as a 3-up collage for social posting.

![Meme Factory Demo](./docs/demo.png)

## ✨ Features

### Core Features
- **📤 Image Upload**: PNG/JPG, up to 5MB with drag & drop
- **🎯 Topic Input**: Describe your meme in 120 characters (with preset suggestions)
- **🎭 Three Tones**: Sarcastic, Wholesome, Dark Humor (each with unique gradients)
- **🤖 AI-Powered**: Google Gemini 2.5 Flash generates contextual captions
- **🎨 Classic Styling**: White text + black outline (Impact font)
- **⬇️ Easy Downloads**: Individual memes + 3-up collage
- **🛡️ Content Moderation**: AI-powered safety checks
- **⚡ Rate Limiting**: 10 requests/hour per IP
- **💰 FREE**: Gemini's generous free tier (1,500 requests/day)

### Modern UI/UX
- **🎨 Beautiful Design**: Modern gradients, shadows, and glass effects
- **✨ Smooth Animations**: 8+ custom animations for delightful interactions
- **📊 Progress Tracking**: Visual progress bar and step indicators
- **💡 Smart Suggestions**: 6 preset topics with one-click insertion
- **📱 Mobile-First**: Fully responsive with touch-optimized controls
- **♿ Accessible**: ARIA labels, keyboard navigation, reduced motion support
- **🎯 Intuitive Flow**: Clear visual hierarchy and contextual feedback
- **🎉 Success Feedback**: Toast notifications and celebration effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Google Gemini API key ([get FREE key here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/meme-factory.git
cd meme-factory

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local (get FREE key from https://aistudio.google.com/app/apikey)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
meme-factory/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/      # Meme generation endpoint
│   │   │   ├── moderate/      # Content moderation endpoint
│   │   │   └── health/        # Health check
│   │   ├── page.tsx           # Main UI
│   │   └── layout.tsx         # Root layout
│   ├── lib/
│   │   ├── meme-renderer.ts   # Image processing & text overlay
│   │   ├── llm-client.ts      # OpenAI integration
│   │   ├── moderation.ts      # Content filtering
│   │   └── rate-limiter.ts    # IP-based rate limiting
│   ├── components/
│   │   ├── ImageUpload.tsx    # Drag-and-drop upload
│   │   ├── TopicInput.tsx     # Topic input with counter
│   │   ├── MemeGrid.tsx       # Results display
│   │   └── LoadingSpinner.tsx # Loading state
│   └── types/
│       └── meme.ts            # TypeScript interfaces
├── public/
│   └── fonts/
│       └── Impact.ttf         # Meme font
├── docs/
│   └── ARCHITECTURE.md        # Technical architecture
├── PRODUCT_SPEC.md            # Full product specification
├── package.json
└── README.md
```

## 📖 Documentation

- **[Product Specification](./PRODUCT_SPEC.md)** - Complete v1 requirements
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Technical deep dive
- **[API Reference](./docs/API.md)** - Endpoint documentation
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production setup

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js 18 |
| **AI/LLM** | Google Gemini 1.5 Flash (FREE tier available) |
| **Image Processing** | Sharp |
| **Deployment** | Vercel (recommended) |
| **Content Safety** | Gemini AI-powered moderation |

## 🎯 Usage

1. **Upload an Image**: Drag and drop or click to select (PNG/JPG, max 5MB)
2. **Enter a Topic**: Type a short description (e.g., "Monday mornings")
3. **Generate**: Click "Generate Memes" and wait ~10-15 seconds
4. **Download**: Save individual memes or the 3-up collage

### Example Topics

- "When the WiFi drops"
- "Monday mornings"
- "Debugging at 3am"
- "Waiting for code to compile"
- "When your code works first try"

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm test

# Build for production
npm run build
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add your `GEMINI_API_KEY` in Vercel dashboard → Project Settings → Environment Variables.

### Alternative: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## ⚙️ Configuration

### Environment Variables

Create `.env.local` in the root directory:

```bash
# Required - Get FREE key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
SKIP_MODERATION=false
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=3600
ENABLE_WATERMARK=true
WATERMARK_TEXT=meme-factory.app
```

### Customization

- **Rate Limits**: Adjust `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW`
- **Watermark**: Toggle with `ENABLE_WATERMARK`, customize with `WATERMARK_TEXT`
- **Image Size**: Edit `MAX_IMAGE_DIMENSION` in `meme-renderer.ts`
- **Tones**: Modify prompt in `llm-client.ts` (requires testing)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 🎨 UI/UX Design

The Meme Factory features a completely redesigned, modern user interface with best practices:

### Design Highlights
- **🎨 Modern Gradients**: Beautiful color transitions (indigo → purple → pink)
- **✨ Smooth Animations**: 8+ custom animations (fade, slide, shake, bounce, pulse, shimmer)
- **📊 Progress Tracking**: Visual progress bar with step indicators (0/2 → 1/2 → 2/2)
- **💡 Smart Input**: Character counter, 6 preset topics, real-time validation
- **🎭 Tone-Specific Cards**: Unique gradients for Sarcastic, Wholesome, Dark Humor
- **🎉 Success Feedback**: Toast notifications with generation time
- **🖼️ Interactive Upload**: Drag & drop with hover animations and preview overlays
- **📱 Mobile-First**: Touch-optimized, responsive, performant on all devices

### Accessibility Features
- ♿ Full ARIA label support for screen readers
- ⌨️ Complete keyboard navigation
- 🔍 Clear focus indicators
- 🎭 Reduced motion support (`prefers-reduced-motion`)
- 📱 Semantic HTML structure
- 🎯 Touch-friendly targets (min 44x44px)

📖 See [UI_IMPROVEMENTS.md](./UI_IMPROVEMENTS.md) for complete details and design system documentation.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Impact font (classic meme typography)
- Google Gemini for FREE, powerful AI generation
- Sharp for lightning-fast image processing
- Vercel for seamless deployment

## 🐛 Known Issues

- Cold start latency on free-tier serverless (~2-3s)
- Very long captions (>70 chars) may wrap awkwardly
- Mobile uploads >5MB may fail on slow connections

See [GitHub Issues](https://github.com/yourusername/meme-factory/issues) for full list.

## 📊 Roadmap

### v1.0 (Current)
- ✅ Basic meme generation
- ✅ Three tone support
- ✅ Collage download
- ✅ Content moderation
- ✅ Rate limiting
- ✅ Modern UI/UX redesign
- ✅ Preset topics with suggestions
- ✅ Progress tracking
- ✅ Accessibility features

### v1.1 (Planned)
- [ ] Bottom text positioning
- [ ] Custom watermark toggle
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

### v2.0 (Future)
- [ ] Multiple font options
- [ ] Animated GIF support
- [ ] Template library
- [ ] User accounts
- [ ] Meme history

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/meme-factory/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/meme-factory/discussions)
- **Email**: support@meme-factory.app

## 🌟 Show Your Support

Give a ⭐️ if this project helped you create amazing memes!

---

**Built with ❤️ by [Your Name]**

[Website](https://meme-factory.app) • [Twitter](https://twitter.com/memefactory) • [Discord](https://discord.gg/memefactory)

