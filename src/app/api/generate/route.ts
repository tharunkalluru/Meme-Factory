import { NextRequest, NextResponse } from 'next/server';
import { generateCaptions } from '@/lib/llm-client';
import { moderateText, moderateMultipleTexts } from '@/lib/moderation';
import { renderMeme, createCollage } from '@/lib/meme-renderer';
import { checkRateLimit } from '@/lib/rate-limiter';
import { GenerateRequest, GenerateResponse, ErrorResponse } from '@/types/meme';

const WATERMARK_ENABLED = process.env.ENABLE_WATERMARK !== 'false';
const WATERMARK_TEXT = process.env.WATERMARK_TEXT || 'meme-factory.app';

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function base64ToBuffer(base64: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

function bufferToBase64(buffer: Buffer, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    console.log(`Request from IP: ${clientIP}`);

    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000);
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `You've reached the hourly limit. Try again in ${Math.ceil(retryAfter / 60)} minutes.`,
          retryable: false,
        },
      };
      return NextResponse.json(errorResponse, {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
          'Retry-After': retryAfter.toString(),
        },
      });
    }

    // Parse request body
    const body: GenerateRequest = await request.json();
    const { image, topic, includeWatermark = WATERMARK_ENABLED, textPosition = 'top' } = body;

    // Validate inputs
    if (!image || !topic) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Both image and topic are required',
          retryable: false,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (topic.length > 120) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'TOPIC_TOO_LONG',
          message: 'Topic must be 120 characters or less',
          retryable: false,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Decode image
    let imageBuffer: Buffer;
    try {
      imageBuffer = base64ToBuffer(image);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'INVALID_IMAGE',
          message: 'Invalid image data',
          retryable: false,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check image size (5MB limit)
    if (imageBuffer.length > 5 * 1024 * 1024) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'IMAGE_TOO_LARGE',
          message: 'Image must be under 5MB',
          retryable: false,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Moderate topic
    console.log('Moderating topic...');
    const topicModeration = await moderateText(topic);
    if (!topicModeration.safe) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'CONTENT_FLAGGED',
          message: "Let's keep this safe for everyone. Please try a different topic!",
          retryable: false,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Generate captions with LLM
    console.log('Generating captions...');
    const captions = await generateCaptions(topic);

    // Moderate generated captions
    console.log('Moderating generated captions...');
    const captionTexts = captions.map(c => c.text);
    const captionsSafe = await moderateMultipleTexts(captionTexts);
    
    if (!captionsSafe) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'GENERATED_CONTENT_FLAGGED',
          message: "Our system couldn't generate safe content for this topic. Try something else!",
          retryable: true,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Render memes in parallel
    console.log('Rendering memes...');
    const renderOptions = {
      fontPath: '', // Font path not needed, Sharp uses system fonts
      position: textPosition,
      watermark: {
        text: WATERMARK_TEXT,
        enabled: includeWatermark,
      },
    };

    const memeBuffers = await Promise.all(
      captions.map(caption => renderMeme(imageBuffer, caption.text, renderOptions))
    );

    // Create collage
    console.log('Creating collage...');
    const collageBuffer = await createCollage(memeBuffers);

    // Convert to base64 for response
    const memes = captions.map((caption, index) => ({
      id: `meme-${index}-${Date.now()}`,
      tone: caption.tone,
      caption: caption.text,
      imageUrl: bufferToBase64(memeBuffers[index]),
    }));

    const collageUrl = bufferToBase64(collageBuffer);

    const generationTime = Date.now() - startTime;
    console.log(`Generation completed in ${generationTime}ms`);

    const response: GenerateResponse = {
      success: true,
      memes,
      collageUrl,
      generationTime,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
      },
    });
  } catch (err) {
    console.error('Generation error:', err);

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'GENERATION_FAILED',
        message: err instanceof Error ? err.message : 'Generation failed. Please try again.',
        retryable: true,
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

