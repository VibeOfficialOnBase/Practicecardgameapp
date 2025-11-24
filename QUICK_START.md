# Quick Start Guide

Get the Practice Card Game App running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- A Supabase account (free tier works great!)

## Step 1: Clone & Install (1 minute)

```bash
git clone <your-repo-url>
cd PracticeCardGameApp
npm install
```

## Step 2: Set Up Supabase (2 minutes)

1. Go to https://supabase.com and create a free account
2. Click "New Project"
3. Fill in:
   - Project name: `practice-card-game`
   - Database password: (make a strong one!)
   - Region: (pick closest to you)
4. Click "Create new project" and wait ~2 minutes

## Step 3: Create Database Tables (1 minute)

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the ENTIRE contents and paste into the SQL Editor
5. Click "Run" (bottom right)
6. You should see "Success. No rows returned" - that's good!

## Step 4: Get Your API Keys (30 seconds)

1. In Supabase, click the Settings icon (gear) → Project Settings → API
2. Find these two values:
   - **Project URL** (starts with https://)
   - **anon public** key (long string)

## Step 5: Configure the App (30 seconds)

1. In the project folder, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in a text editor and add your values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 6: Enable Authentication (30 seconds)

1. In Supabase dashboard, go to Authentication → Providers
2. Make sure "Email" is enabled (it should be by default)
3. That's it!

## Step 7: Run the App! (10 seconds)

```bash
npm run dev
```

Open your browser to http://localhost:5173

🎉 **You're done!** The app is running!

## First Use

1. Click "Sign Up" to create an account
2. Use any email and password (emails are stored in Supabase, not sent)
3. Start exploring the app!

## What Works Right Now

✅ User authentication (sign up, login, logout)  
✅ All UI pages and navigation  
✅ Database reads/writes  
✅ Profile management  
✅ Games, challenges, and features  
⚠️ AI features use mock responses (see Optional Setup below)  
⚠️ Image uploads need storage bucket (see Optional Setup below)  

## Optional Setup

### Add Storage for Image Uploads

1. In Supabase → Storage → Create a new bucket
2. Name it: `practice-cards`
3. Make it public: ✅
4. Now users can upload profile pictures!

### Add Real AI Features

AI features currently use mock responses. To enable real AI:

1. Implement Supabase Edge Functions (see `MIGRATION.md`)
2. Connect to OpenAI or other AI services
3. Update function names in code if needed

See `TODO.md` for the complete list.

## Troubleshooting

### "Missing required Supabase configuration"
- Make sure `.env.local` exists and has both variables
- Restart the dev server after creating `.env.local`

### Can't sign up
- Check that Email authentication is enabled in Supabase
- Check browser console for error messages

### Tables not found
- Make sure you ran the ENTIRE `schema.sql` file
- Check Supabase → Database → Tables to verify tables exist

### Build fails
- Run `npm install` again
- Check that Node.js version is 16+
- Delete `node_modules` and `package-lock.json`, then `npm install`

## Next Steps

- Read `TODO.md` for optional enhancements
- Read `MIGRATION.md` to understand the architecture
- Check out `supabase/README.md` for advanced Supabase setup

## Need Help?

- Check the full documentation in the repo
- Visit Supabase docs: https://supabase.com/docs
- Open an issue on GitHub

Enjoy your standalone practice card game app! 🎴✨
