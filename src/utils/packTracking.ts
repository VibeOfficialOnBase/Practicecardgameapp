import type { VibeCheckPack } from '@/data/vibeCheckPacks';

const PACK_STORAGE_KEY = 'vibe_check_packs';

export interface UserPackClaim {
  packId: string;
  claimDate: number;
  timesUsed: number;
}

export interface UserPackCollection {
  claimedPacks: UserPackClaim[];
}

// Get user's pack collection from localStorage
export function getUserPackCollection(walletAddress: string): UserPackCollection {
  if (typeof window === 'undefined') {
    return {
      claimedPacks: [],
    };
  }

  const storageKey = `${PACK_STORAGE_KEY}_${walletAddress.toLowerCase()}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return {
      claimedPacks: [],
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      claimedPacks: [],
    };
  }
}

// Save user's pack collection to localStorage
export function saveUserPackCollection(
  walletAddress: string,
  collection: UserPackCollection
): void {
  if (typeof window === 'undefined') return;

  const storageKey = `${PACK_STORAGE_KEY}_${walletAddress.toLowerCase()}`;
  localStorage.setItem(storageKey, JSON.stringify(collection));
}

// Check if user has claimed a specific pack
export function hasClaimedPack(walletAddress: string, packId: string): boolean {
  const collection = getUserPackCollection(walletAddress);
  return collection.claimedPacks.some(claim => claim.packId === packId);
}

// Claim a new pack
export function claimPack(walletAddress: string, packId: string): boolean {
  try {
    if (!walletAddress || !packId) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[packTracking] Invalid parameters:', { walletAddress, packId });
      }
      return false;
    }

    const collection = getUserPackCollection(walletAddress);

    // Check if already claimed
    if (hasClaimedPack(walletAddress, packId)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[packTracking] Pack already claimed:', packId);
      }
      return false;
    }

    // Add new claim
    collection.claimedPacks.push({
      packId,
      claimDate: Date.now(),
      timesUsed: 0,
    });

    saveUserPackCollection(walletAddress, collection);
    if (process.env.NODE_ENV === 'development') {
      console.log('[packTracking] Successfully claimed pack:', packId);
    }
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[packTracking] Error claiming pack:', error);
    }
    return false;
  }
}



// Get claimed packs
export function getClaimedPacks(walletAddress: string): UserPackClaim[] {
  const collection = getUserPackCollection(walletAddress);
  return collection.claimedPacks;
}

// Get pack stats
export function getPackStats(walletAddress: string, packId: string): {
  timesUsed: number;
  claimDate: number | null;
} {
  const collection = getUserPackCollection(walletAddress);
  const claim = collection.claimedPacks.find(c => c.packId === packId);

  return {
    timesUsed: claim?.timesUsed || 0,
    claimDate: claim?.claimDate || null,
  };
}

// Increment pack usage
export function incrementPackUsage(walletAddress: string, packId: string): void {
  const collection = getUserPackCollection(walletAddress);
  const claim = collection.claimedPacks.find(c => c.packId === packId);

  if (claim) {
    claim.timesUsed++;
    saveUserPackCollection(walletAddress, collection);
  }
}
