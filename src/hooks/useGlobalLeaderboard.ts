import { useState, useEffect, useCallback, useRef } from 'react';
import type { User, CardPull, DbConnection } from '../spacetime_module_bindings';
import { getConnection, addConnectionListener, initializeConnection } from '../spacetime/spacetimeConnection';

export interface LeaderboardEntry {
  wallet: string;
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
  const [connected, setConnected] = useState(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const callbacksRegisteredRef = useRef(false);

  const calculateStreak = useCallback((pulls: CardPull[]): number => {
    if (pulls.length === 0) return 0;

    // Sort pulls by timestamp (most recent first)
    const sortedPulls = [...pulls].sort((a, b) => 
      b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
    );

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the most recent pull was today or yesterday
    const mostRecentPull = new Date(sortedPulls[0].timestamp.toDate());
    mostRecentPull.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - mostRecentPull.getTime()) / (1000 * 60 * 60 * 24));
    
    // If last pull was more than 1 day ago, streak is broken
    if (daysDiff > 1) return 0;

    // Count consecutive days
    for (let i = 0; i < sortedPulls.length - 1; i++) {
      const currentDate = new Date(sortedPulls[i].timestamp.toDate());
      currentDate.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(sortedPulls[i + 1].timestamp.toDate());
      nextDate.setHours(0, 0, 0, 0);
      
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else if (diffDays === 0) {
        // Same day, continue counting
        continue;
      } else {
        // Gap in streak
        break;
      }
    }

    return streak;
  }, []);

  const processLeaderboardData = useCallback((connection: DbConnection) => {
    try {
      // Get all users
      const allUsers = Array.from(connection.db.user.iter()) as User[];
      
      // Get all card pulls
      const allPulls = Array.from(connection.db.cardPull.iter()) as CardPull[];

      // Build leaderboard entries
      const entries: LeaderboardEntry[] = allUsers.map((user: User) => {
        // Get pulls for this user
        const userPulls = allPulls.filter((pull: CardPull) => pull.wallet === user.wallet);
        
        // Calculate streak
        const streak = calculateStreak(userPulls);
        
        // Get last pull date
        const lastPullDate = userPulls.length > 0
          ? new Date(userPulls[0].timestamp.toDate()).toLocaleDateString()
          : 'Never';

        return {
          wallet: user.wallet,
          username: user.username,
          streak,
          totalPulls: userPulls.length,
          lastPull: lastPullDate,
          totalXp: Number(user.totalXp),
          level: user.level,
        };
      });

      // Sort by streak (descending), then by total pulls, then by XP
      entries.sort((a, b) => {
        if (b.streak !== a.streak) return b.streak - a.streak;
        if (b.totalPulls !== a.totalPulls) return b.totalPulls - a.totalPulls;
        return b.totalXp - a.totalXp;
      });

      setLeaderboard(entries);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing leaderboard data:', error);
      setIsLoading(false);
    }
  }, [calculateStreak]);

  const registerTableCallbacks = useCallback((connection: DbConnection) => {
    if (callbacksRegisteredRef.current) return;

    // Update leaderboard when users are added/updated
    connection.db.user.onInsert(() => {
      processLeaderboardData(connection);
    });

    connection.db.user.onUpdate(() => {
      processLeaderboardData(connection);
    });

    // Update leaderboard when card pulls are added
    connection.db.cardPull.onInsert(() => {
      processLeaderboardData(connection);
    });

    callbacksRegisteredRef.current = true;
  }, [processLeaderboardData]);

  const subscribeToTables = useCallback((connection: DbConnection) => {
    // Unsubscribe from current subscription if it exists
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }

    // Subscribe to all users and all card pulls
    const queries = [
      'SELECT * FROM user',
      'SELECT * FROM card_pull',
    ];

    subscriptionRef.current = connection
      .subscriptionBuilder()
      .onApplied(() => {
        processLeaderboardData(connection);
        registerTableCallbacks(connection);
      })
      .onError((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('SpacetimeDB leaderboard subscription error:', errorMessage);
      })
      .subscribe(queries);
  }, [processLeaderboardData, registerTableCallbacks]);

  useEffect(() => {
    // Initialize shared connection
    initializeConnection();

    // Listen for connection events
    const unsubscribe = addConnectionListener({
      onConnect: (connection) => {
        setConnected(true);
        subscribeToTables(connection);
      },
      onDisconnect: () => {
        setConnected(false);
        callbacksRegisteredRef.current = false;
      },
      onError: (error) => {
        console.error('Leaderboard connection error:', error);
        setConnected(false);
      },
    });

    // Check if already connected
    const existingConnection = getConnection();
    if (existingConnection) {
      setConnected(true);
      subscribeToTables(existingConnection);
    }

    return () => {
      unsubscribe();
      // Cleanup subscription on unmount
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing on unmount:', error);
        }
      }
    };
  }, [subscribeToTables]);

  return {
    leaderboard,
    isLoading,
    connected,
  };
}
