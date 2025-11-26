export interface UserXP {
  username: string;
  totalXP: number;
  level: number;
  lastUpdated: number;
}

export interface XPTransaction {
  username: string;
  amount: number;
  reason: string;
  timestamp: number;
}

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  progressPercent: number;
}

const XP_KEY = 'practice_xp';
const XP_TRANSACTIONS_KEY = 'practice_xp_transactions';

// XP rewards for different actions
export const XP_REWARDS = {
  PULL_CARD: 10,
  SHARE_CARD: 5,
  FAVORITE_CARD: 2,
  STREAK_DAY: 5,
  STREAK_7: 50,
  STREAK_30: 150,
  STREAK_100: 500,
  MORNING_PULL: 3,
  EVENING_PULL: 3,
  WEEKEND_PULL: 5,
  FIRST_REFERRAL: 50,
  REFERRAL: 25,
  ACHIEVEMENT_UNLOCK: 20,
  CHALLENGE_COMPLETE: 30,
  COMBO_BONUS: 10,
  JOURNAL_ENTRY: 15,
  DETAILED_JOURNAL: 10,
};

// Calculate XP needed for a level
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Get user's XP data
export function getUserXP(username: string): UserXP {
  if (typeof window === 'undefined') {
    return { username, totalXP: 0, level: 1, lastUpdated: Date.now() };
  }
  
  try {
    const data = localStorage.getItem(XP_KEY);
    if (!data) {
      return { username, totalXP: 0, level: 1, lastUpdated: Date.now() };
    }
    
    const allXP: UserXP[] = JSON.parse(data);
    const userXP = allXP.find((xp: UserXP) => xp.username === username);
    
    return userXP || { username, totalXP: 0, level: 1, lastUpdated: Date.now() };
  } catch (error) {
    console.error('Error getting user XP:', error);
    return { username, totalXP: 0, level: 1, lastUpdated: Date.now() };
  }
}

// Calculate level from total XP
export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpRequired = 0;
  
  while (xpRequired <= totalXP) {
    xpRequired += getXPForLevel(level);
    if (xpRequired <= totalXP) {
      level++;
    }
  }
  
  return level;
}

// Get level info with progress
export function getLevelInfo(username: string): LevelInfo {
  const userXP = getUserXP(username);
  const level = calculateLevel(userXP.totalXP);
  
  // Calculate XP at start of current level
  let xpAtLevelStart = 0;
  for (let i = 1; i < level; i++) {
    xpAtLevelStart += getXPForLevel(i);
  }
  
  const currentXP = userXP.totalXP - xpAtLevelStart;
  const xpForNextLevel = getXPForLevel(level);
  const progressPercent = (currentXP / xpForNextLevel) * 100;
  
  return {
    level,
    currentXP,
    xpForNextLevel,
    progressPercent,
  };
}

// Award XP to user
export function awardXP(username: string, amount: number, reason: string): {
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
  previousLevel: number;
} {
  if (typeof window === 'undefined') {
    return { newXP: 0, newLevel: 1, leveledUp: false, previousLevel: 1 };
  }
  
  try {
    const data = localStorage.getItem(XP_KEY);
    const allXP: UserXP[] = data ? JSON.parse(data) : [];
    
    const existingIndex = allXP.findIndex((xp: UserXP) => xp.username === username);
    const previousLevel = existingIndex >= 0 ? calculateLevel(allXP[existingIndex].totalXP) : 1;
    const previousXP = existingIndex >= 0 ? allXP[existingIndex].totalXP : 0;
    
    const newXP = previousXP + amount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > previousLevel;
    
    const userXP: UserXP = {
      username,
      totalXP: newXP,
      level: newLevel,
      lastUpdated: Date.now(),
    };
    
    if (existingIndex >= 0) {
      allXP[existingIndex] = userXP;
    } else {
      allXP.push(userXP);
    }
    
    localStorage.setItem(XP_KEY, JSON.stringify(allXP));
    
    // Record transaction
    recordXPTransaction(username, amount, reason);
    
    return { newXP, newLevel, leveledUp, previousLevel };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return { newXP: 0, newLevel: 1, leveledUp: false, previousLevel: 1 };
  }
}

// Record XP transaction for history
function recordXPTransaction(username: string, amount: number, reason: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(XP_TRANSACTIONS_KEY);
    const transactions: XPTransaction[] = data ? JSON.parse(data) : [];
    
    transactions.push({
      username,
      amount,
      reason,
      timestamp: Date.now(),
    });
    
    // Keep only last 100 transactions per user
    const userTransactions = transactions.filter((t: XPTransaction) => t.username === username);
    const otherTransactions = transactions.filter((t: XPTransaction) => t.username !== username);
    const limitedUserTransactions = userTransactions.slice(-100);
    
    localStorage.setItem(XP_TRANSACTIONS_KEY, JSON.stringify([...otherTransactions, ...limitedUserTransactions]));
  } catch (error) {
    console.error('Error recording XP transaction:', error);
  }
}

// Get XP leaderboard
export interface XPLeaderboardEntry {
  username: string;
  totalXP: number;
  level: number;
  rank: number;
}

export function getXPLeaderboard(): XPLeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(XP_KEY);
    if (!data) return [];
    
    const allXP: UserXP[] = JSON.parse(data);
    
    // Sort by total XP descending
    const sorted = [...allXP].sort((a: UserXP, b: UserXP) => b.totalXP - a.totalXP);
    
    return sorted.map((xp: UserXP, index: number) => ({
      username: xp.username,
      totalXP: xp.totalXP,
      level: xp.level,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('Error getting XP leaderboard:', error);
    return [];
  }
}

// Get user's XP transactions
export function getUserXPTransactions(username: string): XPTransaction[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(XP_TRANSACTIONS_KEY);
    if (!data) return [];
    
    const transactions: XPTransaction[] = JSON.parse(data);
    return transactions.filter((t: XPTransaction) => t.username === username)
      .sort((a: XPTransaction, b: XPTransaction) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error getting XP transactions:', error);
    return [];
  }
}
