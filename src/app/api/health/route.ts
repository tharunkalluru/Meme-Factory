import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      ai_provider: 'Google Gemini',
      services: {
        llm: process.env.GEMINI_API_KEY ? 'configured' : 'missing_key',
        moderation: process.env.GEMINI_API_KEY ? 'configured' : 'missing_key',
      },
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

