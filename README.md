# Practice Card Game App

A standalone mindfulness and practice card game application built with React, Vite, and Supabase.

## Prerequisites

- Node.js (v16 or higher)
- A Supabase account (sign up at https://supabase.com)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Follow the setup guide in `supabase/README.md`
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key to `.env.local`

3. **Initialize the database**
   - Run the SQL script in `supabase/schema.sql` in your Supabase SQL Editor
   - This creates all necessary tables and security policies

## Running the app

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building the app

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- 🎴 Daily practice card draws
- 🎮 Multiple mindfulness games (Chakra Blaster, Memory Match, etc.)
- 🏆 Achievements and progression system
- 👥 Social features (friends, groups, community challenges)
- 🎨 Customizable themes and cosmetics
- 📊 Progress tracking and leaderboards
- 🤖 AI-powered insights and recommendations
- 🐣 Vibeagotchi virtual companion

## Database

This app uses **Supabase** as its database and authentication provider. The previous Base44 dependency has been removed to make this a truly standalone application.

### Self-Hosting

Supabase can be self-hosted using Docker. See the [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting) for details.

## Tech Stack

- **Frontend**: React 18, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **State Management**: TanStack Query (React Query)

## Project Structure

```
├── src/
│   ├── api/          # API client and database wrappers
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility libraries
│   └── utils/        # Helper functions
├── supabase/
│   ├── schema.sql    # Database schema
│   └── README.md     # Supabase setup guide
└── public/           # Static assets

```

## Contributing

Feel free to submit issues and pull requests!

## License

Built by Eddie Pabon