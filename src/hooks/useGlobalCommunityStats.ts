import { useState, useEffect, useCallback, useMemo } from 'react';
import { appApi } from '@/api/supabaseClient';
import { useVisibilityChange } from './useVisibilityChange';
import { INTERVALS } from '@/constants';

export interface GlobalCommunityStats {
  connected: boolean;
  totalUsers: number;
  activeUsersToday: number;
  totalPulls: number;
  pullsToday: number;
  pullsThisWeek: number;
  totalAchievements: number;
  recentAchievements: Array<{ username: string; achievementId: string; timestamp: Date }>;
  recentPulls: Array<{ username: string; cardId: number; timestamp: Date }>;
  mostPopularCardToday: { cardId: number; count: number } | null;
  highestStreak: number;
  refresh: () => void;
}

export function useGlobalCommunityStats(): GlobalCommunityStats {
  const [connected, setConnected] = useState(true); // Assume connected with Supabase
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allPulls, setAllPulls] = useState<any[]>([]);
  const [allAchievements, setAllAchievements] = useState<any[]>([]);
  const [dataVersion, setDataVersion] = useState(0);
  
  // Track tab visibility to pause polling when hidden
  const isVisible = useVisibilityChange();

  // Load data from Supabase
  const loadData = useCallback(async () => {
    try {
      // Load users
      const users = await appApi.entities.UserProfile.list('-created_date', 1000);
      setAllUsers(users);

      // Load recent pulls (card pulls are stored in daily_card or similar)
      const pulls = await appApi.entities.DailyCard.list('-created_date', 1000);
      setAllPulls(pulls);

      // Load achievements
      const achievements = await appApi.entities.Achievement.list('-created_date', 100);
      setAllAchievements(achievements);

      setConnected(true);
      setDataVersion(v => v + 1);
    } catch (error) {
      console.error('Error loading community stats:', error);
      setConnected(false);
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Polling: refresh data periodically when tab is visible
  useEffect(() => {
    if (!isVisible) return;

    const pollInterval = setInterval(() => {
      refresh();
    }, INTERVALS.STATS_REFRESH);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isVisible, refresh]);

  // Calculate stats from data
  const stats = useMemo(() => {
    const now = new Date();
    const todayString = now.toISOString().split('T')[0];
    
    // Get date 7 days ago for week calculation
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoString = weekAgo.toISOString().split('T')[0];

    // Calculate pulls today and this week
    const pullsToday = allPulls.filter(p => {
      const pullDate = p.created_date?.split('T')[0] || '';
      return pullDate === todayString;
    }).length;
    
    const pullsThisWeek = allPulls.filter(p => {
      const pullDate = p.created_date?.split('T')[0] || '';
      return pullDate >= weekAgoString;
    }).length;

    // Find most popular card today
    const todayPulls = allPulls.filter(p => {
      const pullDate = p.created_date?.split('T')[0] || '';
      return pullDate === todayString;
    });
    
    const cardCounts = todayPulls.reduce((acc: Record<string, number>, pull: any) => {
      const cardId = pull.card_id || pull.practice_card_id;
      if (cardId) {
        acc[cardId] = (acc[cardId] || 0) + 1;
      }
      return acc;
    }, {});
    
    const mostPopularCardToday = Object.keys(cardCounts).length > 0
      ? Object.entries(cardCounts)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .map(([cardId, count]) => ({ cardId: parseInt(cardId), count: count as number }))[0]
      : null;

    // Get recent achievements with usernames
    const recentAchievements = allAchievements.slice(0, 10).map(achievement => {
      const user = allUsers.find(u => u.created_by === achievement.created_by);
      return {
        username: user?.username || user?.display_name || 'Anonymous',
        achievementId: achievement.achievement_type || achievement.id,
        timestamp: new Date(achievement.created_date || achievement.earned_date),
      };
    });

    // Get recent pulls with usernames
    const recentPulls = allPulls.slice(0, 20).map(pull => {
      const user = allUsers.find(u => u.created_by === pull.user_email);
      return {
        username: user?.username || user?.display_name || 'Anonymous',
        cardId: pull.card_id || pull.practice_card_id || 0,
        timestamp: new Date(pull.created_date),
      };
    });

    // Calculate active users today
    const uniqueUsersToday = new Set(todayPulls.map(pull => pull.user_email));
    const activeUsersToday = uniqueUsersToday.size;

    // Calculate highest streak from user profiles
    const highestStreak = allUsers.length > 0
      ? Math.max(...allUsers.map(user => user.streak_count || 0))
      : 0;

    return {
      totalUsers: allUsers.length,
      activeUsersToday,
      totalPulls: allPulls.length,
      pullsToday,
      pullsThisWeek,
      totalAchievements: allAchievements.length,
      recentAchievements,
      recentPulls,
      mostPopularCardToday,
      highestStreak,
    };
  }, [allUsers, allPulls, allAchievements, dataVersion]);

  return {
    connected,
    ...stats,
    refresh,
  };
}
