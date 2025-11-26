export interface Challenge {
  id: string;
  type: 'daily' | 'weekly';
  name: string;
  description: string;
  requirement: {
    action: string;
    target: number;
    current: number;
  };
  xpReward: number;
  endDate: number;
  icon: string;
}

export interface UserChallenge {
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: number;
}

const CHALLENGES_KEY = 'practice_active_challenges';
const USER_CHALLENGES_KEY = 'practice_user_challenges';

// Generate daily challenges
export function generateDailyChallenge(): Challenge {
  const now = Date.now();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const dailyChallenges = [
    {
      id: `daily_${new Date().toDateString()}`,
      type: 'daily' as const,
      name: 'Morning Momentum',
      description: 'Pull your card before 9 AM',
      requirement: { action: 'morning_pull', target: 1, current: 0 },
      xpReward: 30,
      icon: '☀️',
    },
    {
      id: `daily_${new Date().toDateString()}`,
      type: 'daily' as const,
      name: 'Social Butterfly',
      description: 'Share your card on 2 different platforms',
      requirement: { action: 'share', target: 2, current: 0 },
      xpReward: 40,
      icon: '🦋',
    },
    {
      id: `daily_${new Date().toDateString()}`,
      type: 'daily' as const,
      name: 'Reflective Soul',
      description: 'Write a journal entry with 100+ words',
      requirement: { action: 'journal_words', target: 100, current: 0 },
      xpReward: 50,
      icon: '📖',
    },
    {
      id: `daily_${new Date().toDateString()}`,
      type: 'daily' as const,
      name: 'Combo Master',
      description: 'Pull card, favorite it, and share it within 1 hour',
      requirement: { action: 'combo', target: 1, current: 0 },
      xpReward: 60,
      icon: '⚡',
    },
    {
      id: `daily_${new Date().toDateString()}`,
      type: 'daily' as const,
      name: 'Collection Curator',
      description: 'Favorite 3 cards from your collection',
      requirement: { action: 'favorite', target: 3, current: 0 },
      xpReward: 35,
      icon: '⭐',
    },
  ];
  
  const challenge = dailyChallenges[new Date().getDay() % dailyChallenges.length];
  
  return {
    ...challenge,
    endDate: endOfDay.getTime(),
  };
}

// Generate weekly challenges
export function generateWeeklyChallenges(): Challenge[] {
  const now = Date.now();
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  
  const weekId = `week_${Math.floor(now / (7 * 24 * 60 * 60 * 1000))}`;
  
  return [
    {
      id: `${weekId}_streak`,
      type: 'weekly',
      name: 'Perfect Week',
      description: 'Pull cards all 7 days this week',
      requirement: { action: 'daily_pulls', target: 7, current: 0 },
      xpReward: 150,
      endDate: endOfWeek.getTime(),
      icon: '🔥',
    },
    {
      id: `${weekId}_social`,
      type: 'weekly',
      name: 'Vibe Spreader',
      description: 'Share your cards 5 times this week',
      requirement: { action: 'shares', target: 5, current: 0 },
      xpReward: 100,
      endDate: endOfWeek.getTime(),
      icon: '📢',
    },
    {
      id: `${weekId}_journal`,
      type: 'weekly',
      name: 'Dedicated Journaler',
      description: 'Write journal entries 5 days this week',
      requirement: { action: 'journal_entries', target: 5, current: 0 },
      xpReward: 125,
      endDate: endOfWeek.getTime(),
      icon: '✍️',
    },
  ];
}

// Get active challenges
export function getActiveChallenges(): Challenge[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(CHALLENGES_KEY);
    if (!data) {
      // Initialize new challenges
      const daily = generateDailyChallenge();
      const weekly = generateWeeklyChallenges();
      const challenges = [daily, ...weekly];
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
      return challenges;
    }
    
    const challenges: Challenge[] = JSON.parse(data);
    const now = Date.now();
    
    // Check if challenges need to be refreshed
    const needsRefresh = challenges.some((c: Challenge) => c.endDate < now);
    
    if (needsRefresh) {
      const daily = generateDailyChallenge();
      const weekly = generateWeeklyChallenges();
      const newChallenges = [daily, ...weekly];
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(newChallenges));
      return newChallenges;
    }
    
    return challenges;
  } catch (error) {
    console.error('Error getting active challenges:', error);
    return [];
  }
}

// Get user progress on challenges
export function getUserChallengeProgress(userId: string, challengeId: string): UserChallenge | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(USER_CHALLENGES_KEY);
    if (!data) return null;
    
    const allProgress: UserChallenge[] = JSON.parse(data);
    return allProgress.find(
      (p: UserChallenge) => p.userId === userId && p.challengeId === challengeId
    ) || null;
  } catch (error) {
    console.error('Error getting user challenge progress:', error);
    return null;
  }
}

// Update challenge progress
export function updateChallengeProgress(
  userId: string,
  challengeId: string,
  increment: number
): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = localStorage.getItem(USER_CHALLENGES_KEY);
    const allProgress: UserChallenge[] = data ? JSON.parse(data) : [];
    
    const existingIndex = allProgress.findIndex(
      (p: UserChallenge) => p.userId === userId && p.challengeId === challengeId
    );
    
    if (existingIndex >= 0) {
      allProgress[existingIndex].progress += increment;
    } else {
      allProgress.push({
        challengeId,
        userId,
        progress: increment,
        completed: false,
      });
    }
    
    localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return false;
  }
}

// Complete challenge
export function completeChallenge(userId: string, challengeId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = localStorage.getItem(USER_CHALLENGES_KEY);
    const allProgress: UserChallenge[] = data ? JSON.parse(data) : [];
    
    const existingIndex = allProgress.findIndex(
      (p: UserChallenge) => p.userId === userId && p.challengeId === challengeId
    );
    
    if (existingIndex >= 0) {
      allProgress[existingIndex].completed = true;
      allProgress[existingIndex].completedAt = Date.now();
      localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(allProgress));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error completing challenge:', error);
    return false;
  }
}

// Get completed challenges count for user
export function getCompletedChallengesCount(userId: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(USER_CHALLENGES_KEY);
    if (!data) return 0;
    
    const allProgress: UserChallenge[] = JSON.parse(data);
    return allProgress.filter(
      (p: UserChallenge) => p.userId === userId && p.completed
    ).length;
  } catch (error) {
    console.error('Error getting completed challenges count:', error);
    return 0;
  }
}
