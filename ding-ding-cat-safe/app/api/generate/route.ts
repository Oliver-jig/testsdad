import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_PAGE_ID = '3804912659c180f5815cf9b54eb19c96';

async function saveToNotion(prompt: string, style: string) {
  try {
    await fetch(`https://api.notion.com/v1/blocks/${NOTION_PAGE_ID}/children`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        children: [{
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [{
              type: 'text',
              text: {
                content: `🐱 [${style}] "${prompt}" — ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
              },
            }],
            icon: { emoji: '🐱' },
            color: 'pink_background',
          },
        }],
      }),
    });
  } catch (e) {
    console.error('Notion save failed:', e);
  }
}

const CHARACTER_BASE = `
The character is "Ding Ding Cat", a famous Hong Kong mascot cat with these EXACT features:
- Wears a large yellow-gold bell-shaped helmet/hat that covers most of the head, with a small green propeller/antenna on top and green leaf-shaped ear cutouts on the sides
- Calico cat face: beige/cream base with brown and dark brown fur patches around the eyes and ears
- Very large round sparkly eyes with light reflections, pink blush cheeks, tiny pink nose, small cute mouth
- Chubby round body with tiny stubby paws
- Bold dark brown outlines on everything, sticker-style illustration
- Associated with Hong Kong tram (green double-decker tram number 116)
- Kawaii chibi proportions: very large head, small round body
- Clean white or transparent background
- Vibrant colors, no text unless specified
`;

const STYLE_GUIDES: Record<string, string> = {
  'Chibi cute':  'chibi style, super deformed proportions, pastel accent colors, soft shading',
  'Kawaii':      'kawaii Japanese style, extra soft and round, pastel pink and yellow palette, sparkle effects',
  'Cartoon':     'bold cartoon style, thick outlines, bright saturated colors, expressive action lines',
  'Watercolor':  'soft watercolor illustration, gentle color washes, delicate linework, slightly textured',
  'Pixel art':   'retro 16-bit pixel art style, crisp pixels, limited color palette, no anti-aliasing',
};

export async function POST(req: NextRequest) {
  const { prompt, style = 'Lunar New Year', festivalDesc = 'red envelopes, lanterns, gold coins' } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const styleGuide = `${style} festival theme with ${festivalDesc}`;

  const fullPrompt = `Create a sticker illustration of Ding Ding Cat.

${CHARACTER_BASE}

The cat is: ${prompt}

Festival theme: ${styleGuide}
Format: sticker with clean bold dark outlines, transparent or white background, single centered composition.`;

  const result = await generateText({
    model: 'google/gemini-3.1-flash-image-preview' as any,
    prompt: fullPrompt,
    experimental_providerMetadata: {
      gateway: { apiKey: process.env.AI_GATEWAY_API_KEY }
    }
  } as any);

  const imageFiles = (result as any).files?.filter((f: any) =>
    f.mediaType?.startsWith('image/')
  );

  if (!imageFiles || imageFiles.length === 0) {
    return NextResponse.json({ error: 'No image generated' }, { status: 500 });
  }

  const imageFile = imageFiles[0];
  const base64 = Buffer.from(imageFile.uint8Array).toString('base64');
  const dataUrl = `data:${imageFile.mediaType};base64,${base64}`;

  saveToNotion(prompt, style);

  return NextResponse.json({ image: dataUrl });
}
