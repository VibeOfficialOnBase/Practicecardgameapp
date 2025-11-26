// Track user's first pull per wallet address
// Now used for tutorial/onboarding tracking since all pulls are free for everyone

const FREE_PULL_KEY = 'practice_free_pulls';

interface FreePullRecord {
  [walletAddress: string]: {
    used: boolean;
    timestamp: number;
  };
}

// Check if wallet has already used their free pull
export function hasUsedFreePull(walletAddress: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const records = localStorage.getItem(FREE_PULL_KEY);
    if (!records) return false;
    
    const pullRecords: FreePullRecord = JSON.parse(records);
    return pullRecords[walletAddress]?.used || false;
  } catch (error) {
    console.error('Error checking free pull status:', error);
    return false;
  }
}

// Record that wallet has used their free pull
export function recordFreePull(walletAddress: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const records = localStorage.getItem(FREE_PULL_KEY);
    const pullRecords: FreePullRecord = records ? JSON.parse(records) : {};
    
    pullRecords[walletAddress] = {
      used: true,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(FREE_PULL_KEY, JSON.stringify(pullRecords));
  } catch (error) {
    console.error('Error recording free pull:', error);
  }
}

// Check if user is eligible for a pull (either free first pull OR has enough tokens)
export function isEligibleForPull(
  walletAddress: string,
  hasEnoughTokens: boolean
): {
  eligible: boolean;
  reason: 'free_pull' | 'has_tokens' | 'needs_tokens';
  message: string;
} {
  const usedFreePull = hasUsedFreePull(walletAddress);
  
  // Everyone is eligible for daily pulls - it's free for all!
  // First-time users get a welcome message
  if (!usedFreePull) {
    return {
      eligible: true,
      reason: 'free_pull',
      message: '✨ Welcome to PRACTICE! Pull your first card and start your journey.',
    };
  }
  
  // Regular daily pull message
  return {
    eligible: true,
    reason: 'has_tokens',
    message: hasEnoughTokens 
      ? '💎 $VibeOfficial holder - you have exclusive perks unlocked!'
      : '✨ Your daily card is ready! $VibeOfficial holders get exclusive perks.',
  };
}
