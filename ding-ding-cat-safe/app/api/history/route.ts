import { NextRequest, NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_PAGE_ID = '3804912659c180f5815cf9b54eb19c96';

export async function GET() {
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${NOTION_PAGE_ID}/children?page_size=50`, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message || 'Notion error' }, { status: res.status });
    }

    const data = await res.json();

    // Parse image blocks and their captions (which store the prompt)
    const stickers = data.results
      .filter((block: any) => block.type === 'image' || block.type === 'paragraph' || block.type === 'callout')
      .map((block: any) => {
        if (block.type === 'image') {
          const caption = block.image?.caption?.[0]?.plain_text || 'No prompt';
          const url = block.image?.file?.url || block.image?.external?.url || '';
          return { id: block.id, type: 'image', url, prompt: caption, created: block.created_time };
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json({ stickers, raw: data.results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageUrl } = await req.json();

    // Append a new image block to the Notion page
    const res = await fetch(`https://api.notion.com/v1/blocks/${NOTION_PAGE_ID}/children`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        children: [
          {
            object: 'block',
            type: 'callout',
            callout: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `🐱 ${prompt} — ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
                  },
                },
              ],
              icon: { emoji: '🐱' },
              color: 'pink_background',
            },
          },
          {
            object: 'block',
            type: 'image',
            image: {
              type: 'external',
              external: { url: imageUrl },
              caption: [{ type: 'text', text: { content: prompt } }],
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
