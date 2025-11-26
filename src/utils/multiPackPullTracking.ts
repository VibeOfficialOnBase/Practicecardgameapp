// Multi-pack pull tracking - Each pack has independent daily pulls
// PRACTICE pack: cards 1-365
// Vibe Check pack: cards 366-465 (or 1-465 depending on implementation)

interface PackPullRecord {
  packId: string;
  cardId: number;
  date: string; // ISO date string (YYYY-MM-DD)
}

interface PackPullHistory {
  [username: string]: PackPullRecord[];
}

const STORAGE_KEY = 'practice_multi_pack_pulls';

// Get today's date as ISO string
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Load pull history from localStorage
function loadPullHistory(): PackPullHistory {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

// Save pull history to localStorage
function savePullHistory(history: PackPullHistory): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// Get user's pull history
function getUserPackPulls(username: string): PackPullRecord[] {
  const history = loadPullHistory();
  return history[username] || [];
}

// Check if user can pull from a specific pack today
export function canPullFromPackToday(username: string, packId: string): boolean {
  const today = getTodayDate();
  const pulls = getUserPackPulls(username);
  
  // Check if there's already a pull for this pack today
  return !pulls.some(pull => pull.packId === packId && pull.date === today);
}

// Get today's pulled card for a specific pack (if any)
export function getTodaysPulledCardForPack(username: string, packId: string): number | null {
  const today = getTodayDate();
  const pulls = getUserPackPulls(username);
  
  const todaysPull = pulls.find(pull => pull.packId === packId && pull.date === today);
  return todaysPull ? todaysPull.cardId : null;
}

// Get all today's pulled cards organized by pack
export function getTodaysPulledCards(username: string): Record<string, number | null> {
  const today = getTodayDate();
  const pulls = getUserPackPulls(username);
  
  const result: Record<string, number | null> = {};
  pulls.forEach(pull => {
    if (pull.date === today) {
      result[pull.packId] = pull.cardId;
    }
  });
  
  return result;
}

// Record a pull for a specific pack
export function recordPackPull(username: string, packId: string, cardId: number): void {
  const history = loadPullHistory();
  
  if (!history[username]) {
    history[username] = [];
  }
  
  const today = getTodayDate();
  
  // Remove any existing pull for this pack today (shouldn't happen, but just in case)
  history[username] = history[username].filter(
    pull => !(pull.packId === packId && pull.date === today)
  );
  
  // Add new pull record
  history[username].push({
    packId,
    cardId,
    date: today,
  });
  
  savePullHistory(history);
}

// Get random card for PRACTICE pack (cards 1-365)
export function getRandomPracticeCard(username: string): number {
  const pulls = getUserPackPulls(username).filter(pull => pull.packId === 'practice_pack');
  const pulledCardIds = pulls.map(pull => pull.cardId);
  
  // Available cards: 1-365
  const availableCards = Array.from({ length: 365 }, (_, i) => i + 1)
    .filter(id => !pulledCardIds.includes(id));
  
  // If all cards have been pulled, reset and allow any card
  if (availableCards.length === 0) {
    return Math.floor(Math.random() * 365) + 1;
  }
  
  // Pick a random card from available cards
  return availableCards[Math.floor(Math.random() * availableCards.length)];
}

// Get random card for Vibe Check pack (cards 366-465)
export function getRandomVibeCheckCard(username: string): number {
  const pulls = getUserPackPulls(username).filter(pull => pull.packId === 'vibe_check_exclusive');
  const pulledCardIds = pulls.map(pull => pull.cardId);
  
  // Available cards: 366-465
  const availableCards = Array.from({ length: 100 }, (_, i) => i + 366)
    .filter(id => !pulledCardIds.includes(id));
  
  // If all cards have been pulled, reset and allow any card
  if (availableCards.length === 0) {
    return Math.floor(Math.random() * 100) + 366;
  }
  
  // Pick a random card from available cards
  return availableCards[Math.floor(Math.random() * availableCards.length)];
}

// Get random card for any pack based on its card range
export function getRandomCardForPack(username: string, packId: string, startCard: number, endCard: number): number {
  const pulls = getUserPackPulls(username).filter(pull => pull.packId === packId);
  const pulledCardIds = pulls.map(pull => pull.cardId);
  
  const cardCount = endCard - startCard + 1;
  const availableCards = Array.from({ length: cardCount }, (_, i) => i + startCard)
    .filter(id => !pulledCardIds.includes(id));
  
  // If all cards have been pulled, reset and allow any card
  if (availableCards.length === 0) {
    return Math.floor(Math.random() * cardCount) + startCard;
  }
  
  // Pick a random card from available cards
  return availableCards[Math.floor(Math.random() * availableCards.length)];
}

// Get ALL historically pulled card IDs from all packs (for Cards tab display)
export function getAllPulledCardIds(username: string): number[] {
  const pulls = getUserPackPulls(username);
  const cardIds = pulls.map(pull => pull.cardId);
  return Array.from(new Set(cardIds)); // Remove duplicates
}
