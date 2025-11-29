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
 * Saves a pulled card for the day for a user.
 * @param {string} uid - User email/ID
 * @param {string} cardId - The ID of the practice card pulled.
 * @returns {Promise<Object>} Saved entry
 */
export async function savePulledCard(uid, cardId) {
  const entry = {
    created_by: uid,
    practice_card_id: cardId,
    created_date: new Date().toISOString(),
  };

  if (isDemoMode) {
    const table = getDemoTable('daily_card');
    const newEntry = { ...entry, id: `demo-daily-card-${Date.now()}` };
    table.push(newEntry);
    saveDemoTable('daily_card', table);
    return newEntry;
  }

  const { data: saved, error } = await supabase
    .from('daily_card')
    .insert(entry)
    .select()
    .single();

  if (error) {
    // It might fail if a card was already pulled today, which is fine.
    if (error.code === '23505') { // unique constraint violation
      console.log('User has already pulled a card today.');
      return null;
    }
    throw error;
  }
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

/**
 * Update user stats after card pull
 * @param {string} uid - User email/ID
 * @param {Object} cardData - The card that was pulled
 * @returns {Promise<Object>} Updated profile
 */
export async function updateUserStatsOnPull(uid, cardData) {
  if (isDemoMode) {
    const profiles = getDemoTable('user_profile');
    let profile = profiles.find(p => p.created_by === uid);
    
    if (!profile) {
      profile = {
        id: `demo-profile-${Date.now()}`,
        created_by: uid,
        total_pulls: 0,
        current_streak: 0,
        longest_streak: 0,
        category_counts: {},
        last_pull_date: null
      };
      profiles.push(profile);
    }

    const today = new Date().toISOString().split('T')[0];
    const lastPullDate = profile.last_pull_date ? profile.last_pull_date.split('T')[0] : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Update pull count
    profile.total_pulls = (profile.total_pulls || 0) + 1;

    // Update streak
    if (lastPullDate === yesterday) {
      profile.current_streak = (profile.current_streak || 0) + 1;
    } else if (lastPullDate !== today) {
      profile.current_streak = 1;
    }

    if (profile.current_streak > (profile.longest_streak || 0)) {
      profile.longest_streak = profile.current_streak;
    }

    // Update category counts
    if (cardData?.category) {
      if (!profile.category_counts) profile.category_counts = {};
      profile.category_counts[cardData.category] = (profile.category_counts[cardData.category] || 0) + 1;
    }

    profile.last_pull_date = new Date().toISOString();
    saveDemoTable('user_profile', profiles);
    return profile;
  }

  // Real Supabase update
  const { data: existing } = await supabase
    .from('user_profile')
    .select('*')
    .eq('created_by', uid)
    .single();

  const today = new Date().toISOString().split('T')[0];
  const lastPullDate = existing?.last_pull_date ? existing.last_pull_date.split('T')[0] : null;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = existing?.current_streak || 0;
  if (lastPullDate === yesterday) {
    currentStreak += 1;
  } else if (lastPullDate !== today) {
    currentStreak = 1;
  }

  const longestStreak = Math.max(currentStreak, existing?.longest_streak || 0);
  const categoryCounts = existing?.category_counts || {};
  if (cardData?.category) {
    categoryCounts[cardData.category] = (categoryCounts[cardData.category] || 0) + 1;
  }

  const updates = {
    total_pulls: (existing?.total_pulls || 0) + 1,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    category_counts: categoryCounts,
    last_pull_date: new Date().toISOString()
  };

  if (existing) {
    const { data, error } = await supabase
      .from('user_profile')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('user_profile')
      .insert({ created_by: uid, ...updates })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

/**
 * Update Vibeagotchi XP on card pull
 * @param {string} uid - User email/ID
 * @param {number} xpAmount - Amount of XP to add
 * @returns {Promise<Object>} Updated state
 */
export async function updateVibeagotchiXpOnPull(uid, xpAmount = 25) {
  const state = await getVibeGotchiState(uid);
  
  if (!state) {
    // Create initial state with XP
    return saveVibeGotchiState(uid, {
      name: 'Vibe',
      evolution_stage: 0,
      current_emotion: 'happy',
      energy: 50,
      focus: 50,
      peace: 50,
      bond: 0,
      growth_xp: xpAmount,
      daily_harmony_score: 0,
      harmony_streak: 0,
      total_interactions: 1
    });
  }

  // Update existing state with additional XP
  return saveVibeGotchiState(uid, {
    growth_xp: (state.growth_xp || 0) + xpAmount,
    total_interactions: (state.total_interactions || 0) + 1
  });
}

/**
 * Record activity pulse
 * @param {string} uid - User email/ID
 * @param {string} actionDescription - Description of the action
 * @param {string} actionIcon - Emoji icon for the action
 * @returns {Promise<Object>} Created pulse
 */
export async function recordActivityPulse(uid, actionDescription, actionIcon = '✨') {
  const entry = {
    user_email: uid,
    action_description: actionDescription,
    action_icon: actionIcon,
    created_date: new Date().toISOString()
  };

  if (isDemoMode) {
    const table = getDemoTable('activity_pulse');
    const newEntry = { ...entry, id: `demo-pulse-${Date.now()}` };
    table.push(newEntry);
    saveDemoTable('activity_pulse', table);
    return newEntry;
  }

  const { data, error } = await supabase
    .from('activity_pulse')
    .insert(entry)
    .select()
    .single();

  if (error) {
    console.warn('Failed to record activity pulse:', error);
    return null;
  }
  return data;
}

/**
 * Save a favorite card for user
 * @param {string} uid - User email/ID
 * @param {string} cardId - Card ID to favorite
 * @returns {Promise<Object>} Created favorite
 */
export async function saveFavoriteCard(uid, cardId) {
  const entry = {
    user_email: uid,
    practice_card_id: cardId,
    favorited_date: new Date().toISOString()
  };

  if (isDemoMode) {
    const table = getDemoTable('favorite_card');
    // Check if already favorited
    const existing = table.find(f => f.user_email === uid && f.practice_card_id === cardId);
    if (existing) return existing;
    
    const newEntry = { ...entry, id: `demo-fav-${Date.now()}` };
    table.push(newEntry);
    saveDemoTable('favorite_card', table);
    return newEntry;
  }

  const { data, error } = await supabase
    .from('favorite_card')
    .insert(entry)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      console.log('Card already favorited');
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Remove a favorite card
 * @param {string} uid - User email/ID
 * @param {string} cardId - Card ID to unfavorite
 * @returns {Promise<boolean>} Success status
 */
export async function removeFavoriteCard(uid, cardId) {
  if (isDemoMode) {
    const table = getDemoTable('favorite_card');
    const index = table.findIndex(f => f.user_email === uid && f.practice_card_id === cardId);
    if (index >= 0) {
      table.splice(index, 1);
      saveDemoTable('favorite_card', table);
    }
    return true;
  }

  const { error } = await supabase
    .from('favorite_card')
    .delete()
    .eq('user_email', uid)
    .eq('practice_card_id', cardId);

  if (error) throw error;
  return true;
}

/**
 * Get user's favorite cards
 * @param {string} uid - User email/ID
 * @returns {Promise<Array>} List of favorites
 */
export async function getUserFavorites(uid) {
  if (isDemoMode) {
    const table = getDemoTable('favorite_card');
    return table.filter(f => f.user_email === uid);
  }

  const { data, error } = await supabase
    .from('favorite_card')
    .select('*')
    .eq('user_email', uid);

  if (error) {
    console.warn('Failed to get favorites:', error);
    return [];
  }
  return data || [];
}

/**
 * Sync logic when a card is pulled
 */
export async function syncCardPull(uid, card) {
  try {
      // 1. Save pulled card
      await savePulledCard(uid, card.id);

      // 2. Update user stats
      await updateUserStatsOnPull(uid, card);

      // 3. Update Vibeagotchi XP
      await updateVibeagotchiXpOnPull(uid, 25);

      // 4. Record Activity Pulse
      await recordActivityPulse(uid, 'pulled a PRACTICE card', '🎴');

      return true;
  } catch (error) {
      console.error("Error syncing card pull:", error);
      throw error;
  }
}
