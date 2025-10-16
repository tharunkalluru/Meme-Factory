import { GoogleGenerativeAI } from '@google/generative-ai';
import { Caption, LLMResponse } from '@/types/meme';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are a meme caption generator. Your ONLY output is valid JSON.
Return exactly 3 short, witty captions for the given topic.
Each caption must be safe-for-work and under 60 characters.
Use these three tones in order: sarcastic, wholesome, dark humor.

Output format:
{
  "captions": [
    {"tone": "sarcastic", "text": "caption here"},
    {"tone": "wholesome", "text": "caption here"},
    {"tone": "dark_humor", "text": "caption here"}
  ]
}

Rules:
- NO explanations or additional text
- NO offensive, hateful, or NSFW content
- Keep each caption punchy and meme-appropriate
- Use classic meme language and structure
- Transform to ALL CAPS automatically`;

export async function generateCaptions(topic: string): Promise<Caption[]> {
  const startTime = Date.now();

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    const prompt = `${SYSTEM_PROMPT}

Topic: ${topic}

Generate 3 meme captions (max 60 chars each) with the required tones. Be witty but family-friendly.

Return ONLY valid JSON, nothing else:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up the response - Gemini might include markdown code blocks
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const parsedResult: LLMResponse = JSON.parse(cleanedText);
    
    // Validate response structure
    if (!parsedResult.captions || !Array.isArray(parsedResult.captions) || parsedResult.captions.length !== 3) {
      throw new Error('Invalid response structure');
    }

    // Validate each caption
    for (const caption of parsedResult.captions) {
      if (!caption.tone || !caption.text) {
        throw new Error('Invalid caption structure');
      }
      if (caption.text.length > 70) {
        caption.text = caption.text.substring(0, 67) + '...';
      }
    }

    const duration = Date.now() - startTime;
    console.log(`Gemini API call completed in ${duration}ms`);

    return parsedResult.captions;
  } catch (error) {
    console.error('Gemini generation error:', error);
    
    // Retry once with simplified prompt
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('JSON'))) {
      console.log('Retrying with simplified prompt...');
      return retryGeneration(topic);
    }

    throw error;
  }
}

async function retryGeneration(topic: string): Promise<Caption[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    const prompt = `Create 3 short meme captions about: "${topic}"

Return ONLY this JSON format, nothing else:
{
  "captions": [
    {"tone": "sarcastic", "text": "YOUR SARCASTIC CAPTION HERE"},
    {"tone": "wholesome", "text": "YOUR WHOLESOME CAPTION HERE"},
    {"tone": "dark_humor", "text": "YOUR DARK HUMOR CAPTION HERE"}
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Clean up response
    let cleanedText = text;
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const parsedResult: LLMResponse = JSON.parse(cleanedText);
    return parsedResult.captions;
  } catch (retryError) {
    console.error('Retry failed:', retryError);
    throw new Error('Failed to generate captions after retry');
  }
}
