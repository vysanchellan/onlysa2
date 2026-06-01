# OnlySA — For SA Eyes Only

> Anonymous hyperlocal social platform for South Africa.
> Confessions. Rants. Reviews. Hot Takes. No name. No face. Just truth.

---

## Getting Started Locally

```bash
git clone https://github.com/YOUR_USERNAME/onlysa.git
cd onlysa
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY (optional)
npm run dev
```

---

## Deploying to GitHub + Vercel (Free)

### Step 1 — Push to GitHub

1. Create account at github.com
2. Click "New repository", name it `onlysa`, set Public, click Create
3. In your terminal inside the onlysa folder:

```bash
git init
git add .
git commit -m "Initial commit: OnlySA MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/onlysa.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to vercel.com, sign in with GitHub
2. Click "Add New Project"
3. Import your `onlysa` repository
4. Vercel auto-detects Next.js — click Deploy
5. You'll get a free URL like `onlysa.vercel.app` in ~2 minutes

### Step 3 — Add AI Moderation (Optional)

In Vercel dashboard:
1. Project Settings > Environment Variables
2. Add: ANTHROPIC_API_KEY = your key
3. Redeploy

### Step 4 — Custom Domain

1. Vercel: Settings > Domains > Add your domain (onlysa.co.za)
2. Follow DNS instructions at your registrar

---

## Project Structure

```
app/
  page.tsx              # Homepage feed
  post/page.tsx         # Submit post
  post/[id]/page.tsx    # Post + comments
  api/posts/            # REST API
  api/moderate/         # AI moderation
components/ui/          # All UI components
lib/
  utils.ts              # Helpers + constants
  store.ts              # In-memory data store
  seed-data.ts          # 10 seed posts
```

---

## For Production: Swap to a Real Database

The MVP uses in-memory storage. For persistence, use:
- Vercel Postgres (free tier)
- PlanetScale (free MySQL)
- Supabase (free PostgreSQL)

Replace lib/store.ts with database calls.
