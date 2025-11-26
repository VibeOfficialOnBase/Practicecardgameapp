/**
 * Application Constants
 * Central location for all constants, magic numbers, and configuration values
 */

// Card ID Ranges
export const CARD_RANGES = {
  PRACTICE: { start: 1, end: 365 },
  VIBE_CHECK: { start: 366, end: 465 },
} as const;

// Token Requirements
export const TOKEN_REQUIREMENTS = {
  MIN_VIBE_FOR_CARD_PULL: 1000,
  MIN_USD_FOR_RAFFLE: 100,
  HOLDER_PACK_THRESHOLD: 1000,
} as const;

// Pack IDs
export const PACK_IDS = {
  PRACTICE: 'practice_pack',
  VIBE_CHECK_EXCLUSIVE: 'vibe_check_exclusive',
} as const;

// Polling and Refresh Intervals
export const INTERVALS = {
  STATS_REFRESH: 15000, // 15 seconds
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
} as const;

// Achievement Check Delays
export const DELAYS = {
  ACHIEVEMENT_CHECK: 500,
  CARD_SCROLL: 300,
  PACK_REFRESH: 500,
  CONFETTI: 400,
  PARTICLE_HIDE: 3000,
} as const;

// Network Configuration
export const BASE_RPC_URLS = [
  'https://mainnet.base.org',
  'https://base.llamarpc.com',
  'https://base-mainnet.public.blastapi.io',
  'https://1rpc.io/base',
] as const;

// Date/Time Configuration
export const TIME_RANGES = {
  MORNING: { start: 5, end: 12 },
  EVENING: { start: 21, end: 5 },
  WEEKEND: [0, 6], // Sunday and Saturday
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  CARD_FLIP: 800,
  CONFETTI_BASE: 100,
  CONFETTI_ACHIEVEMENT: 150,
  CONFETTI_LEVEL_UP: 200,
  CONFETTI_EXCLUSIVE: 150,
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 2,
  INITIAL_DELAY: 2000,
  BACKOFF_MULTIPLIER: 2,
} as const;

// Helper function to check if card is in a specific range
export function isCardInRange(cardId: number, range: typeof CARD_RANGES[keyof typeof CARD_RANGES]): boolean {
  return cardId >= range.start && cardId <= range.end;
}

// Helper function to check if time is in a specific range
export function isInTimeRange(hour: number, range: { start: number; end: number }): boolean {
  if (range.start <= range.end) {
    return hour >= range.start && hour < range.end;
  }
  // Handle overnight ranges (e.g., evening 21-5)
  return hour >= range.start || hour < range.end;
}

// Helper function to check if day is weekend
export function isWeekend(dayOfWeek: number): boolean {
  return TIME_RANGES.WEEKEND.includes(dayOfWeek as 0 | 6);
}
