import { useCallback } from 'react';
import { getUserPulls } from '@/utils/pullTracking';
import { getFavorites } from '@/utils/favoritesTracking';
import { getShareCount } from '@/utils/shareTracking';
import { getReferralCount } from '@/utils/referralTracking';
import {
  getMorningPullStreak,
  getEveningPullStreak,
  getWeekendPullStreak,
  hasStreakBroken,
} from '@/utils/timeBasedTracking';
import { getLevelInfo } from '@/utils/xpTracking';
import { checkAndUnlockAchievements, type Achievement } from '@/utils/achievementsTracking';
import type { TokenBalance } from '@/utils/tokenGating';

/**
 * Custom hook to consolidate achievement checking logic
 * Prevents code duplication and ensures consistent achievement checking across the app
 */
export function useAchievementCheck() {
  const checkAchievements = useCallback(
    (
      username: string,
      tokenBalance: TokenBalance | null
    ): { achievements: Achievement[]; streak: number } => {
      // Gather all user data
      const pulls = getUserPulls(username);
      const favorites = getFavorites(username);
      const shares = getShareCount(username);
      const referrals = getReferralCount(username, true);
      const morningStreak = getMorningPullStreak(username);
      const eveningStreak = getEveningPullStreak(username);
      const weekendStreak = getWeekendPullStreak(username);
      const streakBroken = hasStreakBroken(username);
      const levelInfo = getLevelInfo(username);

      // Calculate current streak
      let streak = 0;
      if (pulls.length > 0) {
        streak = 1;
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
      }

      const currentTokenBalance = tokenBalance ? tokenBalance.formattedBalance : 0;

      // Check for unlocked achievements
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
        achievements: unlockedAchievements,
        streak,
      };
    },
    []
  );

  return { checkAchievements };
}
