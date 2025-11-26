/**
 * Achievement Helper Utilities
 * Consolidates duplicate achievement checking logic
 */

import { getUserPulls } from './pullTracking';
import { getFavorites } from './favoritesTracking';
import { getShareCount } from './shareTracking';
import { getReferralCount } from './referralTracking';
import { getMorningPullStreak, getEveningPullStreak, getWeekendPullStreak, hasStreakBroken } from './timeBasedTracking';
import { checkAndUnlockAchievements, type Achievement } from './achievementsTracking';
import { awardXP, XP_REWARDS, getLevelInfo } from './xpTracking';

interface AchievementCheckResult {
  unlockedAchievements: Achievement[];
  streak: number;
}

/**
 * Calculates current streak for a user based on their pull history
 */
export function calculateStreak(username: string): number {
  const pulls = getUserPulls(username);
  
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
}

/**
 * Comprehensive achievement check and unlock
 * Consolidates all the data gathering and checking logic
 */
export function checkAndProcessAchievements(
  username: string,
  tokenBalance?: number
): AchievementCheckResult {
  const pulls = getUserPulls(username);
  const favorites = getFavorites(username);
  const shares = getShareCount(username);
  const referrals = getReferralCount(username, true);
  const morningStreak = getMorningPullStreak(username);
  const eveningStreak = getEveningPullStreak(username);
  const weekendStreak = getWeekendPullStreak(username);
  const streakBroken = hasStreakBroken(username);
  const levelInfo = getLevelInfo(username);
  
  const streak = calculateStreak(username);
  const currentTokenBalance = tokenBalance || 0;
  
  const unlockedAchievements = checkAndUnlockAchievements(
    username,
    streak,
    pulls.length,
    favorites.length,
    shares,
    referrals,
    morningStreak,
    eveningStreak,
    weekendStreak,
    levelInfo.level,
    streakBroken,
    0, // journalEntries
    0, // journalStreak
    0, // totalJournalWords
    0, // longestJournalEntry
    0, // completedChallenges
    false, // hasRareCard
    false, // hasEpicCard
    false, // hasLegendaryCard
    false, // hasMythicCard
    currentTokenBalance
  );
  
  return {
    unlockedAchievements,
    streak,
  };
}

/**
 * Awards streak bonus XP based on streak milestones
 */
export function awardStreakBonuses(username: string, streak: number): void {
  if (streak > 0) {
    awardXP(username, XP_REWARDS.STREAK_DAY, `Maintained ${streak}-day streak`);
    
    if (streak === 7) {
      awardXP(username, XP_REWARDS.STREAK_7, '7-day streak milestone!');
    } else if (streak === 30) {
      awardXP(username, XP_REWARDS.STREAK_30, '30-day streak milestone!');
    } else if (streak === 100) {
      awardXP(username, XP_REWARDS.STREAK_100, '100-day streak milestone!');
    }
  }
}

/**
 * Utility to refresh SpacetimeDB stats with retry logic
 */
export function refreshStatsWithRetry(
  refreshFn: () => void,
  times: number = 3,
  interval: number = 2000
): void {
  for (let i = 1; i <= times; i++) {
    setTimeout(() => refreshFn(), i * interval);
  }
}
