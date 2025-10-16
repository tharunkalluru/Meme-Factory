# Frequently Asked Questions

## General Questions

### What is Meme Factory?

Meme Factory is a web app that uses AI to generate three different memes (sarcastic, wholesome, and dark humor) from any image and topic you provide.

### Is it free?

The app itself is open source and free to use. However, you'll need an OpenAI API key which costs about $0.01 per meme generation using GPT-4o-mini.

### How does it work?

1. You upload an image and enter a topic
2. GPT-4o-mini generates three captions with different tones
3. The app overlays text on your image with classic meme styling
4. You get 3 individual memes plus a collage for social media

### What makes the tones different?

- **Sarcastic**: Ironic, cynical humor
- **Wholesome**: Positive, uplifting messages
- **Dark Humor**: Edgy, slightly cynical jokes (but still safe for work)

---

## Usage Questions

### What image formats are supported?

PNG and JPG only. Maximum file size is 5MB.

### Why is there a 5MB limit?

To keep processing fast and reduce server load. Most images work great at 2-3MB.

### Can I upload GIFs or videos?

Not in v1. This may be added in future versions.

### What's the character limit for topics?

120 characters. This keeps captions focused and generation fast.

### How long does generation take?

Typically 10-15 seconds on free-tier hosting. Breakdown:
- LLM generation: 3-5 seconds
- Image processing: 3-5 seconds
- Moderation: 2-3 seconds
- Network: 2-4 seconds

### Can I generate more than 3 memes?

Yes! Click "Generate More" to get new captions for the same image.

### Can I edit the generated captions?

Not in v1. You can only regenerate. Manual editing may be added later.

---

## Technical Questions

### What AI model does it use?

GPT-4o-mini from OpenAI. It's fast, affordable, and produces great results.

### Why GPT-4o-mini and not GPT-4?

- **Speed**: 2-3x faster
- **Cost**: 10x cheaper (~$0.15 per million tokens)
- **Quality**: Excellent for short-form content like meme captions

### Is my data stored anywhere?

No! v1 has no database. Images and captions are processed in memory and immediately discarded.

### Is content moderated?

Yes! Both your topic and generated captions are checked using OpenAI's Moderation API to keep content safe for work.

### What happens if moderation flags my content?

You'll see a friendly error message asking you to try a different topic. No judgment!

### Can I disable moderation?

Only in development mode (`SKIP_MODERATION=true` in `.env.local`). Never disable in production.

### What's the rate limit?

10 requests per hour per IP address. This prevents abuse and keeps costs manageable.

### Can I increase the rate limit?

Yes! Set `RATE_LIMIT_MAX` in your environment variables. Use responsibly.

### Why do I see "Rate limit exceeded"?

You've made 10 requests in the past hour. Wait for the reset time shown in the error message.

---

## Deployment Questions

### Where can I deploy it?

- **Vercel** (recommended for Next.js)
- **Railway** (good for containers)
- **Render**
- **Fly.io**
- **Your own server** (Docker)

See [docs/DEPLOYMENT.md](./DEPLOYMENT.md) for guides.

### What does it cost to host?

**Free tier options:**
- Vercel Hobby: Free (100GB bandwidth/month)
- Railway: $5 credit/month
- OpenAI: Pay-per-use (~$0.01 per generation)

**Paid hosting:**
- Vercel Pro: $20/month
- Railway: ~$5-10/month
- OpenAI: Scales with usage

### What are the server requirements?

- Node.js 18+
- 512MB RAM minimum
- 1GB RAM recommended (for image processing)
- ~100MB disk space

### Can it handle high traffic?

v1 is designed for demos and low-to-medium traffic. For high traffic:
- Use Vercel Pro (better scaling)
- Add Redis for rate limiting
- Consider queueing system (BullMQ)
- Cache common requests

### How do I monitor it?

- Use `/api/health` endpoint for uptime monitoring
- Check Vercel/Railway logs for errors
- Consider adding Sentry for error tracking

---

## Customization Questions

### Can I change the font?

Yes! Replace `public/fonts/Impact.ttf` with any TrueType font. Update `FONT_PATH` in `meme-renderer.ts` if needed.

### Can I add more tones?

Yes! Edit the prompt in `src/lib/llm-client.ts`. Update types in `src/types/meme.ts` and UI accordingly.

### Can I change text position?

