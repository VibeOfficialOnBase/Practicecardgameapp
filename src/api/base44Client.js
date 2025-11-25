// Import from supabaseClient
import { appApi, supabase } from './supabaseClient';

// Export appApi as base44 for backwards compatibility during migration
// but also export appApi directly if needed
export const base44 = appApi;
export { supabase, appApi };
