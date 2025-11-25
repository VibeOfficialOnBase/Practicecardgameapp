import { supabase, isDemoMode } from '@/api/supabaseClient';

// Helper to interact with the demo mock DB in localStorage if needed directly
const getDemoDB = () => {
    try {
        return JSON.parse(localStorage.getItem('demo_db') || '{"data":{}}');
    } catch {
        return { data: {} };
    }
};

const saveDemoDB = (db) => {
    localStorage.setItem('demo_db', JSON.stringify(db));
};

const getDemoTable = (tableName) => {
    const db = getDemoDB();
    if (!db.data[tableName]) db.data[tableName] = [];
    return db.data[tableName];
};

const saveDemoTable = (tableName, data) => {
    const db = getDemoDB();
    db.data[tableName] = data;
    saveDemoDB(db);
};

// Re-export isDemoMode for consumers
export { isDemoMode };

/**
 * Get user profile by User ID
 * @param {string} uid - User ID (or email if used as key)
 * @returns {Promise<Object|null>} User profile data or null
 */
export async function getUserProfile(uid) {
  if (isDemoMode) {
      const profiles = getDemoTable('user_profile');
      return profiles.find(p => p.created_by === uid) || null;
  }

  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('created_by', uid)
    .single();

  if (error) {
    console.warn('Error fetching user profile:', error);
    return null;
  }
  return data;
}

/**
 * Save a practice entry (journal, reflection, etc.)
 * @param {string} uid - User email/ID
 * @param {Object} data - Practice data
 * @returns {Promise<Object>} Saved entry
 */
export async function savePracticeEntry(uid, data) {
  const entry = {
    created_by: uid,
    created_date: new Date().toISOString(),
    ...data
  };

  if (isDemoMode) {
      const table = getDemoTable('daily_practice');
      const newEntry = { ...entry, id: `demo-practice-${Date.now()}` };
      table.push(newEntry);
      saveDemoTable('daily_practice', table);
      return newEntry;
  }

  const { data: saved, error } = await supabase
    .from('daily_practice')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return saved;
}

/**
 * Save game progress/score
 * @param {string} uid - User email/ID
 * @param {string} gameType - 'chakra_blaster', 'memory_match', etc.
 * @param {Object} data - Score, level, etc.
 * @returns {Promise<Object>} Saved score
 */
export async function saveGameProgress(uid, gameType, data) {
  const entry = {
    user_email: uid,
    game_type: gameType,
    created_date: new Date().toISOString(),
    ...data
  };

  if (isDemoMode) {
      const table = getDemoTable('game_score');
      const newEntry = { ...entry, id: `demo-score-${Date.now()}` };
      table.push(newEntry);
      saveDemoTable('game_score', table);
      return newEntry;
  }

  const { data: saved, error } = await supabase
    .from('game_score')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return saved;
}

/**
 * Get best game progress/score
 * @param {string} uid
 * @param {string} gameType
 * @returns {Promise<Object|null>}
 */
export async function getGameProgress(uid, gameType) {
  if (isDemoMode) {
      const table = getDemoTable('game_score');
      const scores = table.filter(s => s.user_email === uid && s.game_type === gameType);
      scores.sort((a, b) => b.score - a.score); // Descending score
      return scores[0] || null;
  }

  const { data, error } = await supabase
    .from('game_score')
    .select('*')
    .eq('user_email', uid)
    .eq('game_type', gameType)
    .order('score', { ascending: false })
    .limit(1);

  if (error) return null;
  return data && data.length > 0 ? data[0] : null;
}

/**
 * Save VibeAGotchi state
 * @param {string} uid
 * @param {Object} state
 * @returns {Promise<Object>}
 */
export async function saveVibeGotchiState(uid, state) {
  if (isDemoMode) {
      const table = getDemoTable('vibeagotchi_state');
      const existingIndex = table.findIndex(s => s.user_email === uid);
      let result;
      if (existingIndex >= 0) {
          table[existingIndex] = { ...table[existingIndex], ...state, last_interaction: new Date().toISOString() };
          result = table[existingIndex];
      } else {
          result = { ...state, user_email: uid, last_interaction: new Date().toISOString(), id: `demo-vibe-${Date.now()}` };
          table.push(result);
      }
      saveDemoTable('vibeagotchi_state', table);
      return result;
  }

  const { data: existing } = await supabase
    .from('vibeagotchi_state')
    .select('id')
    .eq('user_email', uid)
    .single();

  let result;
  if (existing) {
    const { data, error } = await supabase
      .from('vibeagotchi_state')
      .update({ ...state, last_interaction: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from('vibeagotchi_state')
      .insert({ ...state, user_email: uid, last_interaction: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    result = data;
  }
  return result;
}

/**
 * Get VibeAGotchi state
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export async function getVibeGotchiState(uid) {
  if (isDemoMode) {
      const table = getDemoTable('vibeagotchi_state');
      return table.find(s => s.user_email === uid) || null;
  }

  const { data, error } = await supabase
    .from('vibeagotchi_state')
    .select('*')
    .eq('user_email', uid)
    .single();

  if (error) return null;
  return data;
}
