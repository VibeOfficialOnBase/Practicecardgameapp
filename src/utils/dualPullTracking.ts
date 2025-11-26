// Dual Pull Tracking - Separate tracking for PRACTICE and Vibe Check pulls

export interface DualPullRecord {
  date: string;
  practicePull: {
    cardId: number;
    timestamp: number;
  } | null;
  vibeCheckPull: {
    cardId: number;
    timestamp: number;
  } | null;
}

const DUAL_PULL_STORAGE_KEY = 'practice_dual_pulls';

// Get all dual pull records for a user
export function getDualPullHistory(username: string): DualPullRecord[] {
  if (typeof window === 'undefined') return [];

  const storageKey = `${DUAL_PULL_STORAGE_KEY}_${username}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Save dual pull history
function saveDualPullHistory(username: string, history: DualPullRecord[]): void {
  if (typeof window === 'undefined') return;

  const storageKey = `${DUAL_PULL_STORAGE_KEY}_${username}`;
  localStorage.setItem(storageKey, JSON.stringify(history));
}

// Get today's dual pull record
export function getTodaysDualPull(username: string): DualPullRecord | null {
  const history = getDualPullHistory(username);
  const today = new Date().toISOString().split('T')[0];

  return history.find(record => record.date === today) || null;
}

// Check if user can pull PRACTICE card today
export function canPullPracticeToday(username: string): boolean {
  const todaysPull = getTodaysDualPull(username);
  return !todaysPull || !todaysPull.practicePull;
}

// Check if user can pull Vibe Check card today
export function canPullVibeCheckToday(username: string): boolean {
  const todaysPull = getTodaysDualPull(username);
  return !todaysPull || !todaysPull.vibeCheckPull;
}

// Record PRACTICE pull
export function recordPracticePull(username: string, cardId: number): void {
  const history = getDualPullHistory(username);
  const today = new Date().toISOString().split('T')[0];

  let todaysPull = history.find(record => record.date === today);

  if (!todaysPull) {
    todaysPull = {
      date: today,
      practicePull: null,
      vibeCheckPull: null,
    };
    history.push(todaysPull);
  }

  todaysPull.practicePull = {
    cardId,
    timestamp: Date.now(),
  };

  saveDualPullHistory(username, history);
}

// Record Vibe Check pull
export function recordVibeCheckPull(username: string, cardId: number): void {
  const history = getDualPullHistory(username);
  const today = new Date().toISOString().split('T')[0];

  let todaysPull = history.find(record => record.date === today);

  if (!todaysPull) {
    todaysPull = {
      date: today,
      practicePull: null,
      vibeCheckPull: null,
    };
    history.push(todaysPull);
  }

  todaysPull.vibeCheckPull = {
    cardId,
    timestamp: Date.now(),
  };

  saveDualPullHistory(username, history);
}

// Get random card ID from PRACTICE pack (1-365)
export function getRandomPracticeCardId(username: string): number {
  const history = getDualPullHistory(username);
  const pulledPracticeIds = history
    .filter(record => record.practicePull)
    .map(record => record.practicePull!.cardId);

  // If user has pulled all 365 cards, reset
  if (pulledPracticeIds.length >= 365) {
    return Math.floor(Math.random() * 365) + 1;
  }

  // Find unpulled cards
  const availableIds = Array.from({ length: 365 }, (_, i) => i + 1).filter(
    id => !pulledPracticeIds.includes(id)
  );

  // Return random unpulled card
  return availableIds[Math.floor(Math.random() * availableIds.length)];
}

// Get random card ID from Vibe Check pack (366-465)
export function getRandomVibeCheckCardId(username: string): number {
  const history = getDualPullHistory(username);
  const pulledVibeCheckIds = history
    .filter(record => record.vibeCheckPull)
    .map(record => record.vibeCheckPull!.cardId);

  // If user has pulled all 100 Vibe Check cards, reset
  if (pulledVibeCheckIds.length >= 100) {
    return Math.floor(Math.random() * 100) + 366;
  }

  // Find unpulled Vibe Check cards
  const availableIds = Array.from({ length: 100 }, (_, i) => i + 366).filter(
    id => !pulledVibeCheckIds.includes(id)
  );

  // Return random unpulled card
  return availableIds[Math.floor(Math.random() * availableIds.length)];
}

// Get total PRACTICE pulls
export function getTotalPracticePulls(username: string): number {
  const history = getDualPullHistory(username);
  return history.filter(record => record.practicePull).length;
}

// Get total Vibe Check pulls
export function getTotalVibeCheckPulls(username: string): number {
  const history = getDualPullHistory(username);
  return history.filter(record => record.vibeCheckPull).length;
}

// Get today's pulled cards
export function getTodaysPulledCards(username: string): {
  practiceCard: number | null;
  vibeCheckCard: number | null;
} {
  const todaysPull = getTodaysDualPull(username);

  return {
    practiceCard: todaysPull?.practicePull?.cardId || null,
    vibeCheckCard: todaysPull?.vibeCheckPull?.cardId || null,
  };
}
