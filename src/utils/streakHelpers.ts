/**
 * Streak calculation and management utilities
 * 
 * Provides centralized logic for calculating user streaks,
 * determining streak risk, and managing streak-related features
 * across the PRACTICE app.
 * 
 * @module streakHelpers
 */

import { getUserPulls } from './pullTracking';

export interface UserPull {
  cardId: number;
  date: string;
  packId?: string;
}

/**
 * Calculates the user's current streak based on pull history
 * 
 * A streak is maintained by pulling at least one card per calendar day.
 * Streak breaks occur when a full day (24 hours) passes without a pull.
 * 
 * @param username - The user's username
 * @returns Current streak count in days (0 if streak is broken)
 * 
 * @example
 * ```typescript
 * const streak = calculateStreak('johndoe');
 * console.log(`Current streak: ${streak} days`);
 * ```
 */
export const calculateStreak = (username: string): number => {
  const pulls = getUserPulls(username);
  
  if (pulls.length === 0) {
    return 0;
  }
  
  // Sort pulls by date (newest first)
  const sortedPulls = [...pulls].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset to start of day
  
  for (const pull of sortedPulls) {
    const pullDate = new Date(pull.date);
    pullDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor(
      (currentDate.getTime() - pullDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff === streak) {
      // Pull is from the expected day
      streak++;
      currentDate = new Date(pullDate);
    } else if (daysDiff > streak) {
      // Gap in pulls - streak broken
      break;
    }
  }
  
  return streak;
};

/**
 * Calculates streak based on consecutive days with pulls
 * 
 * Alternative calculation method that looks for consecutive days
 * in the pull history. More lenient than calculateStreak.
 * 
 * @param pulls - Array of user pull records
 * @returns Consecutive days streak count
 */
export const calculateConsecutiveDaysStreak = (pulls: UserPull[]): number => {
  if (pulls.length === 0) return 0;
  
  let streak = 1;
  for (let i = pulls.length - 1; i > 0; i--) {
    const current = new Date(pulls[i].date);
    const prev = new Date(pulls[i - 1].date);
    const diffTime = Math.abs(current.getTime() - prev.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Determines the risk level of losing the current streak
 * 
 * Risk levels:
 * - 'none': User has pulled today or has no streak
 * - 'low': User pulled within last 12 hours
 * - 'medium': User pulled 12-20 hours ago
 * - 'high': User pulled over 20 hours ago (streak at risk!)
 * 
 * @param username - The user's username
 * @returns Streak risk level
 * 
 * @example
 * ```typescript
 * const risk = getStreakRisk('johndoe');
 * if (risk === 'high') {
 *   showNotification('Your streak is at risk! Pull a card soon.');
 * }
 * ```
 */
export const getStreakRisk = (username: string): 'none' | 'low' | 'medium' | 'high' => {
  const pulls = getUserPulls(username);
  
  if (pulls.length === 0) {
    return 'none';
  }
  
  const lastPull = pulls[pulls.length - 1];
  const lastPullDate = new Date(lastPull.date);
  const now = new Date();
  const hoursSinceLastPull = (now.getTime() - lastPullDate.getTime()) / (1000 * 60 * 60);
  
  // If pulled today, no risk
  if (hoursSinceLastPull < 24 && lastPullDate.getDate() === now.getDate()) {
    return 'none';
  }
  
  if (hoursSinceLastPull < 12) {
    return 'low';
  } else if (hoursSinceLastPull < 20) {
    return 'medium';
  } else {
    return 'high';
  }
};

/**
 * Gets the time remaining until streak expires (in hours)
 * 
 * @param username - The user's username
 * @returns Hours until streak breaks, or null if no active streak
 */
export const getTimeUntilStreakExpires = (username: string): number | null => {
  const pulls = getUserPulls(username);
  
  if (pulls.length === 0) {
    return null;
  }
  
  const lastPull = pulls[pulls.length - 1];
  const lastPullDate = new Date(lastPull.date);
  const now = new Date();
  const hoursSinceLastPull = (now.getTime() - lastPullDate.getTime()) / (1000 * 60 * 60);
  
  const hoursRemaining = 24 - hoursSinceLastPull;
  
  return hoursRemaining > 0 ? hoursRemaining : 0;
};

/**
 * Checks if user has pulled today
 * 
 * @param username - The user's username
 * @returns true if user has pulled today, false otherwise
 */
export const hasPulledToday = (username: string): boolean => {
  const pulls = getUserPulls(username);
  
  if (pulls.length === 0) {
    return false;
  }
  
  const lastPull = pulls[pulls.length - 1];
  const lastPullDate = new Date(lastPull.date);
  const now = new Date();
  
  return (
    lastPullDate.getFullYear() === now.getFullYear() &&
    lastPullDate.getMonth() === now.getMonth() &&
    lastPullDate.getDate() === now.getDate()
  );
};

/**
 * Gets streak milestone achievements
 * 
 * @param streak - Current streak count
 * @returns Array of milestone achievements
 */
export const getStreakMilestones = (streak: number): Array<{ days: number; name: string; reward: string }> => {
  const milestones = [
    { days: 3, name: '3-Day Dedication', reward: '+50 XP' },
    { days: 7, name: 'Week Warrior', reward: '+100 XP' },
    { days: 14, name: 'Fortnight Champion', reward: '+200 XP' },
    { days: 30, name: 'Monthly Master', reward: '+500 XP' },
    { days: 60, name: 'Two-Month Titan', reward: '+1000 XP' },
    { days: 100, name: 'Century Legend', reward: '+2000 XP' },
    { days: 365, name: 'Year of Excellence', reward: '+10000 XP + Golden Badge' },
  ];
  
  return milestones.filter(m => streak >= m.days);
};

/**
 * Gets the next streak milestone
 * 
 * @param streak - Current streak count
 * @returns Next milestone object or null if all milestones achieved
 */
export const getNextStreakMilestone = (streak: number): { days: number; name: string; daysRemaining: number } | null => {
  const allMilestones = [3, 7, 14, 30, 60, 100, 365];
  const nextMilestone = allMilestones.find(m => m > streak);
  
  if (!nextMilestone) {
    return null;
  }
  
  const names: Record<number, string> = {
    3: '3-Day Dedication',
    7: 'Week Warrior',
    14: 'Fortnight Champion',
    30: 'Monthly Master',
    60: 'Two-Month Titan',
    100: 'Century Legend',
    365: 'Year of Excellence',
  };
  
  return {
    days: nextMilestone,
    name: names[nextMilestone] || 'Unknown',
    daysRemaining: nextMilestone - streak,
  };
};

/**
 * Calculates streak bonus multiplier for XP rewards
 * 
 * @param streak - Current streak count
 * @returns XP multiplier (1.0 = no bonus, 2.0 = double XP)
 */
export const getStreakXPMultiplier = (streak: number): number => {
  if (streak >= 100) return 3.0;
  if (streak >= 60) return 2.5;
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.0;
};
