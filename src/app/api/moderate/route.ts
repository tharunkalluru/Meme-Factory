import { NextRequest, NextResponse } from 'next/server';
import { moderateText } from '@/lib/moderation';
import { ModerateRequest, ModerateResponse } from '@/types/meme';

export async function POST(request: NextRequest) {
  try {
    const body: ModerateRequest = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const result = await moderateText(text);

    const response: ModerateResponse = {
      flagged: result.flagged,
      categories: result.categories,
      safe: result.safe,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Moderation error:', error);
    return NextResponse.json(
      { error: 'Moderation failed' },
      { status: 500 }
    );
  }
}

