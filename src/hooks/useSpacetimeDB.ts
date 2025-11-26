import { useState, useEffect, useRef, useCallback } from 'react';
import type { Timestamp } from 'spacetimedb';
import * as moduleBindings from '../spacetime_module_bindings';
import { getConnection, addConnectionListener, initializeConnection } from '../spacetime/spacetimeConnection';

type DbConnection = moduleBindings.DbConnection;
type User = moduleBindings.User;
type CardPull = moduleBindings.CardPull;
type Achievement = moduleBindings.Achievement;
type XpTransaction = moduleBindings.XpTransaction;
type Favorite = moduleBindings.Favorite;
type JournalEntry = moduleBindings.JournalEntry;
type JournalStreak = moduleBindings.JournalStreak;
type Referral = moduleBindings.Referral;
type TimedPull = moduleBindings.TimedPull;
type FreePull = moduleBindings.FreePull;
type RaffleEntry = moduleBindings.RaffleEntry;
type EmailCapture = moduleBindings.EmailCapture;
type ActionType = moduleBindings.ActionType;

export interface SpacetimeDBState {
  connected: boolean;
  statusMessage: string;
  user: User | null;
  pulls: CardPull[];
  achievements: Achievement[];
  xpTransactions: XpTransaction[];
  favorites: Favorite[];
  journalEntries: JournalEntry[];
  journalStreak: JournalStreak | null;
  referrals: Referral[];
  timedPulls: TimedPull[];
  freePull: FreePull | null;
  raffleEntries: RaffleEntry[];
  emailCaptures: EmailCapture[];
}

export interface SpacetimeDBActions {
  createUser: (wallet: string, username: string) => void;
  updateUsername: (wallet: string, username: string) => void;
  recordPull: (wallet: string, cardId: number, dateString: string, packId?: string) => void;
  unlockAchievement: (wallet: string, achievementId: string) => void;
  awardXp: (wallet: string, amount: number, reason: string) => void;
  toggleFavorite: (wallet: string, cardId: number, note?: string) => void;
  saveJournalEntry: (
    wallet: string,
    cardId: number,
    date: Timestamp,
    prompt1: string,
    prompt2: string,
    prompt3: string,
    wordCount: number,
    completed: boolean
  ) => void;
  createReferral: (referrerWallet: string, referredWallet: string, referredUsername: string) => void;
  completeReferral: (referredWallet: string) => void;
  recordFreePull: (wallet: string) => void;
  checkDailyLimit: (wallet: string, dateString: string) => void;
  enterRaffle: (wallet: string, username: string, email: string, tokenBalance: string, usdValue: number) => void;
  captureEmail: (email: string, username: string, action: ActionType, wallet?: string) => void;
  getRaffleEntries: () => void;
  getRaffleCount: () => void;
  selectWeightedWinner: () => void;
}

