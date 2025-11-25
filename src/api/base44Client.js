// Import from supabaseClient
import { appApi, supabase } from './supabaseClient';

// Re-export as base44 for backwards compatibility during migration
// but code should preferably use appApi or direct imports
export const base44 = appApi;
export { supabase };
