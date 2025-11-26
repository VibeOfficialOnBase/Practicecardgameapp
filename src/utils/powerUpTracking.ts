export interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: string;
  duration: number; // in milliseconds, 0 for permanent
  cost: { xp?: number; vibe?: number };
  icon: string;
  category: 'boost' | 'protection' | 'utility';
}

export interface ActivePowerUp {
  powerUpId: string;
  userId: string;
  activatedAt: number;
  expiresAt: number;
}

export const POWER_UPS: PowerUp[] = [
  {
    id: 'xp_2x_24h',
    name: '2x XP Boost',
    description: 'Double all XP earned for 24 hours',
    effect: '2x XP multiplier',
    duration: 24 * 60 * 60 * 1000,
    cost: { xp: 100 },
    icon: '⚡',
    category: 'boost',
  },
  {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protects your streak if you miss one day',
    effect: 'One-time streak protection',
    duration: 0, // Permanent until used
    cost: { xp: 500 },
    icon: '🛡️',
    category: 'protection',
  },
  {
    id: 'rarity_boost',
    name: 'Rarity Charm',
    description: '+20% chance for rare cards on your next pull',
    effect: 'Increased rare card probability',
    duration: 0, // One-time use
    cost: { xp: 200 },
    icon: '🎴',
    category: 'boost',
  },
  {
    id: 'xp_boost_week',
    name: 'Weekly XP Boost',
    description: '1.5x XP for 7 days',
    effect: '1.5x XP multiplier',
    duration: 7 * 24 * 60 * 60 * 1000,
    cost: { xp: 350 },
    icon: '✨',
    category: 'boost',
  },
  {
    id: 'journal_boost',
    name: 'Journaler\'s Gift',
    description: '2x XP from journaling for 7 days',
    effect: '2x journal XP',
    duration: 7 * 24 * 60 * 60 * 1000,
    cost: { xp: 250 },
    icon: '📖',
    category: 'boost',
  },
  {
    id: 'social_amplifier',
    name: 'Social Amplifier',
    description: '3x XP from sharing for 3 days',
    effect: '3x share XP',
    duration: 3 * 24 * 60 * 60 * 1000,
    cost: { xp: 150 },
    icon: '📢',
    category: 'boost',
  },
  {
    id: 'challenge_boost',
    name: 'Challenge Champion',
    description: '+50% XP from challenges for 7 days',
    effect: '1.5x challenge XP',
    duration: 7 * 24 * 60 * 60 * 1000,
    cost: { xp: 300 },
    icon: '🏆',
    category: 'boost',
  },
];

const POWER_UPS_KEY = 'practice_active_powerups';
const POWER_UP_INVENTORY_KEY = 'practice_powerup_inventory';

// Get active power-ups for user
export function getActivePowerUps(userId: string): ActivePowerUp[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(POWER_UPS_KEY);
    if (!data) return [];
    
    const allPowerUps: ActivePowerUp[] = JSON.parse(data);
    const now = Date.now();
    
    // Filter out expired power-ups
    const activePowerUps = allPowerUps.filter(
      (p: ActivePowerUp) => p.userId === userId && (p.expiresAt === 0 || p.expiresAt > now)
    );
    
    // Update storage if any were expired
    if (activePowerUps.length !== allPowerUps.filter((p: ActivePowerUp) => p.userId === userId).length) {
      const otherUserPowerUps = allPowerUps.filter((p: ActivePowerUp) => p.userId !== userId);
      localStorage.setItem(POWER_UPS_KEY, JSON.stringify([...otherUserPowerUps, ...activePowerUps]));
    }
    
    return activePowerUps;
  } catch (error) {
    console.error('Error getting active power-ups:', error);
    return [];
  }
}

// Check if user has specific power-up active
export function hasPowerUp(userId: string, powerUpId: string): boolean {
  const activePowerUps = getActivePowerUps(userId);
  return activePowerUps.some((p: ActivePowerUp) => p.powerUpId === powerUpId);
}

// Activate power-up
export function activatePowerUp(userId: string, powerUpId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const powerUp = POWER_UPS.find((p: PowerUp) => p.id === powerUpId);
    if (!powerUp) return false;
    
    // Check if already active
    if (hasPowerUp(userId, powerUpId)) {
      return false;
    }
    
    const data = localStorage.getItem(POWER_UPS_KEY);
    const allPowerUps: ActivePowerUp[] = data ? JSON.parse(data) : [];
    
    const now = Date.now();
    const expiresAt = powerUp.duration > 0 ? now + powerUp.duration : 0;
    
    allPowerUps.push({
      powerUpId,
      userId,
      activatedAt: now,
      expiresAt,
    });
    
    localStorage.setItem(POWER_UPS_KEY, JSON.stringify(allPowerUps));
    return true;
  } catch (error) {
    console.error('Error activating power-up:', error);
    return false;
  }
}

// Consume one-time power-up
export function consumePowerUp(userId: string, powerUpId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = localStorage.getItem(POWER_UPS_KEY);
    if (!data) return false;
    
    const allPowerUps: ActivePowerUp[] = JSON.parse(data);
    const filteredPowerUps = allPowerUps.filter(
      (p: ActivePowerUp) => !(p.userId === userId && p.powerUpId === powerUpId)
    );
    
    localStorage.setItem(POWER_UPS_KEY, JSON.stringify(filteredPowerUps));
    return true;
  } catch (error) {
    console.error('Error consuming power-up:', error);
    return false;
  }
}

// Get XP multiplier from active power-ups
export function getXPMultiplier(userId: string, context: 'general' | 'journal' | 'share' | 'challenge' = 'general'): number {
  const activePowerUps = getActivePowerUps(userId);
  let multiplier = 1;
  
  activePowerUps.forEach((ap: ActivePowerUp) => {
    if (ap.powerUpId === 'xp_2x_24h') multiplier *= 2;
    if (ap.powerUpId === 'xp_boost_week') multiplier *= 1.5;
    if (ap.powerUpId === 'journal_boost' && context === 'journal') multiplier *= 2;
    if (ap.powerUpId === 'social_amplifier' && context === 'share') multiplier *= 3;
    if (ap.powerUpId === 'challenge_boost' && context === 'challenge') multiplier *= 1.5;
  });
  
  return multiplier;
}

// Get rarity boost from active power-ups
export function getRarityBoost(userId: string): number {
  const activePowerUps = getActivePowerUps(userId);
  let boost = 0;
  
  activePowerUps.forEach((ap: ActivePowerUp) => {
    if (ap.powerUpId === 'rarity_boost') boost += 0.2;
  });
  
  return boost;
}

// Check if streak freeze is active
export function hasStreakFreeze(userId: string): boolean {
  return hasPowerUp(userId, 'streak_freeze');
}

// Use streak freeze
export function useStreakFreeze(userId: string): boolean {
  return consumePowerUp(userId, 'streak_freeze');
}

// Get time remaining for power-up
export function getPowerUpTimeRemaining(userId: string, powerUpId: string): number {
  const activePowerUps = getActivePowerUps(userId);
  const powerUp = activePowerUps.find((p: ActivePowerUp) => p.powerUpId === powerUpId);
  
  if (!powerUp || powerUp.expiresAt === 0) return 0;
  
  const now = Date.now();
  return Math.max(0, powerUp.expiresAt - now);
}

// Format time remaining
export function formatTimeRemaining(ms: number): string {
  if (ms === 0) return 'Permanent';
  
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}