export function useSpacetimeDB(walletAddress?: string): SpacetimeDBState & SpacetimeDBActions {
  const [connected, setConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Connecting...');
  
  // State for all tables
  const [user, setUser] = useState<User | null>(null);
  const [pulls, setPulls] = useState<CardPull[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [xpTransactions, setXpTransactions] = useState<XpTransaction[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalStreak, setJournalStreak] = useState<JournalStreak | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [timedPulls, setTimedPulls] = useState<TimedPull[]>([]);
  const [freePull, setFreePull] = useState<FreePull | null>(null);
  const [raffleEntries, setRaffleEntries] = useState<RaffleEntry[]>([]);
  const [emailCaptures, setEmailCaptures] = useState<EmailCapture[]>([]);

  const walletAddressRef = useRef<string | undefined>(walletAddress);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const callbacksRegisteredRef = useRef(false);

  // Update wallet address ref when it changes
  useEffect(() => {
    walletAddressRef.current = walletAddress;
  }, [walletAddress]);

  const processInitialCache = useCallback((connection: DbConnection) => {
    if (!walletAddressRef.current) return;
    
    const normalizedWallet = walletAddressRef.current.toLowerCase();

    // Load user
    const userData = connection.db.user.wallet.find(normalizedWallet);
    setUser(userData || null);

    // Load pulls
    const pullsData = Array.from(connection.db.cardPull.iter())
      .filter((p: CardPull) => p.wallet === normalizedWallet)
      .sort((a: CardPull, b: CardPull) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
    setPulls(pullsData);

    // Load achievements
    const achievementsData = Array.from(connection.db.achievement.iter())
      .filter((a: Achievement) => a.wallet === normalizedWallet);
    setAchievements(achievementsData);

    // Load XP transactions
    const xpData = Array.from(connection.db.xpTransaction.iter())
      .filter((x: XpTransaction) => x.wallet === normalizedWallet)
      .sort((a: XpTransaction, b: XpTransaction) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
    setXpTransactions(xpData);

    // Load favorites
    const favoritesData = Array.from(connection.db.favorite.iter())
      .filter((f: Favorite) => f.wallet === normalizedWallet);
    setFavorites(favoritesData);

    // Load journal entries
    const journalData = Array.from(connection.db.journalEntry.iter())
      .filter((j: JournalEntry) => j.wallet === normalizedWallet)
      .sort((a: JournalEntry, b: JournalEntry) => b.date.toDate().getTime() - a.date.toDate().getTime());
    setJournalEntries(journalData);

    // Load journal streak
    const streakData = connection.db.journalStreak.wallet.find(normalizedWallet);
    setJournalStreak(streakData || null);

    // Load referrals
    const referralsData = Array.from(connection.db.referral.iter())
      .filter((r: Referral) => r.referrerWallet === normalizedWallet || r.referredWallet === normalizedWallet);
    setReferrals(referralsData);

    // Load timed pulls
    const timedPullsData = Array.from(connection.db.timedPull.iter())
      .filter((t: TimedPull) => t.wallet === normalizedWallet);
    setTimedPulls(timedPullsData);

    // Load free pull
    const freePullData = connection.db.freePull.wallet.find(normalizedWallet);
    setFreePull(freePullData || null);

    // Load raffle entries (all entries for admin viewing)
    const raffleData = Array.from(connection.db.raffleEntry.iter());
    setRaffleEntries(raffleData);

    // Load email captures
    const emailData = Array.from(connection.db.emailCapture.iter());
    setEmailCaptures(emailData);

    setStatusMessage('Connected to SpacetimeDB');
  }, []);

  const registerTableCallbacks = useCallback((connection: DbConnection) => {
    // Prevent duplicate callback registration
    if (!walletAddressRef.current || callbacksRegisteredRef.current) {
      return;
    }

    const normalizedWallet = walletAddressRef.current.toLowerCase();

    // User callbacks
    connection.db.user.onInsert((_ctx, row: User) => {
      if (row.wallet === normalizedWallet) {
        setUser(row);
      }
    });

    connection.db.user.onUpdate((_ctx, _oldRow: User, newRow: User) => {
      if (newRow.wallet === normalizedWallet) {
        setUser(newRow);
      }
    });

    // CardPull callbacks
    connection.db.cardPull.onInsert((_ctx, row: CardPull) => {
      if (row.wallet === normalizedWallet) {
        setPulls(prev => [row, ...prev]);
      }
    });

    // Achievement callbacks
    connection.db.achievement.onInsert((_ctx, row: Achievement) => {
      if (row.wallet === normalizedWallet) {
        setAchievements(prev => [...prev, row]);
      }
    });

    connection.db.achievement.onUpdate((_ctx, _oldRow: Achievement, newRow: Achievement) => {
      if (newRow.wallet === normalizedWallet) {
        setAchievements(prev =>
          prev.map(a => (a.id === newRow.id ? newRow : a))
        );
      }
    });

    // XP Transaction callbacks
    connection.db.xpTransaction.onInsert((_ctx, row: XpTransaction) => {
      if (row.wallet === normalizedWallet) {
        setXpTransactions(prev => [row, ...prev]);
      }
    });

    // Favorite callbacks
    connection.db.favorite.onInsert((_ctx, row: Favorite) => {
      if (row.wallet === normalizedWallet) {
        setFavorites(prev => [...prev, row]);
      }
    });

    connection.db.favorite.onDelete((_ctx, row: Favorite) => {
      if (row.wallet === normalizedWallet) {
        setFavorites(prev => prev.filter(f => f.id !== row.id));
      }
    });

    // Journal Entry callbacks
    connection.db.journalEntry.onInsert((_ctx, row: JournalEntry) => {
      if (row.wallet === normalizedWallet) {
        setJournalEntries(prev => [row, ...prev]);
      }
    });

    connection.db.journalEntry.onUpdate((_ctx, _oldRow: JournalEntry, newRow: JournalEntry) => {
      if (newRow.wallet === normalizedWallet) {
        setJournalEntries(prev =>
          prev.map(j => (j.id === newRow.id ? newRow : j))
        );
      }
    });

    // Journal Streak callbacks
    connection.db.journalStreak.onInsert((_ctx, row: JournalStreak) => {
      if (row.wallet === normalizedWallet) {
        setJournalStreak(row);
      }
    });

    connection.db.journalStreak.onUpdate((_ctx, _oldRow: JournalStreak, newRow: JournalStreak) => {
      if (newRow.wallet === normalizedWallet) {
        setJournalStreak(newRow);
      }
    });

    // Referral callbacks
    connection.db.referral.onInsert((_ctx, row: Referral) => {
      if (row.referrerWallet === normalizedWallet || row.referredWallet === normalizedWallet) {
        setReferrals(prev => [...prev, row]);
      }
    });

    connection.db.referral.onUpdate((_ctx, _oldRow: Referral, newRow: Referral) => {
      if (newRow.referrerWallet === normalizedWallet || newRow.referredWallet === normalizedWallet) {
        setReferrals(prev =>
          prev.map(r => (r.id === newRow.id ? newRow : r))
        );
      }
    });

    // Timed Pull callbacks
    connection.db.timedPull.onInsert((_ctx, row: TimedPull) => {
      if (row.wallet === normalizedWallet) {
        setTimedPulls(prev => [...prev, row]);
      }
    });

    // Free Pull callbacks
    connection.db.freePull.onInsert((_ctx, row: FreePull) => {
      if (row.wallet === normalizedWallet) {
        setFreePull(row);
      }
    });

    connection.db.freePull.onUpdate((_ctx, _oldRow: FreePull, newRow: FreePull) => {
      if (newRow.wallet === normalizedWallet) {
        setFreePull(newRow);
      }
    });

    // RaffleEntry callbacks
    connection.db.raffleEntry.onInsert((_ctx, row: RaffleEntry) => {
      setRaffleEntries(prev => [...prev, row]);
    });

    // EmailCapture callbacks
    connection.db.emailCapture.onInsert((_ctx, row: EmailCapture) => {
      setEmailCaptures(prev => [...prev, row]);
    });

    // Mark callbacks as registered to prevent duplicates
    callbacksRegisteredRef.current = true;
  }, []);

  const subscribeToTables = useCallback((connection: DbConnection) => {
    if (!walletAddressRef.current) return;

    // Unsubscribe from current subscription if it exists
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }

    const normalizedWallet = walletAddressRef.current.toLowerCase();
    
    const queries = [
      `SELECT * FROM user WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM card_pull WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM achievement WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM xp_transaction WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM favorite WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM journal_entry WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM journal_streak WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM referral WHERE referrer_wallet = '${normalizedWallet}' OR referred_wallet = '${normalizedWallet}'`,
      `SELECT * FROM timed_pull WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM free_pull WHERE wallet = '${normalizedWallet}'`,
      `SELECT * FROM raffle_entry`,
      `SELECT * FROM email_capture`,
    ];

    subscriptionRef.current = connection
      .subscriptionBuilder()
      .onApplied(() => {
        processInitialCache(connection);
        // Register callbacks AFTER subscription is applied and cache is loaded
        registerTableCallbacks(connection);
      })
      .onError((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('SpacetimeDB subscription error:', errorMessage);
        setStatusMessage(`Subscription Error: ${errorMessage}`);
      })
      .subscribe(queries);
  }, [processInitialCache, registerTableCallbacks]);

  useEffect(() => {
    if (!walletAddress) return;

    // Initialize shared connection if not already done
    initializeConnection();

    // Listen for connection events
    const unsubscribe = addConnectionListener({
      onConnect: (connection) => {
        setConnected(true);
        setStatusMessage('Connected to database');
        subscribeToTables(connection);
      },
      onDisconnect: () => {
        setConnected(false);
        setStatusMessage('Disconnected');
        callbacksRegisteredRef.current = false;
      },
      onError: (error) => {
        setStatusMessage(`Connection Error: ${error}`);
        setConnected(false);
      },
    });

    // Check if already connected
    const existingConnection = getConnection();
    if (existingConnection) {
      setConnected(true);
      setStatusMessage('Connected to database');
      subscribeToTables(existingConnection);
    }

    return () => {
      unsubscribe();
      // Cleanup subscription on unmount
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error unsubscribing on unmount:', error);
          }
        }
      }
      // Reset callback flag to allow fresh registration on remount
      callbacksRegisteredRef.current = false;
    };
  }, [walletAddress, subscribeToTables]);

  // Reducer wrapper functions
  const createUser = useCallback((wallet: string, username: string) => {
    const connection = getConnection();
    if (!connection || !connected) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot create user: not connected');
      }
      return;
    }
    connection.reducers.createUser(wallet, username);
  }, [connected]);

  const updateUsername = useCallback((wallet: string, username: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.updateUsername(wallet, username);
  }, [connected]);

  const recordPull = useCallback((wallet: string, cardId: number, dateString: string, packId: string = 'practice_pack') => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.recordPull(wallet, cardId, dateString, packId);
  }, [connected]);

  const unlockAchievement = useCallback((wallet: string, achievementId: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.unlockAchievement(wallet, achievementId);
  }, [connected]);

  const awardXp = useCallback((wallet: string, amount: number, reason: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.awardXp(wallet, BigInt(amount), reason);
  }, [connected]);

  const toggleFavorite = useCallback((wallet: string, cardId: number, note?: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.toggleFavorite(wallet, cardId, note);
  }, [connected]);

  const saveJournalEntry = useCallback((
    wallet: string,
    cardId: number,
    date: Timestamp,
    prompt1: string,
    prompt2: string,
    prompt3: string,
    wordCount: number,
    completed: boolean
  ) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.saveJournalEntry(wallet, cardId, date, prompt1, prompt2, prompt3, wordCount, completed);
  }, [connected]);

  const createReferral = useCallback((referrerWallet: string, referredWallet: string, referredUsername: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.createReferral(referrerWallet, referredWallet, referredUsername);
  }, [connected]);

  const completeReferral = useCallback((referredWallet: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.completeReferral(referredWallet);
  }, [connected]);

  const recordFreePull = useCallback((wallet: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.recordFreePull(wallet);
  }, [connected]);

  const checkDailyLimit = useCallback((wallet: string, dateString: string) => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.checkDailyLimit(wallet, dateString);
  }, [connected]);

  const enterRaffle = useCallback((wallet: string, username: string, email: string, tokenBalance: string, usdValue: number) => {
    const connection = getConnection();
    if (!connection || !connected) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot enter raffle: not connected');
      }
      return;
    }
    connection.reducers.enterRaffle(wallet, username, email, tokenBalance, usdValue);
  }, [connected]);

  const captureEmail = useCallback((email: string, username: string, action: ActionType, wallet?: string) => {
    const connection = getConnection();
    if (!connection || !connected) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cannot capture email: not connected');
      }
      return;
    }
    connection.reducers.captureEmail(email, username, action, wallet);
  }, [connected]);

  const getRaffleEntries = useCallback(() => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.getRaffleEntries();
  }, [connected]);

  const getRaffleCount = useCallback(() => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.getRaffleCount();
  }, [connected]);

  const selectWeightedWinner = useCallback(() => {
    const connection = getConnection();
    if (!connection || !connected) return;
    connection.reducers.selectWeightedWinner();
  }, [connected]);

  return {
    connected,
    statusMessage,
    user,
    pulls,
    achievements,
    xpTransactions,
    favorites,
    journalEntries,
    journalStreak,
    referrals,
    timedPulls,
    freePull,
    createUser,
    updateUsername,
    recordPull,
    unlockAchievement,
    awardXp,
    toggleFavorite,
    saveJournalEntry,
    createReferral,
    completeReferral,
    recordFreePull,
    checkDailyLimit,
    raffleEntries,
    emailCaptures,
    enterRaffle,
    captureEmail,
    getRaffleEntries,
    getRaffleCount,
    selectWeightedWinner,
  };
}
