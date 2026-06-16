# 🐱 Ding Ding Cat — Deploy to Vercel

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "🐱 Ding Ding Cat Sticker Generator"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 2: Deploy on Vercel
1. Go to https://vercel.com → log in
2. Click "Add New Project" → import your GitHub repo
3. Click "Deploy" — Vercel auto-detects Next.js

## Step 3: Add Environment Variables
In your Vercel project → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| `AI_GATEWAY_API_KEY` | Your Vercel AI Gateway key |
| `NOTION_TOKEN` | Your Notion integration token |

4. Click "Save" then "Redeploy"

## Done!
Your app is live at `https://your-project.vercel.app`
