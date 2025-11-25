import { supabase } from '@/api/supabaseClient';

// Re-export isDemoMode as false constant since we removed it
export const isDemoMode = false;

/**
 * Get user profile by User ID
 */
export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', uid)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.warn('Error fetching user profile:', error);
    return null;
  }
  return data;
}

/**
 * Save a practice entry
 */
export async function savePracticeEntry(uid, data) {
  const profile = await getUserProfile(uid);
  if (!profile) throw new Error("User profile not found");

  // Combine extra fields into content if needed, since schema is strict
  let content = data.reflection || '';
  if (data.before_mood) {
      content = `Before: ${data.before_mood} | ${content}`;
  }

  const entry = {
    user_id: profile.id,
    type: 'daily_practice',
    content: content,
    mood_value: data.rating || 0,
    emotion: data.after_mood || 'neutral',
    created_at: new Date().toISOString()
  };

  const { data: saved, error } = await supabase
    .from('practices')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return saved;
}

/**
 * Save game progress/score
 * Stores in 'practices' table with type='game_[type]'
 */
export async function saveGameProgress(uid, gameType, data) {
  const profile = await getUserProfile(uid);
  if (!profile) return null;

  // Format content to store score/level details
  const contentData = {
      score: data.score,
      level: data.level_reached || data.level,
      ...data
  };

  const entry = {
    user_id: profile.id,
    type: `game_${gameType}`,
    content: JSON.stringify(contentData),
    mood_value: data.score || 0, // Store score in mood_value int column for simple ranking if needed
    emotion: 'excited', // Default emotion for games
    created_at: new Date().toISOString()
  };

  const { data: saved, error } = await supabase
    .from('practices')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return saved;
}

/**
 * Save VibeAGotchi state
 */
export async function saveVibeGotchiState(uid, state) {
  const profile = await getUserProfile(uid);
  if (!profile) throw new Error("User profile not found");

  const { data: existing } = await supabase
    .from('vibagotchi')
    .select('id')
    .eq('user_id', profile.id)
    .single();

  // Map app state to strict schema
  const payload = {
    user_id: profile.id,
    level: state.evolution_stage || state.level || 1,
    energy: state.energy || 100,
    happiness: state.happiness || 100,
    evolution_stage: state.evolution_stage_name || 'Spark',
    // Note: hunger, cleanliness etc are not in schema, so they won't persist
    // unless we add them. For now we follow instructions.
  };

  let result;
  if (existing) {
    const { data, error } = await supabase
      .from('vibagotchi')
      .update({ ...payload, updated_at: new Date().toISOString() }) // if updated_at column exists (added in my sql)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from('vibagotchi')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }
  return result;
}

/**
 * Get VibeAGotchi state
 */
export async function getVibeGotchiState(uid) {
  const profile = await getUserProfile(uid);
  if (!profile) return null;

  const { data, error } = await supabase
    .from('vibagotchi')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  if (error) return null;

  return {
      ...data,
      evolution_stage: data.level, // Map level back to stage index if needed
      evolution_stage_name: data.evolution_stage,
      // Defaults for missing columns
      hunger: 0,
      cleanliness: 100,
      health: 100,
      focus: 50,
      peace: 50,
      name: 'Vibe'
  };
}
