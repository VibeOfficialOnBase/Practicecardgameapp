# Setup TODO List

Complete these steps to finish the migration from Base44 to Supabase:

## ⚠️ Required Setup

### 1. Create Supabase Project
- [ ] Sign up at https://supabase.com
- [ ] Create a new project
- [ ] Note down your project URL and anon key

### 2. Configure Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add your `VITE_SUPABASE_URL`
- [ ] Add your `VITE_SUPABASE_ANON_KEY`

### 3. Initialize Database
- [ ] Open Supabase SQL Editor
- [ ] Run the entire `supabase/schema.sql` file
- [ ] Verify all tables were created (check Database > Tables)

### 4. Enable Authentication
- [ ] Go to Authentication > Providers in Supabase
- [ ] Enable Email/Password authentication
- [ ] (Optional) Enable social auth providers

### 5. Set Up Storage
- [ ] Go to Storage in Supabase
- [ ] Create a bucket named `practice-cards`
- [ ] Set bucket to Public
- [ ] Upload your card images to this bucket

## 📋 Optional but Recommended

### 6. Update Hardcoded Image URLs
These files contain hardcoded Base44 storage URLs that should be updated:

- [ ] `src/components/wallet/WalletStatus.jsx` (lines 66, 78)
- [ ] `src/components/CardDeck.jsx` (lines 94, 120)
- [ ] `src/components/PulledCard.jsx` (lines 153, 170)
- [ ] `src/pages/MemoryMatch.jsx` (line 342)
- [ ] `src/pages/PremiumPacks.jsx` (lines 85, 162)

Replace `https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/...`
With your Supabase storage URLs: `https://YOUR-PROJECT.supabase.co/storage/v1/object/public/practice-cards/...`

### 7. Implement Edge Functions (Optional - App Works with Mocks)

The app currently uses mock responses for AI features. For production, implement these as Supabase Edge Functions:

- [ ] `generateCardInsight` - AI insights for cards
- [ ] `generateDailyChallenge` - Generate daily challenges
- [ ] `generateDailyAffirmation` - Generate affirmations
- [ ] `suggestBuddies` - Friend suggestions
- [ ] `analyzeEmotionalState` - Mood analysis
- [ ] `getAICompanionTips` - Vibeagotchi tips
- [ ] `moderateContent` - Content moderation

See: https://supabase.com/docs/guides/functions

### 8. Implement Token Verification (Optional)

If you use blockchain features:

- [ ] `verifyTokenBalance` - Check token balances
- [ ] `verifyVibeOfficialHoldings` - Verify NFT ownership
- [ ] `verifyAlgoLeaguesHoldings` - Verify NFT ownership

These need to call blockchain APIs (Algorand, etc.)

### 9. Set Up Email (Optional)

For email notifications:

- [ ] Configure Supabase SMTP settings, OR
- [ ] Implement Edge Function with SendGrid/AWS SES/etc.

### 10. Configure RLS Policies

Review and customize Row Level Security policies:

- [ ] Check policies in `supabase/schema.sql`
- [ ] Add additional policies as needed for your security requirements
- [ ] Test that users can only access their own data

## 🧪 Testing

After setup, test these features:

- [ ] User sign up
- [ ] User login
- [ ] Pull a daily card
- [ ] Save favorite cards
- [ ] Complete a challenge
- [ ] Play a game
- [ ] View leaderboard
- [ ] Send a friend request
- [ ] Post to community
- [ ] Upload profile picture

## 📊 Data Migration (If Applicable)

If you have existing Base44 data:

- [ ] Export data from Base44
- [ ] Transform data to match new schema
- [ ] Import data into Supabase

## 🚀 Deployment

When ready to deploy:

- [ ] Add environment variables to your hosting platform
- [ ] Deploy the app
- [ ] Test in production
- [ ] Monitor Supabase dashboard for usage

## 📚 Resources

- [Supabase Setup Guide](supabase/README.md)
- [Migration Guide](MIGRATION.md)
- [Supabase Documentation](https://supabase.com/docs)

## ✅ Done?

Once you've completed all required steps, you can:
- Delete this TODO.md file
- Start using your standalone app!
- Consider self-hosting Supabase for complete independence
