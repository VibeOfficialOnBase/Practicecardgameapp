export interface Referral {
  referrerUsername: string;
  referredUsername: string;
  referredAddress?: string;
  timestamp: number;
  completed: boolean;
}

const REFERRALS_KEY = 'practice_referrals';
const REFERRAL_CODE_KEY = 'practice_referral_code';

// Generate a unique referral code for a user
export function generateReferralCode(username: string): string {
  // Create a simple hash of the username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const code = Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
  return `PRACTICE-${code}`;
}

// Get user's referral code
export function getReferralCode(username: string): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const data = localStorage.getItem(REFERRAL_CODE_KEY);
    if (!data) {
      const code = generateReferralCode(username);
      localStorage.setItem(REFERRAL_CODE_KEY, JSON.stringify({ [username]: code }));
      return code;
    }
    
    const codes: Record<string, string> = JSON.parse(data);
    if (!codes[username]) {
      codes[username] = generateReferralCode(username);
      localStorage.setItem(REFERRAL_CODE_KEY, JSON.stringify(codes));
    }
    
    return codes[username];
  } catch (error) {
    console.error('Error getting referral code:', error);
    return generateReferralCode(username);
  }
}

// Record a referral
export function recordReferral(referrerUsername: string, referredUsername: string, referredAddress?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(REFERRALS_KEY);
    const referrals: Referral[] = data ? JSON.parse(data) : [];
    
    referrals.push({
      referrerUsername,
      referredUsername,
      referredAddress,
      timestamp: Date.now(),
      completed: false,
    });
    
    localStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
  } catch (error) {
    console.error('Error recording referral:', error);
  }
}

// Mark referral as completed (when referred user pulls first card)
export function completeReferral(referredUsername: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(REFERRALS_KEY);
    if (!data) return;
    
    const referrals: Referral[] = JSON.parse(data);
    const referral = referrals.find((r: Referral) => r.referredUsername === referredUsername);
    
    if (referral) {
      referral.completed = true;
      localStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
    }
  } catch (error) {
    console.error('Error completing referral:', error);
  }
}

// Get referral count for user
export function getReferralCount(username: string, onlyCompleted: boolean = false): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(REFERRALS_KEY);
    if (!data) return 0;
    
    const referrals: Referral[] = JSON.parse(data);
    const userReferrals = referrals.filter((r: Referral) => r.referrerUsername === username);
    
    if (onlyCompleted) {
      return userReferrals.filter((r: Referral) => r.completed).length;
    }
    
    return userReferrals.length;
  } catch (error) {
    console.error('Error getting referral count:', error);
    return 0;
  }
}

// Get user's referrals
export function getUserReferrals(username: string): Referral[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(REFERRALS_KEY);
    if (!data) return [];
    
    const referrals: Referral[] = JSON.parse(data);
    return referrals.filter((r: Referral) => r.referrerUsername === username)
      .sort((a: Referral, b: Referral) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error getting user referrals:', error);
    return [];
  }
}
