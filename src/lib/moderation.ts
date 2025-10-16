import { GoogleGenerativeAI } from '@google/generative-ai';
import { ModerationResult } from '@/types/meme';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SKIP_MODERATION = process.env.SKIP_MODERATION === 'true';

// Fallback keyword filter
const UNSAFE_KEYWORDS = [
  'kill',
  'murder',
  'suicide',
  'terrorist',
  'bomb',
  'rape',
  'nazi',
  'hitler',
  'fuck',
  'shit',
  'ass',
  'bitch',
  // Add more as needed
];

function keywordFilter(text: string): boolean {
  const lowerText = text.toLowerCase();
  return UNSAFE_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

export async function moderateText(text: string): Promise<ModerationResult> {
  // Skip moderation in development if configured
  if (SKIP_MODERATION) {
    return {
      flagged: false,
      categories: [],
      safe: true,
    };
  }

  try {
    // Use Gemini for content safety check
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image',
    });

    const prompt = `Analyze this text for inappropriate content. Check for: hate speech, harassment, violence, sexual content, self-harm, profanity.

Text: "${text}"

Respond with ONLY valid JSON in this exact format:
{
  "safe": true/false,
  "categories": ["category1", "category2"]
}

If safe, categories should be empty array. If unsafe, list specific categories found.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean up response
    let cleanedText = responseText;
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const moderationResult = JSON.parse(cleanedText);

    return {
      flagged: !moderationResult.safe,
      categories: moderationResult.categories || [],
      safe: moderationResult.safe,
    };
  } catch (error) {
    console.error('Gemini moderation error:', error);
    
    // Fallback to keyword filter
    const flagged = keywordFilter(text);
    return {
      flagged,
      categories: flagged ? ['keyword_filter'] : [],
      safe: !flagged,
    };
  }
}

export async function moderateMultipleTexts(texts: string[]): Promise<boolean> {
  const results = await Promise.all(texts.map(text => moderateText(text)));
  return results.every(result => result.safe);
}
