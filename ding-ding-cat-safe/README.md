# 🐱 Ding Ding Cat Sticker Generator

Generate adorable Ding Ding Cat stickers with AI! Powered by Gemini Nano Banana 2 via Vercel AI Gateway.

## Features
- 5 festival themes: Lunar New Year, Christmas, Halloween, Valentine, Easter
- AI-generated stickers using Gemini
- Download your stickers as PNG
- History saved to Notion

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ding-ding-cat.git
cd ding-ding-cat
npm install
```

### 2. Add environment variables
Create a `.env.local` file (never commit this!):
```bash
cp .env.example .env.local
```

Then fill in your actual keys in `.env.local`:
```
AI_GATEWAY_API_KEY=your_key_here
NOTION_TOKEN=your_token_here
```

### 3. Run locally
```bash
npm run dev
```

## Deploy to Vercel
1. Push to GitHub (`.env.local` is in `.gitignore` so keys stay safe)
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard → Settings → Environment Variables
4. Deploy!

## Tech Stack
- Next.js 14 (App Router)
- HeroUI v3
- Framer Motion
- Vercel AI SDK + Gemini Nano Banana 2
- Notion API