Yes! There's an optional `textPosition` parameter ("top" or "bottom"). You can add a toggle in the UI.

### Can I customize the watermark?

Yes! Set `WATERMARK_TEXT` in `.env.local`. Toggle with `ENABLE_WATERMARK`.

### Can I change the LLM prompt?

Yes! Edit `SYSTEM_PROMPT` in `src/lib/llm-client.ts`. Be careful to maintain JSON output format.

### Can I use a different AI provider?

Yes, but requires code changes:
- Anthropic Claude: Similar API to OpenAI
- Google Gemini: Different API structure
- Ollama (local): No API costs, requires beefy server

---

## Troubleshooting Questions

### Why are my memes blank?

Possible causes:
- Font file missing or corrupted
- SVG rendering issue
- Image format not supported

Solution: Check `public/fonts/Impact.ttf` exists and restart server.

### Why is text unreadable?

Possible causes:
- Image too bright/dark
- Font size too small
- Stroke width insufficient

Solution: Try a different image or adjust font size in `meme-renderer.ts`.

### Why does generation fail sometimes?

Possible causes:
- OpenAI API timeout
- Content moderation flagged
- Image too large
- Network issues

Solution: Check error message, try again, or use different topic/image.

### Why are captions not funny?

AI humor varies! Try:
- More specific topics
- Different phrasing
- "Generate More" for alternatives
- Different images (facial expressions help)

### Why does the collage look weird?

Possible causes:
- Very different image aspect ratios
- One meme failed to render

Solution: Use images with similar aspect ratios.

---

## Contributing Questions

### Can I contribute?

Yes! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### What needs work?

Check GitHub Issues for:
- Bug reports
- Feature requests
- Documentation improvements
- Performance optimizations

### How do I report a bug?

1. Check if it's already reported
2. Create a GitHub Issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Can I suggest features?

Absolutely! Open a GitHub Discussion with:
- Use case
- Why it's valuable
- Possible implementation

---

## API Questions

### Is there a public API?

The API routes are designed for the web UI, but you can use them directly. See [docs/API.md](./API.md).

### Do I need authentication?

No! v1 uses IP-based rate limiting only.

### Can I integrate it into my app?

Yes! The API is simple REST. Just respect rate limits and attribution.

### Can I self-host the API separately?

Yes! Deploy the Next.js app and use only the API routes. CORS is configured for same-origin only by default.

---

## License Questions

### What's the license?

MIT License. See [LICENSE](../LICENSE).

### Can I use it commercially?

Yes! MIT allows commercial use.

### Can I modify it?

Yes! You can modify, fork, and distribute as long as you include the original license.

### Do I need to credit you?

Not required, but appreciated! A link back to the project helps others discover it.

---

## Future Plans

### Will there be a v2?

Maybe! Potential v2 features:
- User accounts
- Meme history
- More fonts and styles
- Animated GIF support
- Social sharing integrations
- Mobile app

### Can I sponsor development?

GitHub Sponsors may be added in the future. For now, starring the repo and sharing it helps!

### How can I stay updated?

- Watch the GitHub repo
- Follow release notes
- Join GitHub Discussions

---

## Security Questions

### Is my API key safe?

Yes, if you follow best practices:
- Never commit `.env.local` to Git
- Use environment variables in production
- Rotate keys regularly
- Monitor usage in OpenAI dashboard

### Can users access my API key?

No. It's only used server-side in API routes. Client-side code never sees it.

### What about HTTPS?

Automatic on Vercel, Railway, and most hosts. Always use HTTPS in production.

### Are uploaded images secure?

Images are processed in memory and never stored. However, they do pass through your server, so hosting on trusted infrastructure is recommended.

---

## Cost Questions

### How much does it cost per meme?

Approximately $0.01 USD:
- GPT-4o-mini: ~$0.008
- Moderation API: ~$0.002
- Infrastructure: Negligible on free tier

### What if I go viral?

Monitor your OpenAI usage dashboard! Set billing limits to prevent surprises.

### Can I monetize it?

Yes, under MIT license. Ideas:
- Premium features (more generations/hour)
- Custom fonts/styles
- White-label solutions
- API access for businesses

---

## Still Have Questions?

- **Documentation**: Check all `.md` files
- **Issues**: [GitHub Issues](https://github.com/yourusername/meme-factory/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/meme-factory/discussions)
- **Email**: faq@meme-factory.app

---

**Last Updated**: October 15, 2025

