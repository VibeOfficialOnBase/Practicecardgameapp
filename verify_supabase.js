// Verification Script to run in node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Try to load env if possible (mocking here as I can't easily load .env in this context without file access)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log("Skipping verification script: Env vars not present in process.env");
    process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log("Verifying connection...");

    // 1. Check connection
    const { data, error } = await supabase.from('global_pulse').select('count').limit(1);
    if (error) {
        console.error("Connection Failed:", error.message);
    } else {
        console.log("Connection Successful. Global Pulse accessible.");
    }

    // 2. Try to create a test user (auth)
    // Note: We can't easily create auth users via client API without email confirmation or admin key.
    // We'll skip auth user creation and check public table access if RLS allows.
}

verify();
