import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we're in demo mode (no environment variables provided)
const isDemoMode = !supabaseUrl || !supabaseAnonKey

if (isDemoMode) {
  console.warn(
    '🎮 Running in DEMO MODE - No Supabase configuration found.\n' +
    'The app will work with mock data. To connect to a real database:\n' +
    '1. Copy .env.example to .env.local\n' +
    '2. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
    '3. Restart the dev server'
  )
}

// Create Supabase client (or a dummy one for demo mode)
export const supabase = isDemoMode 
  ? createClient('https://demo.localhost', 'demo-key-not-used')
  : createClient(supabaseUrl, supabaseAnonKey)
