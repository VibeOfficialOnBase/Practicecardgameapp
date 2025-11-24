# Supabase Setup Guide

This guide will help you set up Supabase as the database backend for the Practice Card Game App.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: Practice Card Game
   - Database Password: (create a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"

### 2. Run the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Open the `schema.sql` file from this directory
3. Copy and paste the entire contents into the SQL Editor
4. Click "Run" to execute the schema

This will create all the necessary tables, indexes, and Row Level Security policies.

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings:
- Go to Project Settings > API
- Copy the "Project URL" and "anon public" key

### 4. Enable Authentication

1. In Supabase dashboard, go to Authentication > Providers
2. Enable Email/Password authentication
3. (Optional) Enable additional providers like Google, GitHub, etc.

### 5. Configure Storage (Optional)

If you want to store user-uploaded images:

1. In Supabase dashboard, go to Storage
2. Create a new bucket called "practice-cards"
3. Set the bucket to "Public" if images should be publicly accessible
4. Configure any storage policies as needed

### 6. Set Up Row Level Security Policies

The schema includes basic RLS policies, but you may want to customize them:

1. Go to Authentication > Policies
2. Review and modify policies for each table
3. Ensure users can only access their own data where appropriate

## Self-Hosting Supabase (Optional)

If you want to self-host Supabase:

1. Follow the official guide: https://supabase.com/docs/guides/self-hosting
2. Use Docker Compose to set up all services
3. Update your `.env.local` with your self-hosted URLs

## Testing the Connection

After setup, test the connection by:

1. Running `npm install` to install dependencies
2. Running `npm run dev` to start the development server
3. Try signing up/logging in through the app

## Troubleshooting

### Can't connect to database
- Check that your environment variables are correct
- Ensure your Supabase project is active
- Verify network connectivity

### Authentication not working
- Make sure email authentication is enabled in Supabase
- Check that RLS policies are properly configured
- Verify the anon key is correct

### Queries failing
- Check the browser console for errors
- Verify RLS policies allow the operation
- Ensure the user is authenticated for protected operations

## Migration from Base44

The app has been migrated from Base44 to Supabase. Key changes:

- All `base44.entities.*` calls now use Supabase tables
- Authentication uses Supabase Auth instead of Base44 Auth
- File uploads use Supabase Storage
- Functions are now implemented as Supabase Edge Functions (or client-side)

## Support

For Supabase-specific issues, consult:
- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
