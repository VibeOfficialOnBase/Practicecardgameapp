/**
 * Reset Utility - Clears all test activity and user data
 * This provides a fresh start for new users after testing
 */

// All localStorage keys used by PRACTICE
const STORAGE_KEYS = [
  // XP & Leveling
  'practice_xp',
  'practice_xp_transactions',
  
  // Achievements
  'practice_achievements',
  
  // Pulls & Streaks
  'practice_pulls',
  'practice_leaderboard',
  'practice_timed_pulls',
  
  // Journal
  'practice_journal_entries',
  'practice_journal_streaks',
  
  // Social Features
  'practice_favorites',
  'practice_shares',
  'practice_referrals',
  'practice_referral_code',
  
  // Challenges & Bonuses
  'practice_active_challenges',
  'practice_user_challenges',
  'practice_streak_bonuses',
  'practice_combo_tracking',
  'practice_streak_freezes',
  
  // Power-ups
  'practice_active_powerups',
  'practice_powerup_inventory',
  
  // Token Gating
  'practice_free_pulls',
  
  // Tutorial & Settings
  'practice_tutorial_completed',
  'practice_welcome_seen',
];

/**
 * Clear all test activity and reset the app to a fresh state
 * This removes all user data from localStorage
 */
export function clearAllTestData(): void {
  if (typeof window === 'undefined') {
    console.error('Cannot clear data: window is undefined');
    return;
  }
  
  try {
    STORAGE_KEYS.forEach((key: string) => {
      localStorage.removeItem(key);
    });
    

  } catch (error) {
    console.error('Error clearing test data:', error);
  }
}

/**
 * Clear data for a specific user (by username)
 * This is more targeted and preserves other users' data
 */
export function clearUserData(username: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear XP data
    const xpData = localStorage.getItem('practice_xp');
    if (xpData) {
      const allXP = JSON.parse(xpData);
      const filteredXP = allXP.filter((xp: { username: string }) => xp.username !== username);
      localStorage.setItem('practice_xp', JSON.stringify(filteredXP));
    }
    
    // Clear XP transactions
    const xpTxData = localStorage.getItem('practice_xp_transactions');
    if (xpTxData) {
      const allTx = JSON.parse(xpTxData);
      const filteredTx = allTx.filter((tx: { username: string }) => tx.username !== username);
      localStorage.setItem('practice_xp_transactions', JSON.stringify(filteredTx));
    }
    
    // Clear achievements
    const achData = localStorage.getItem('practice_achievements');
    if (achData) {
      const allAch = JSON.parse(achData);
      const filteredAch = allAch.filter((ach: { username: string }) => ach.username !== username);
      localStorage.setItem('practice_achievements', JSON.stringify(filteredAch));
    }
    
    // Clear pulls
    const pullsData = localStorage.getItem('practice_pulls');
    if (pullsData) {
      const allPulls = JSON.parse(pullsData);
      const filteredPulls = allPulls.filter((pull: { username: string }) => pull.username !== username);
      localStorage.setItem('practice_pulls', JSON.stringify(filteredPulls));
    }
    
    // Clear leaderboard
    const lbData = localStorage.getItem('practice_leaderboard');
    if (lbData) {
      const leaderboard = JSON.parse(lbData);
      const filteredLb = leaderboard.filter((entry: { username: string }) => entry.username !== username);
      localStorage.setItem('practice_leaderboard', JSON.stringify(filteredLb));
    }
    
    // Clear journal entries
    const journalData = localStorage.getItem('practice_journal_entries');
    if (journalData) {
      const allEntries = JSON.parse(journalData);
      const filteredEntries = allEntries.filter((entry: { userId: string }) => entry.userId !== username);
      localStorage.setItem('practice_journal_entries', JSON.stringify(filteredEntries));
    }
    
    // Clear journal streaks
    const journalStreakData = localStorage.getItem('practice_journal_streaks');
    if (journalStreakData) {
      const allStreaks = JSON.parse(journalStreakData);
      const filteredStreaks = allStreaks.filter((streak: { userId: string }) => streak.userId !== username);
      localStorage.setItem('practice_journal_streaks', JSON.stringify(filteredStreaks));
    }
    
    // Clear favorites
    const favData = localStorage.getItem('practice_favorites');
    if (favData) {
      const allFavs = JSON.parse(favData);
      const filteredFavs = allFavs.filter((fav: { username: string }) => fav.username !== username);
      localStorage.setItem('practice_favorites', JSON.stringify(filteredFavs));
    }
    
    // Clear shares
    const shareData = localStorage.getItem('practice_shares');
    if (shareData) {
      const allShares = JSON.parse(shareData);
      const filteredShares = allShares.filter((share: { username: string }) => share.username !== username);
      localStorage.setItem('practice_shares', JSON.stringify(filteredShares));
    }
    
    // Clear referrals
    const refData = localStorage.getItem('practice_referrals');
    if (refData) {
      const allRefs = JSON.parse(refData);
      const filteredRefs = allRefs.filter(
        (ref: { referrerUsername: string; referredUsername: string }) => 
          ref.referrerUsername !== username && ref.referredUsername !== username
      );
      localStorage.setItem('practice_referrals', JSON.stringify(filteredRefs));
    }
    
    // Clear timed pulls
    const timedData = localStorage.getItem('practice_timed_pulls');
    if (timedData) {
      const allTimed = JSON.parse(timedData);
      const filteredTimed = allTimed.filter((pull: { username: string }) => pull.username !== username);
      localStorage.setItem('practice_timed_pulls', JSON.stringify(filteredTimed));
    }
    

  } catch (error) {
    console.error(`Error clearing data for user ${username}:`, error);
  }
}

/**
 * Get statistics about current stored data
 * Useful for debugging and monitoring
 */
export function getStorageStats(): {
  totalKeys: number;
  activeKeys: number;
  estimatedSize: number;
  keys: string[];
} {
  if (typeof window === 'undefined') {
    return { totalKeys: 0, activeKeys: 0, estimatedSize: 0, keys: [] };
  }
  
  const activeKeys = STORAGE_KEYS.filter((key: string) => localStorage.getItem(key) !== null);
  let estimatedSize = 0;
  
  activeKeys.forEach((key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
      estimatedSize += value.length * 2; // Rough estimate in bytes
    }
  });
  
  return {
    totalKeys: STORAGE_KEYS.length,
    activeKeys: activeKeys.length,
    estimatedSize,
    keys: activeKeys,
  };
}
