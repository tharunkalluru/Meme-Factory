import sharp from 'sharp';
import { RenderOptions } from '@/types/meme';

const MAX_IMAGE_DIMENSION = 1600;

interface TextMetrics {
  fontSize: number;
  lines: string[];
  totalHeight: number;
}

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  // Approximate character width (rough estimate for Impact font)
  const charWidth = fontSize * 0.6;
  const maxCharsPerLine = Math.floor(maxWidth / charWidth);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Limit to 3 lines
  return lines.slice(0, 3);
}

function calculateTextMetrics(
  text: string,
  imageWidth: number
): TextMetrics {
  const maxWidth = imageWidth * 0.92; // 92% of image width
  let fontSize = Math.floor(imageWidth / 12);
  const minFontSize = Math.floor(imageWidth / 20);
  
  let lines = wrapText(text, maxWidth, fontSize);
  
  // Reduce font size if too many lines
  while (lines.length > 3 && fontSize > minFontSize) {
    fontSize -= 2;
    lines = wrapText(text, maxWidth, fontSize);
  }

  const lineHeight = fontSize * 1.1;
  const totalHeight = lines.length * lineHeight;

  return {
    fontSize,
    lines,
    totalHeight,
  };
}

function createTextSVG(
  text: string,
  imageWidth: number,
  imageHeight: number,
  position: 'top' | 'bottom',
  metrics: TextMetrics
): string {
  const { fontSize, lines } = metrics;
  const lineHeight = fontSize * 1.1;
  
  // Calculate vertical position
  const verticalPadding = imageHeight * 0.05;
  const yPosition = position === 'top' 
    ? verticalPadding + fontSize 
    : imageHeight - verticalPadding - (lines.length - 1) * lineHeight;

  // Build SVG
  const textElements = lines.map((line, index) => {
    const y = yPosition + (index * lineHeight);
    return `
      <text
        x="50%"
        y="${y}"
        text-anchor="middle"
        font-family="Impact, Arial Black, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="white"
        stroke="black"
        stroke-width="4"
        stroke-linejoin="round"
        paint-order="stroke"
      >${line.toUpperCase()}</text>
    `;
  }).join('');

  return `
    <svg width="${imageWidth}" height="${imageHeight}">
      ${textElements}
    </svg>
  `;
}

function createWatermarkSVG(
  imageWidth: number,
  imageHeight: number,
  watermarkText: string
): string {
  const fontSize = Math.floor(imageWidth / 40);
  const padding = imageWidth * 0.02;
  const x = imageWidth - padding;
  const y = imageHeight - padding;

  return `
    <svg width="${imageWidth}" height="${imageHeight}">
      <text
        x="${x}"
        y="${y}"
        text-anchor="end"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        fill="white"
        fill-opacity="0.3"
        stroke="black"
        stroke-width="1"
        stroke-opacity="0.3"
      >${watermarkText}</text>
    </svg>
  `;
}

export async function renderMeme(
  imageBuffer: Buffer,
  caption: string,
  options: RenderOptions
): Promise<Buffer> {
  try {
    // Load and potentially resize image
    let image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image dimensions');
    }

    let { width, height } = metadata;

    // Resize if too large
    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      if (width > height) {
        height = Math.floor((height / width) * MAX_IMAGE_DIMENSION);
        width = MAX_IMAGE_DIMENSION;
      } else {
        width = Math.floor((width / height) * MAX_IMAGE_DIMENSION);
        height = MAX_IMAGE_DIMENSION;
      }
      image = image.resize(width, height, { fit: 'inside' });
    }

    // Calculate text metrics
    const metrics = calculateTextMetrics(caption, width);

    // Create text overlay SVG
    const textSVG = createTextSVG(caption, width, height, options.position, metrics);
    const textBuffer = Buffer.from(textSVG);

    // Composite text onto image
    const composites: sharp.OverlayOptions[] = [
      {
        input: textBuffer,
        top: 0,
        left: 0,
      },
    ];

    // Add watermark if enabled
    if (options.watermark?.enabled && options.watermark.text) {
      const watermarkSVG = createWatermarkSVG(width, height, options.watermark.text);
      const watermarkBuffer = Buffer.from(watermarkSVG);
      composites.push({
        input: watermarkBuffer,
        top: 0,
        left: 0,
      });
    }

    // Apply composites and output PNG
    const result = await image
      .composite(composites)
      .png({ quality: 90 })
      .toBuffer();

    return result;
  } catch (error) {
    console.error('Meme rendering error:', error);
    throw new Error('Failed to render meme');
  }
}

export async function createCollage(memeBuffers: Buffer[]): Promise<Buffer> {
  if (memeBuffers.length !== 3) {
    throw new Error('Collage requires exactly 3 memes');
  }

  try {
    // Load all memes and get dimensions
    const memes = await Promise.all(
      memeBuffers.map(buffer => sharp(buffer).metadata().then(meta => ({ buffer, meta })))
    );

    // Target width for each meme in collage
    const targetWidth = 600;
    const gap = 20;

    // Resize all memes to same width, maintaining aspect ratio
    const resizedMemes = await Promise.all(
      memes.map(async ({ buffer, meta }) => {
        const height = Math.floor((meta.height! / meta.width!) * targetWidth);
        return {
          buffer: await sharp(buffer).resize(targetWidth, height).toBuffer(),
          width: targetWidth,
          height,
        };
      })
    );

    // Calculate collage dimensions
    const maxHeight = Math.max(...resizedMemes.map(m => m.height));
    const collageWidth = (targetWidth * 3) + (gap * 2);
    const collageHeight = maxHeight;

    // Create white background
    const background = await sharp({
      create: {
        width: collageWidth,
        height: collageHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    }).png().toBuffer();

    // Composite all memes onto background
    const composites: sharp.OverlayOptions[] = resizedMemes.map((meme, index) => ({
      input: meme.buffer,
      left: index * (targetWidth + gap),
      top: Math.floor((maxHeight - meme.height) / 2), // Center vertically
    }));

    const collage = await sharp(background)
      .composite(composites)
      .png()
      .toBuffer();

    return collage;
  } catch (error) {
    console.error('Collage creation error:', error);
    throw new Error('Failed to create collage');
  }
}

