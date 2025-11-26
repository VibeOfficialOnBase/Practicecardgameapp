import { getUserPulls, type UserPull } from './pullTracking';

export interface TimedPull {
  username: string;
  cardId: number;
  timestamp: number;
  hour: number;
  dayOfWeek: number;
  isMorning: boolean;
  isEvening: boolean;
  isWeekend: boolean;
}

const TIMED_PULLS_KEY = 'practice_timed_pulls';

export function recordTimedPull(username: string, cardId: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const now = new Date();
    const data = localStorage.getItem(TIMED_PULLS_KEY);
    const timedPulls: TimedPull[] = data ? JSON.parse(data) : [];
    
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    timedPulls.push({
      username,
      cardId,
      timestamp: Date.now(),
      hour,
      dayOfWeek,
      isMorning: hour >= 5 && hour < 12,
      isEvening: hour >= 21 || hour < 5,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
    
    localStorage.setItem(TIMED_PULLS_KEY, JSON.stringify(timedPulls));
  } catch (error) {
    console.error('Error recording timed pull:', error);
  }
}

export function getMorningPullStreak(username: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(TIMED_PULLS_KEY);
    if (!data) return 0;
    
    const timedPulls: TimedPull[] = JSON.parse(data);
    const userPulls = timedPulls.filter((p: TimedPull) => p.username === username && p.isMorning)
      .sort((a: TimedPull, b: TimedPull) => b.timestamp - a.timestamp);
    
    if (userPulls.length === 0) return 0;
    
    let streak = 1;
    for (let i = 0; i < userPulls.length - 1; i++) {
      const current = new Date(userPulls[i].timestamp);
      const next = new Date(userPulls[i + 1].timestamp);
      
      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error getting morning pull streak:', error);
    return 0;
  }
}

export function getEveningPullStreak(username: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(TIMED_PULLS_KEY);
    if (!data) return 0;
    
    const timedPulls: TimedPull[] = JSON.parse(data);
    const userPulls = timedPulls.filter((p: TimedPull) => p.username === username && p.isEvening)
      .sort((a: TimedPull, b: TimedPull) => b.timestamp - a.timestamp);
    
    if (userPulls.length === 0) return 0;
    
    let streak = 1;
    for (let i = 0; i < userPulls.length - 1; i++) {
      const current = new Date(userPulls[i].timestamp);
      const next = new Date(userPulls[i + 1].timestamp);
      
      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error getting evening pull streak:', error);
    return 0;
  }
}

export function getWeekendPullStreak(username: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(TIMED_PULLS_KEY);
    if (!data) return 0;
    
    const timedPulls: TimedPull[] = JSON.parse(data);
    const userPulls = timedPulls.filter((p: TimedPull) => p.username === username && p.isWeekend)
      .sort((a: TimedPull, b: TimedPull) => b.timestamp - a.timestamp);
    
    if (userPulls.length === 0) return 0;
    
    // Count consecutive weekends (Saturday or Sunday)
    let streak = 1;
    const weekends = new Set<string>();
    
    for (const pull of userPulls) {
      const date = new Date(pull.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Get Sunday of this week
      const weekKey = weekStart.toDateString();
      weekends.add(weekKey);
    }
    
    return weekends.size;
  } catch (error) {
    console.error('Error getting weekend pull streak:', error);
    return 0;
  }
}

export function hasStreakBroken(username: string): boolean {
  const pulls = getUserPulls(username);
  if (pulls.length < 7) return false;
  
  // Check if user had a 7+ day streak that broke and restarted
  let maxStreak = 0;
  let currentStreak = 1;
  
  for (let i = pulls.length - 1; i > 0; i--) {
    const current = new Date(pulls[i].date);
    const prev = new Date(pulls[i - 1].date);
    const diffTime = Math.abs(current.getTime() - prev.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      if (currentStreak >= 7) {
        return true;
      }
      currentStreak = 1;
    }
  }
  
  return false;
}
