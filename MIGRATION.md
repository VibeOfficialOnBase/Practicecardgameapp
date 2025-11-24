# Migration from Base44 to Supabase

This document explains the migration from Base44 BaaS to Supabase.

## What Changed

### Dependencies
- ❌ **Removed**: `@base44/sdk`
- ✅ **Added**: `@supabase/supabase-js`

### Database Backend
- **Before**: Base44 hosted database (app ID: `6921dea06e8f58657363a952`)
- **After**: Supabase PostgreSQL database (self-hostable)

### Configuration
- **Before**: Hardcoded Base44 app ID in code
- **After**: Environment variables in `.env.local`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### API Client
- **Before**: `import { base44 } from '@base44/sdk'`
- **After**: `import { base44 } from '@/api/base44Client'` (compatibility wrapper around Supabase)

## Compatibility Layer

The migration includes a compatibility layer that preserves the Base44 API surface:

```javascript
// These calls still work the same way:
await base44.auth.me();
await base44.entities.UserProfile.filter({ created_by: userEmail });
await base44.entities.DailyChallenge.create({ user_email: userEmail });
```

The compatibility layer translates these calls to Supabase operations:
- `base44.entities.*` → Supabase table queries
- `base44.auth.*` → Supabase Auth
- `base44.integrations.Core.UploadFile` → Supabase Storage

## What Needs Manual Implementation

Some features have mock responses and require additional setup for full functionality:

### 1. Edge Functions (Serverless Functions)

Base44 functions currently return mock responses. For production, implement as Supabase Edge Functions:

- `generateCardInsight` - Currently returns generic insight
- `generateDailyChallenge` - Currently returns generic challenge
- `suggestBuddies` - Currently returns empty array
- `analyzeEmotionalState` - Currently returns neutral mood
- `generateAIRecommendations` - Currently returns empty array
- `generateDailyAffirmation` - Currently returns generic affirmation
- `generatePersonalizedChallenges` - Uses the generic function wrapper
- `getAICompanionTips` - Currently returns basic tips
- `generateVibeThoughts` - Currently returns generic thought
- `generateVibeAffirmation` - Currently returns generic affirmation
- `generateAdaptiveChallenge` - Currently returns basic challenge
- `moderateContent` - Currently approves all content

**The app will work with mock responses**, but for production AI features:
1. Create Supabase Edge Functions (Deno TypeScript)
2. Call external APIs (OpenAI, etc.) from Edge Functions
3. Update function names in `supabaseClient.js` if needed

### 2. Token Verification Functions

These blockchain-related functions currently return mock data (0 holdings):
- `verifyTokenBalance` - Returns balance: 0, verified: false
- `verifyVibeOfficialHoldings` - Returns holdings: 0, verified: false
- `verifyAlgoLeaguesHoldings` - Returns holdings: 0, verified: false

To implement real verification, create Edge Functions that call blockchain APIs (Algorand, etc.)

### 3. File Storage

Configure a Supabase Storage bucket:
1. Go to Supabase Dashboard > Storage
2. Create bucket: `practice-cards`
3. Set to public if images should be publicly accessible
4. Update RLS policies for the bucket

### 4. Email Integration

The `SendEmail` integration currently returns mock success responses:
- Logs email details to console
- Returns success without actually sending

For production email sending:
- Use Supabase's built-in email templates, or
- Implement as an Edge Function calling SendGrid/AWS SES/etc.

### 5. Image URLs

Hard-coded Base44 storage URLs need updating:

**Files with Base44 URLs:**
- `src/components/wallet/WalletStatus.jsx`
- `src/components/CardDeck.jsx`
- `src/components/PulledCard.jsx`

Search for: `qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod`

Replace with your Supabase storage URLs.

## Data Migration

If you have existing data in Base44:

1. **Export data** from Base44 (if API available)
2. **Transform** to match the new schema (see `supabase/schema.sql`)
3. **Import** into Supabase using SQL or CSV import

Note: Table names are converted to snake_case:
- `UserProfile` → `user_profiles`
- `DailyChallenge` → `daily_challenges`
- etc.

## Testing After Migration

1. **Authentication**
   - Sign up new user
   - Sign in existing user
   - Password reset
   - Sign out

2. **Core Features**
   - Pull daily card
   - Save favorite cards
   - Complete challenges
   - View leaderboards

3. **Social Features**
   - Send friend requests
   - Post to community
   - Send messages
   - Join groups

4. **Games**
   - Play Chakra Blaster
   - Play Memory Match
   - Track scores
   - Earn achievements

## Rollback Plan

If you need to rollback:

1. Checkout previous commit: `git checkout 064d280^`
2. Run `npm install` to restore Base44 SDK
3. Deploy previous version

## Benefits of Migration

✅ **No vendor lock-in** - Supabase is open source
✅ **Self-hostable** - Full control over your infrastructure
✅ **PostgreSQL** - Industry-standard relational database
✅ **Better pricing** - More generous free tier, predictable costs
✅ **More features** - Realtime subscriptions, edge functions, storage
✅ **Active community** - Large open source community

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Community**: https://github.com/supabase/supabase/discussions
- **This Project**: Open an issue on GitHub
