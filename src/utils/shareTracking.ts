export interface ShareRecord {
  username: string;
  cardId: number;
  timestamp: number;
  platform?: string;
}

const SHARES_KEY = 'practice_shares';

export function getShareCount(username: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(SHARES_KEY);
    if (!data) return 0;
    
    const allShares: ShareRecord[] = JSON.parse(data);
    return allShares.filter((share: ShareRecord) => share.username === username).length;
  } catch (error) {
    console.error('Error getting share count:', error);
    return 0;
  }
}

export function recordShare(username: string, cardId: number, platform?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(SHARES_KEY);
    const allShares: ShareRecord[] = data ? JSON.parse(data) : [];
    
    allShares.push({
      username,
      cardId,
      timestamp: Date.now(),
      platform,
    });
    
    localStorage.setItem(SHARES_KEY, JSON.stringify(allShares));
  } catch (error) {
    console.error('Error recording share:', error);
  }
}

export function getSharesToday(username: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(SHARES_KEY);
    if (!data) return 0;
    
    const today = new Date().toDateString();
    const allShares: ShareRecord[] = JSON.parse(data);
    
    return allShares.filter((share: ShareRecord) => {
      const shareDate = new Date(share.timestamp).toDateString();
      return share.username === username && shareDate === today;
    }).length;
  } catch (error) {
    console.error('Error getting today\'s shares:', error);
    return 0;
  }
}

export function getUserShares(username: string): ShareRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(SHARES_KEY);
    if (!data) return [];
    
    const allShares: ShareRecord[] = JSON.parse(data);
    return allShares.filter((share: ShareRecord) => share.username === username)
      .sort((a: ShareRecord, b: ShareRecord) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error getting user shares:', error);
    return [];
  }
}
