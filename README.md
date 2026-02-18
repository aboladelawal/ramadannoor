# Noor 🌙
**Your Ramadan Companion**

Two features in one app:
- **Ramadan Real Talk** — Viral bingo with 60 relatable Ramadan moments
- **Ya Allah...** — Personal dua generator with authentic Arabic duas + AI encouragement

## Stack
- Pure HTML/CSS/JS frontend (no framework needed)
- Vercel serverless function (`api/dua.js`)
- Groq (primary) + Gemini (fallback) for personal messages
- Authentic duas database (hardcoded, no hallucination risk)

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Noor app"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Import on Vercel
- Go to vercel.com → New Project → Import your repo
- Framework preset: **Other**
- Root directory: `/` (default)

### 3. Add Environment Variables
In Vercel project settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | Your Groq API key |
| `GEMINI_API_KEY` | Your Gemini API key |

### 4. Deploy
Vercel auto-deploys on every push to main.

## Local Development
```bash
npm install -g vercel
vercel dev
```
Then visit `http://localhost:3000`

## File Structure
```
noor/
├── index.html       # Landing page
├── bingo.html       # Ramadan Real Talk
├── dua.html         # Ya Allah... Dua Generator
├── api/
│   └── dua.js       # Serverless function (Groq + Gemini)
├── vercel.json      # Vercel config
└── package.json
```

## Customization
- Edit the 60 bingo squares in `bingo.html` → `ALL_SQUARES` array
- Edit/add duas in `dua.html` → `DUAS_DB` array
- Change app URL in share text (search for `noor.vercel.app`)

---
Made with love for the Ummah · Ramadan 1446H
By @_kingmufasa
