import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as moduleBindings from '../spacetime_module_bindings';
import { getConnection, addConnectionListener, initializeConnection } from '../spacetime/spacetimeConnection';
import { useVisibilityChange } from './useVisibilityChange';
import { INTERVALS } from '@/constants';

type SpacetimeDbConnection = moduleBindings.DbConnection;
type User = moduleBindings.User;
type CardPull = moduleBindings.CardPull;
type Achievement = moduleBindings.Achievement;
type JournalStreak = moduleBindings.JournalStreak;

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
  const [connected, setConnected] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allPulls, setAllPulls] = useState<CardPull[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [allStreaks, setAllStreaks] = useState<JournalStreak[]>([]);
  const [dataVersion, setDataVersion] = useState(0);
  
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const callbacksRegisteredRef = useRef(false);
  
  // Track tab visibility to pause polling when hidden
  const isVisible = useVisibilityChange();
  
  // Refs to hold latest state values for callbacks
  const allUsersRef = useRef<User[]>([]);
  const allPullsRef = useRef<CardPull[]>([]);
  const allAchievementsRef = useRef<Achievement[]>([]);
  const allStreaksRef = useRef<JournalStreak[]>([]);
  
  // Keep refs in sync with state
  useEffect(() => {
    allUsersRef.current = allUsers;
  }, [allUsers]);
  
  useEffect(() => {
    allPullsRef.current = allPulls;
  }, [allPulls]);
  
  useEffect(() => {
    allAchievementsRef.current = allAchievements;
  }, [allAchievements]);
  
  useEffect(() => {
    allStreaksRef.current = allStreaks;
  }, [allStreaks]);

  // Load initial cache from SpacetimeDB
  const loadDataFromCache = useCallback((connection: SpacetimeDbConnection) => {
    
    try {
      // Load ALL users
      const usersData = Array.from(connection.db.user.iter());
      setAllUsers(usersData);

      // Load ALL pulls (sorted by timestamp, newest first)
      const pullsData = Array.from(connection.db.cardPull.iter())
        .sort((a: CardPull, b: CardPull) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
      setAllPulls(pullsData);

      // Load ALL achievements (sorted by unlock time, newest first)
      const achievementsData = Array.from(connection.db.achievement.iter())
        .sort((a: Achievement, b: Achievement) => b.unlockedAt.toDate().getTime() - a.unlockedAt.toDate().getTime());
      setAllAchievements(achievementsData);

      // Load ALL journal streaks
      const streaksData = Array.from(connection.db.journalStreak.iter());
      setAllStreaks(streaksData);

      setDataVersion(v => v + 1);
    } catch (error) {
      console.error('❌ Error loading cache:', error);
    }
  }, []);

  // Register callbacks with refs to always use latest state
  const registerTableCallbacks = useCallback((connection: SpacetimeDbConnection) => {
    // Use component-level ref instead of global flag
    if (callbacksRegisteredRef.current) {
      return;
    }

    // User callbacks
    connection.db.user.onInsert((_ctx, row: User) => {
      setAllUsers(prev => [...prev, row]);
      setDataVersion(v => v + 1);
    });

    // CardPull callbacks - Use ref to get latest state
    connection.db.cardPull.onInsert((_ctx, row: CardPull) => {
      setAllPulls(prev => [row, ...prev]);
      setDataVersion(v => v + 1);
    });

    // Achievement callbacks
    connection.db.achievement.onInsert((_ctx, row: Achievement) => {
      setAllAchievements(prev => [row, ...prev]);
      setDataVersion(v => v + 1);
    });

    // JournalStreak callbacks
    connection.db.journalStreak.onInsert((_ctx, row: JournalStreak) => {
      setAllStreaks(prev => [...prev, row]);
      setDataVersion(v => v + 1);
    });

    connection.db.journalStreak.onUpdate((_ctx, _oldRow: JournalStreak, newRow: JournalStreak) => {
      setAllStreaks(prev => prev.map(s => s.wallet === newRow.wallet ? newRow : s));
      setDataVersion(v => v + 1);
    });

    callbacksRegisteredRef.current = true;
  }, []);

  // Subscribe to tables
  const subscribeToTables = useCallback((connection: SpacetimeDbConnection) => {

    try {
      // Unsubscribe from old subscription if it exists
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      // Subscribe to ALL data (no wallet filter)
      const queries = [
        'SELECT * FROM user',
        'SELECT * FROM card_pull',
        'SELECT * FROM achievement',
        'SELECT * FROM journal_streak',
      ];

      // Store the subscription so we can unsubscribe later
      subscriptionRef.current = connection
        .subscriptionBuilder()
        .onApplied(() => {
          loadDataFromCache(connection);
        })
        .onError((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('❌ SpacetimeDB subscription error:', errorMessage);
        })
        .subscribe(queries);
    } catch (error) {
      console.error('❌ Error subscribing to tables:', error);
    }
  }, [loadDataFromCache]);

  // Manual refresh
  const refresh = useCallback(() => {
    const connection = getConnection();
    if (!connection) {
      return;
    }

    loadDataFromCache(connection);
  }, [loadDataFromCache]);

  // Setup connection
  useEffect(() => {
    // Initialize shared connection if not already done
    initializeConnection();

    // Listen for connection events
    const unsubscribe = addConnectionListener({
      onConnect: (connection) => {
        setConnected(true);
        
        // Register callbacks with fresh state references
        registerTableCallbacks(connection);
        
        // Subscribe to tables
        subscribeToTables(connection);
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onError: (error) => {
        console.error('❌ Connection error:', error);
        setConnected(false);
      },
    });

    // Check if already connected
    const existingConnection = getConnection();
    if (existingConnection) {
      setConnected(true);
      registerTableCallbacks(existingConnection);
      subscribeToTables(existingConnection);
    }

    return () => {
      unsubscribe();
      
      // Cleanup subscription on unmount
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        } catch (error) {
          console.error('Error unsubscribing on unmount:', error);
        }
      }
      
      // Reset callback flag so new instance can register
      callbacksRegisteredRef.current = false;
    };
  }, [registerTableCallbacks, subscribeToTables]);

  // Polling fallback: refresh data from cache every 15 seconds (only when tab is visible)
  useEffect(() => {
    if (!connected || !isVisible) return;

    const pollInterval = setInterval(() => {
      refresh();
    }, INTERVALS.STATS_REFRESH);

    return () => {
      clearInterval(pollInterval);
    };
  }, [connected, isVisible, refresh]);

  // Calculate stats from real data using useMemo for reactivity
  const stats = useMemo(() => {
    const now = new Date();
    const todayString = now.toISOString().split('T')[0]; // YYYY-MM-DD format in UTC
    
    // Get date 7 days ago for week calculation
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoString = weekAgo.toISOString().split('T')[0];

    // Use string-based date comparison to avoid timezone issues
    const pullsToday = allPulls.filter(p => {
      const pullDateString = p.timestamp.toDate().toISOString().split('T')[0];
      return pullDateString === todayString;
    }).length;
    
    const pullsThisWeek = allPulls.filter(p => {
      const pullDateString = p.timestamp.toDate().toISOString().split('T')[0];
      return pullDateString >= weekAgoString;
    }).length;

    // Find most popular card today
    const todayPulls = allPulls.filter(p => {
      const pullDateString = p.timestamp.toDate().toISOString().split('T')[0];
      return pullDateString === todayString;
    });
    const cardCounts = todayPulls.reduce((acc: Record<number, number>, pull: CardPull) => {
      acc[pull.cardId] = (acc[pull.cardId] || 0) + 1;
      return acc;
    }, {});
    
    const mostPopularCardToday = Object.keys(cardCounts).length > 0
      ? Object.entries(cardCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([cardId, count]) => ({ cardId: parseInt(cardId), count }))[0]
      : null;

    // Get recent achievements with usernames
    const recentAchievements = allAchievements.slice(0, 10).map(achievement => {
      const user = allUsers.find(u => u.wallet === achievement.wallet);
      return {
        username: user?.username || 'Anonymous',
        achievementId: achievement.achievementId,
        timestamp: achievement.unlockedAt.toDate(),
      };
    });

    // Get recent pulls with usernames
    const recentPulls = allPulls.slice(0, 20).map(pull => {
      const user = allUsers.find(u => u.wallet === pull.wallet);
      return {
        username: user?.username || 'Anonymous',
        cardId: pull.cardId,
        timestamp: pull.timestamp.toDate(),
      };
    });

    // Calculate active users today (unique wallets who pulled cards today)
    const uniqueWalletsToday = new Set(todayPulls.map(pull => pull.wallet));
    const activeUsersToday = uniqueWalletsToday.size;

    // Calculate highest streak from real journal streak data
    const highestStreak = allStreaks.length > 0
      ? Math.max(...allStreaks.map(streak => streak.longestStreak))
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
  }, [allUsers, allPulls, allAchievements, allStreaks, dataVersion]);

  return {
    connected,
    ...stats,
    refresh,
  };
}
