export interface JournalEntry {
  id: string;
  cardId: number;
  userId: string;
  date: number;
  responses: {
    prompt1: string;
    prompt2: string;
    prompt3: string;
  };
  wordCount: number;
  completed: boolean;
}

export interface JournalStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: number;
}

const JOURNAL_KEY = 'practice_journal_entries';
const JOURNAL_STREAK_KEY = 'practice_journal_streaks';

// Get all journal entries for a user
export function getUserJournalEntries(userId: string): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    if (!data) return [];
    
    const allEntries: JournalEntry[] = JSON.parse(data);
    return allEntries
      .filter((entry: JournalEntry) => entry.userId === userId)
      .sort((a: JournalEntry, b: JournalEntry) => b.date - a.date);
  } catch (error) {
    console.error('Error getting journal entries:', error);
    return [];
  }
}

// Get journal entry for specific card
export function getJournalEntryForCard(userId: string, cardId: number): JournalEntry | null {
  const entries = getUserJournalEntries(userId);
  return entries.find((entry: JournalEntry) => entry.cardId === cardId) || null;
}

// Save journal entry
export function saveJournalEntry(entry: JournalEntry): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    const allEntries: JournalEntry[] = data ? JSON.parse(data) : [];
    
    // Check if entry already exists
    const existingIndex = allEntries.findIndex(
      (e: JournalEntry) => e.userId === entry.userId && e.cardId === entry.cardId
    );
    
    if (existingIndex >= 0) {
      allEntries[existingIndex] = entry;
    } else {
      allEntries.push(entry);
    }
    
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(allEntries));
    
    // Update streak
    updateJournalStreak(entry.userId);
    
    return true;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return false;
  }
}

// Calculate word count
export function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Get total word count for user
export function getTotalWordCount(userId: string): number {
  const entries = getUserJournalEntries(userId);
  return entries.reduce((total: number, entry: JournalEntry) => total + entry.wordCount, 0);
}

// Get journal statistics
export interface JournalStats {
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
  longestStreak: number;
  averageWordCount: number;
  longestEntry: number;
}

export function getJournalStats(userId: string): JournalStats {
  const entries = getUserJournalEntries(userId);
  const streak = getJournalStreak(userId);
  
  const totalWords = getTotalWordCount(userId);
  const longestEntry = entries.length > 0 
    ? Math.max(...entries.map((e: JournalEntry) => e.wordCount))
    : 0;
  
  return {
    totalEntries: entries.length,
    totalWords,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    averageWordCount: entries.length > 0 ? Math.round(totalWords / entries.length) : 0,
    longestEntry,
  };
}

// Get journal streak
export function getJournalStreak(userId: string): JournalStreak {
  if (typeof window === 'undefined') {
    return { userId, currentStreak: 0, longestStreak: 0, lastEntryDate: 0 };
  }
  
  try {
    const data = localStorage.getItem(JOURNAL_STREAK_KEY);
    if (!data) {
      return { userId, currentStreak: 0, longestStreak: 0, lastEntryDate: 0 };
    }
    
    const allStreaks: JournalStreak[] = JSON.parse(data);
    const userStreak = allStreaks.find((s: JournalStreak) => s.userId === userId);
    
    return userStreak || { userId, currentStreak: 0, longestStreak: 0, lastEntryDate: 0 };
  } catch (error) {
    console.error('Error getting journal streak:', error);
    return { userId, currentStreak: 0, longestStreak: 0, lastEntryDate: 0 };
  }
}

// Update journal streak
function updateJournalStreak(userId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(JOURNAL_STREAK_KEY);
    const allStreaks: JournalStreak[] = data ? JSON.parse(data) : [];
    
    const existingIndex = allStreaks.findIndex((s: JournalStreak) => s.userId === userId);
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (existingIndex >= 0) {
      const streak = allStreaks[existingIndex];
      const daysSinceLastEntry = Math.floor((now - streak.lastEntryDate) / oneDayMs);
      
      if (daysSinceLastEntry === 0) {
        // Same day, no change
        return;
      } else if (daysSinceLastEntry === 1) {
        // Consecutive day
        streak.currentStreak++;
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
      } else {
        // Streak broken
        streak.currentStreak = 1;
      }
      
      streak.lastEntryDate = now;
      allStreaks[existingIndex] = streak;
    } else {
      allStreaks.push({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastEntryDate: now,
      });
    }
    
    localStorage.setItem(JOURNAL_STREAK_KEY, JSON.stringify(allStreaks));
  } catch (error) {
    console.error('Error updating journal streak:', error);
  }
}

// Search journal entries
export function searchJournalEntries(userId: string, query: string): JournalEntry[] {
  const entries = getUserJournalEntries(userId);
  const lowerQuery = query.toLowerCase();
  
  return entries.filter((entry: JournalEntry) => {
    const searchText = `${entry.responses.prompt1} ${entry.responses.prompt2} ${entry.responses.prompt3}`.toLowerCase();
    return searchText.includes(lowerQuery);
  });
}

// Delete journal entry
export function deleteJournalEntry(userId: string, cardId: number): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    if (!data) return false;
    
    const allEntries: JournalEntry[] = JSON.parse(data);
    const filteredEntries = allEntries.filter(
      (entry: JournalEntry) => !(entry.userId === userId && entry.cardId === cardId)
    );
    
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(filteredEntries));
    return true;
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return false;
  }
}
