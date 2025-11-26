import { useState, useEffect, useCallback } from 'react';
import { appApi } from '@/api/supabaseClient';

export interface LeaderboardEntry {
  id: string;
  username: string;
  streak: number;
  totalPulls: number;
  lastPull: string;
  totalXp: number;
  level: number;
}

export function useGlobalLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connected, setConnected] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get all user profiles from Supabase
      const users = await appApi.entities.UserProfile.list('-total_xp', 100);
      
      // Get all daily cards/pulls for calculating stats
      const pulls = await appApi.entities.DailyCard.list('-created_date', 1000);

      // Build leaderboard entries
      const entries: LeaderboardEntry[] = users.map((user: any) => {
        // Get pulls for this user
        const userPulls = pulls.filter((pull: any) => pull.user_email === user.created_by);
        
        // Get last pull date
        const lastPullDate = userPulls.length > 0
          ? new Date(userPulls[0].created_date).toLocaleDateString()
          : 'Never';

        return {
          id: user.id,
          username: user.username || user.display_name || 'Anonymous',
          streak: user.streak_count || 0,
          totalPulls: userPulls.length,
          lastPull: lastPullDate,
          totalXp: user.total_xp || 0,
          level: user.level || 1,
        };
      });

      // Sort by streak (descending), then by total pulls, then by XP
      entries.sort((a, b) => {
        if (b.streak !== a.streak) return b.streak - a.streak;
        if (b.totalPulls !== a.totalPulls) return b.totalPulls - a.totalPulls;
        return b.totalXp - a.totalXp;
      });

      setLeaderboard(entries);
      setConnected(true);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return {
    leaderboard,
    isLoading,
    connected,
    refresh: loadLeaderboard,
  };
}
