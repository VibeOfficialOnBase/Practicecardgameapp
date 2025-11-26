export interface UserPull {
  username: string;
  cardId: number;
  timestamp: number;
  date: string;
}

export interface LeaderboardEntry {
  username: string;
  streak: number;
  totalPulls: number;
  lastPull: string;
}

const STORAGE_KEY = 'practice_pulls';
const LEADERBOARD_KEY = 'practice_leaderboard';

export function canPullToday(username: string): boolean {
  const pulls = getUserPulls(username);
  const today = new Date().toDateString();
  const lastPull = pulls[pulls.length - 1];
  
  if (!lastPull) return true;
  
  return lastPull.date !== today;
}

export function getUserPulls(username: string): UserPull[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const allPulls: UserPull[] = JSON.parse(data);
    return allPulls.filter((pull: UserPull) => pull.username === username);
  } catch (error) {
    console.error('Error getting user pulls:', error);
    return [];
  }
}

export function recordPull(username: string, cardId: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const allPulls: UserPull[] = data ? JSON.parse(data) : [];
    
    const newPull: UserPull = {
      username,
      cardId,
      timestamp: Date.now(),
      date: new Date().toDateString(),
    };
    
    allPulls.push(newPull);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPulls));
    
    // Update leaderboard
    updateLeaderboard(username);
  } catch (error) {
    console.error('Error recording pull:', error);
  }
}

export function updateLeaderboard(username: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const pulls = getUserPulls(username);
    const data = localStorage.getItem(LEADERBOARD_KEY);
    const leaderboard: LeaderboardEntry[] = data ? JSON.parse(data) : [];
    
    // Calculate streak
    const streak = calculateStreak(pulls);
    
    // Find or create user entry
    const existingIndex = leaderboard.findIndex((entry: LeaderboardEntry) => entry.username === username);
    
    const entry: LeaderboardEntry = {
      username,
      streak,
      totalPulls: pulls.length,
      lastPull: pulls[pulls.length - 1]?.date || '',
    };
    
    if (existingIndex >= 0) {
      leaderboard[existingIndex] = entry;
    } else {
      leaderboard.push(entry);
    }
    
    // Sort by streak (descending), then by total pulls
    leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
      if (b.streak !== a.streak) return b.streak - a.streak;
      return b.totalPulls - a.totalPulls;
    });
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

function calculateStreak(pulls: UserPull[]): number {
  if (pulls.length === 0) return 0;
  
  let streak = 1;
  const sortedPulls = [...pulls].sort((a: UserPull, b: UserPull) => b.timestamp - a.timestamp);
  
  for (let i = 0; i < sortedPulls.length - 1; i++) {
    const currentDate = new Date(sortedPulls[i].date);
    const nextDate = new Date(sortedPulls[i + 1].date);
    
    const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getRandomCardId(username: string, maxCardId: number = 365): number {
  // Use username as seed for consistent randomization per user per day
  const today = new Date().toDateString();
  const seed = username + today;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to positive number between 1 and maxCardId
  const randomId = (Math.abs(hash) % maxCardId) + 1;
  return randomId;
}
