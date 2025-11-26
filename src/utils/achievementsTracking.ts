export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  color: string;
}

export interface UserAchievement {
  achievementId: string;
  username: string;
  unlockedAt: number;
  seen: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: 7,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '⭐',
    requirement: 30,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'streak_100',
    name: 'Century Champion',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    requirement: 100,
    color: 'from-purple-500 to-pink-500',
  },
  
  // Pull Count Achievements
  {
    id: 'pulls_50',
    name: 'Dedicated Practitioner',
    description: 'Pull 50 cards total',
    icon: '🎯',
    requirement: 50,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'pulls_100',
    name: 'Master Practitioner',
    description: 'Pull 100 cards total',
    icon: '💎',
    requirement: 100,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'pulls_365',
    name: 'Year of Excellence',
    description: 'Pull 365 cards total',
    icon: '🌟',
    requirement: 365,
    color: 'from-pink-500 to-rose-500',
  },
  
  // Favorites Achievement
  {
    id: 'favorite_10',
    name: 'Collector',
    description: 'Favorite 10 cards',
    icon: '💫',
    requirement: 10,
    color: 'from-teal-500 to-green-500',
  },
  
  // Social Sharing Achievements
  {
    id: 'share_5',
    name: 'Vibe Spreader',
    description: 'Share your card 5 times',
    icon: '🌈',
    requirement: 5,
    color: 'from-pink-500 to-purple-500',
  },
  {
    id: 'share_20',
    name: 'Community Catalyst',
    description: 'Share 20 cards and spread the PRACTICE',
    icon: '📢',
    requirement: 20,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'share_50',
    name: 'Viral Visionary',
    description: 'Share 50 cards - you\'re a movement maker!',
    icon: '🚀',
    requirement: 50,
    color: 'from-yellow-500 to-red-500',
  },
  
  // Time-Based Achievements
  {
    id: 'morning_7',
    name: 'Morning Ritual',
    description: 'Pull your card before 9 AM for 7 days straight',
    icon: '☀️',
    requirement: 7,
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'evening_7',
    name: 'Night Owl Sage',
    description: 'Pull cards after 9 PM for 7 days',
    icon: '🦉',
    requirement: 7,
    color: 'from-indigo-900 to-purple-900',
  },
  {
    id: 'weekend_4',
    name: 'Weekend Warrior',
    description: 'Never miss a weekend pull for 4 weeks',
    icon: '🏔️',
    requirement: 8,
    color: 'from-green-500 to-emerald-500',
  },
  
  // Community & Referral Achievements
  {
    id: 'referral_1',
    name: 'First Friend',
    description: 'Refer your first friend who pulls a card',
    icon: '🤝',
    requirement: 1,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'referral_5',
    name: 'Community Builder',
    description: 'Bring 5 friends to PRACTICE',
    icon: '🏗️',
    requirement: 5,
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'referral_20',
    name: 'Vibe Tribe Leader',
    description: 'Bring 20 practitioners to the community',
    icon: '👑',
    requirement: 20,
    color: 'from-gold-500 to-yellow-500',
  },
  
  // Resilience Achievements
  {
    id: 'phoenix_rising',
    name: 'Phoenix Rising',
    description: 'Rebuild a 7-day streak after breaking one',
    icon: '🔥',
    requirement: 1,
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'comeback_champion',
    name: 'Comeback Champion',
    description: 'Break a 30+ day streak and rebuild to 30 again',
    icon: '💪',
    requirement: 1,
    color: 'from-rose-500 to-red-500',
  },
  
  // Level Achievements
  {
    id: 'level_10',
    name: 'Rising Star',
    description: 'Reach Level 10',
    icon: '⚡',
    requirement: 10,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'level_25',
    name: 'Enlightened One',
    description: 'Reach Level 25',
    icon: '✨',
    requirement: 25,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'level_50',
    name: 'Legendary Practitioner',
    description: 'Reach Level 50',
    icon: '👑',
    requirement: 50,
    color: 'from-yellow-500 to-amber-500',
  },
  
  // Journal Achievements
  {
    id: 'journal_1',
    name: 'First Thoughts',
    description: 'Write your first journal entry',
    icon: '📝',
    requirement: 1,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'journal_7',
    name: 'Reflective Soul',
    description: 'Write 7 journal entries',
    icon: '📖',
    requirement: 7,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'journal_30',
    name: 'Thoughtful Practitioner',
    description: 'Write 30 journal entries',
    icon: '✍️',
    requirement: 30,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'journal_100',
    name: 'Master Journaler',
    description: 'Complete 100 journal entries',
    icon: '📚',
    requirement: 100,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'journal_streak_7',
    name: 'Daily Scribe',
    description: 'Journal for 7 days in a row',
    icon: '🔥',
    requirement: 7,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'journal_words_500',
    name: 'Wordsmith',
    description: 'Write a 500+ word entry',
    icon: '🖊️',
    requirement: 500,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'journal_words_10000',
    name: 'Introspection Champion',
    description: 'Write 10,000+ total words',
    icon: '📜',
    requirement: 10000,
    color: 'from-indigo-500 to-purple-500',
  },
  
  // Challenge Achievements
  {
    id: 'challenge_1',
    name: 'Challenge Accepted',
    description: 'Complete your first challenge',
    icon: '🎯',
    requirement: 1,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'challenge_10',
    name: 'Challenge Champion',
    description: 'Complete 10 challenges',
    icon: '🏆',
    requirement: 10,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'challenge_50',
    name: 'Challenge Master',
    description: 'Complete 50 challenges',
    icon: '👑',
    requirement: 50,
    color: 'from-purple-500 to-pink-500',
  },
  
  // Collection Achievements
  {
    id: 'rare_card',
    name: 'Lucky Find',
    description: 'Pull your first Rare card',
    icon: '🔵',
    requirement: 1,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'epic_card',
    name: 'Epic Discovery',
    description: 'Pull your first Epic card',
    icon: '🟣',
    requirement: 1,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'legendary_card',
    name: 'Legend Collector',
    description: 'Pull your first Legendary card',
    icon: '🟡',
    requirement: 1,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'mythic_card',
    name: 'Mythic Destiny',
    description: 'Pull your first Mythic card',
    icon: '🌟',
    requirement: 1,
    color: 'from-pink-400 to-purple-500',
  },
  
  // Token Holdings Achievements (VIBE Holder Exclusive)
  {
    id: 'vibe_holder',
    name: '$VibeOfficial Holder 💎',
    description: '🎁 EXCLUSIVE: Hold 1,000+ $VibeOfficial tokens',
    icon: '💎',
    requirement: 1000,
    color: 'from-purple-400 via-pink-400 to-purple-500',
  },
  {
    id: 'vibe_believer',
    name: '$VibeOfficial Believer ✨',
    description: '🎁 EXCLUSIVE: Hold 10,000+ $VibeOfficial tokens',
    icon: '✨',
    requirement: 10000,
    color: 'from-blue-400 via-cyan-400 to-teal-500',
  },
  {
    id: 'vibe_champion',
    name: '$VibeOfficial Champion 🏆',
    description: '🎁 EXCLUSIVE: Hold 50,000+ $VibeOfficial tokens',
    icon: '🏆',
    requirement: 50000,
    color: 'from-yellow-400 via-orange-400 to-red-500',
  },
  {
    id: 'vibe_legend',
    name: '$VibeOfficial Legend 👑',
    description: '🎁 EXCLUSIVE: Hold 100,000+ $VibeOfficial tokens',
    icon: '👑',
    requirement: 100000,
    color: 'from-purple-500 via-pink-500 to-rose-500',
  },
  {
    id: 'vibe_whale',
    name: '$VibeOfficial Whale 🐋',
    description: '🎁 EXCLUSIVE: Hold 1,000,000+ $VibeOfficial tokens',
    icon: '🐋',
    requirement: 1000000,
    color: 'from-cyan-400 via-blue-500 to-indigo-600',
  },
  
  // Pack System Achievements
  {
    id: 'pack_collector_1',
    name: 'Pack Explorer 🎴',
    description: 'Claim your first Vibe Check Pack',
    icon: '🎴',
    requirement: 1,
    color: 'from-green-400 to-emerald-500',
  },
  {
    id: 'pack_collector_3',
    name: 'Pack Enthusiast 📦',
    description: 'Claim 3 different Vibe Check Packs',
    icon: '📦',
    requirement: 3,
    color: 'from-blue-400 to-purple-500',
  },
  {
    id: 'pack_collector_5',
    name: 'Full Spectrum Master 🌈',
    description: 'Collect all 5 Vibe Check Packs',
    icon: '🌈',
    requirement: 5,
    color: 'from-pink-400 via-purple-400 to-indigo-500',
  },
  {
    id: 'pack_master_shadow',
    name: 'Shadow Work Master 🌑',
    description: 'Pull 50 cards from the Shadow Work Pack',
    icon: '🌑',
    requirement: 50,
    color: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'pack_master_frequency',
    name: 'Frequency Master ⚡',
    description: 'Pull 50 cards from the Frequency Check Pack',
    icon: '⚡',
    requirement: 50,
    color: 'from-yellow-400 to-orange-500',
  },
  
  // Social & Viral Achievements
  {
    id: 'farcaster_native',
    name: 'Farcaster Frame Master 🎭',
    description: 'Share your card as a Farcaster frame',
    icon: '🎭',
    requirement: 1,
    color: 'from-purple-500 to-blue-500',
  },
  {
    id: 'viral_moment',
    name: 'Viral Moment 🌟',
    description: 'Have your shared card viewed 100+ times',
    icon: '🌟',
    requirement: 100,
    color: 'from-yellow-400 via-pink-400 to-purple-500',
  },
  {
    id: 'influencer',
    name: 'PRACTICE Influencer 📱',
    description: 'Get 10 people to join through your shares',
    icon: '📱',
    requirement: 10,
    color: 'from-pink-500 to-rose-500',
  },
  
  // Time-Based Special Achievements
  {
    id: 'midnight_mystic',
    name: 'Midnight Mystic 🌙',
    description: 'Pull a card at exactly midnight',
    icon: '🌙',
    requirement: 1,
    color: 'from-indigo-900 to-purple-900',
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour Seeker ☀️',
    description: 'Pull cards during golden hour (sunrise/sunset) 5 times',
    icon: '☀️',
    requirement: 5,
    color: 'from-orange-400 to-rose-500',
  },
  {
    id: 'new_year_intention',
    name: 'New Year Intention Setter 🎊',
    description: 'Pull a card on New Year\'s Day',
    icon: '🎊',
    requirement: 1,
    color: 'from-yellow-500 to-pink-500',
  },
  
  // Creative Achievements
  {
    id: 'custom_card_creator',
    name: 'Card Alchemist 🎨',
    description: 'Create your first custom affirmation card',
    icon: '🎨',
    requirement: 1,
    color: 'from-pink-400 to-purple-500',
  },
  {
    id: 'meditation_master',
    name: 'Meditation Master 🧘',
    description: 'Complete 10 guided meditations',
    icon: '🧘',
    requirement: 10,
    color: 'from-green-400 to-teal-500',
  },
  {
    id: 'gratitude_guru',
    name: 'Gratitude Guru 🙏',
    description: 'Express gratitude in 30 journal entries',
    icon: '🙏',
    requirement: 30,
    color: 'from-amber-400 to-orange-500',
  },
  
  // Community Impact Achievements
  {
    id: 'community_helper',
    name: 'Community Helper 🤗',
    description: 'Help 5 new users start their PRACTICE journey',
    icon: '🤗',
    requirement: 5,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'leaderboard_top_10',
    name: 'Top 10 Legend 🏅',
    description: 'Reach top 10 on the global leaderboard',
    icon: '🏅',
    requirement: 1,
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week Pro 📅',
    description: 'Pull a card, journal, AND complete a challenge every day for a week',
    icon: '📅',
    requirement: 7,
    color: 'from-emerald-400 to-green-600',
  },
  
  // Easter Egg Achievements
  {
    id: 'secret_seeker',
    name: 'Secret Seeker 🔍',
    description: 'Discover a hidden feature in the app',
    icon: '🔍',
    requirement: 1,
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'combo_king',
    name: 'Combo King 👑',
    description: 'Complete 5 different actions in a single session',
    icon: '👑',
    requirement: 1,
    color: 'from-purple-600 via-pink-500 to-rose-500',
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner ⚡',
    description: 'Complete daily pull, journal, and challenge in under 5 minutes',
    icon: '⚡',
    requirement: 1,
    color: 'from-yellow-400 to-red-500',
  },
];

const ACHIEVEMENTS_KEY = 'practice_achievements';

export function getUserAchievements(username: string): UserAchievement[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!data) return [];
    
    const allAchievements: UserAchievement[] = JSON.parse(data);
    return allAchievements.filter((ach: UserAchievement) => ach.username === username);
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
}

export function unlockAchievement(username: string, achievementId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    const allAchievements: UserAchievement[] = data ? JSON.parse(data) : [];
    
    // Check if already unlocked
    const existing = allAchievements.find(
      (ach: UserAchievement) => ach.username === username && ach.achievementId === achievementId
    );
    
    if (existing) return false;
    
    const newAchievement: UserAchievement = {
      achievementId,
      username,
      unlockedAt: Date.now(),
      seen: false,
    };
    
    allAchievements.push(newAchievement);
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(allAchievements));
    return true;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return false;
  }
}

export function markAchievementSeen(username: string, achievementId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!data) return;
    
    const allAchievements: UserAchievement[] = JSON.parse(data);
    const achievement = allAchievements.find(
      (ach: UserAchievement) => ach.username === username && ach.achievementId === achievementId
    );
    
    if (achievement) {
      achievement.seen = true;
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(allAchievements));
    }
  } catch (error) {
    console.error('Error marking achievement as seen:', error);
  }
}

export function checkAndUnlockAchievements(
  username: string,
  streak: number,
  totalPulls: number,
  totalFavorites: number,
  totalShares: number = 0,
  totalReferrals: number = 0,
  morningStreak: number = 0,
  eveningStreak: number = 0,
  weekendStreak: number = 0,
  userLevel: number = 1,
  hasStreakBroken: boolean = false,
  journalEntries: number = 0,
  journalStreak: number = 0,
  totalJournalWords: number = 0,
  longestJournalEntry: number = 0,
  completedChallenges: number = 0,
  hasRareCard: boolean = false,
  hasEpicCard: boolean = false,
  hasLegendaryCard: boolean = false,
  hasMythicCard: boolean = false,
  tokenBalance: number = 0
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  
  // Check streak achievements
  if (streak >= 7 && unlockAchievement(username, 'streak_7')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'streak_7');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (streak >= 30 && unlockAchievement(username, 'streak_30')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'streak_30');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (streak >= 100 && unlockAchievement(username, 'streak_100')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'streak_100');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check total pulls achievements
  if (totalPulls >= 50 && unlockAchievement(username, 'pulls_50')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'pulls_50');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (totalPulls >= 100 && unlockAchievement(username, 'pulls_100')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'pulls_100');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (totalPulls >= 365 && unlockAchievement(username, 'pulls_365')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'pulls_365');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check favorites achievement
  if (totalFavorites >= 10 && unlockAchievement(username, 'favorite_10')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'favorite_10');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check share achievements
  if (totalShares >= 5 && unlockAchievement(username, 'share_5')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'share_5');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (totalShares >= 20 && unlockAchievement(username, 'share_20')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'share_20');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (totalShares >= 50 && unlockAchievement(username, 'share_50')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'share_50');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check time-based achievements
  if (morningStreak >= 7 && unlockAchievement(username, 'morning_7')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'morning_7');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (eveningStreak >= 7 && unlockAchievement(username, 'evening_7')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'evening_7');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (weekendStreak >= 8 && unlockAchievement(username, 'weekend_4')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'weekend_4');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check referral achievements
  if (totalReferrals >= 1 && unlockAchievement(username, 'referral_1')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'referral_1');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (totalReferrals >= 5 && unlockAchievement(username, 'referral_5')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'referral_5');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (totalReferrals >= 20 && unlockAchievement(username, 'referral_20')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'referral_20');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check resilience achievements
  if (hasStreakBroken && streak >= 7 && unlockAchievement(username, 'phoenix_rising')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'phoenix_rising');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (hasStreakBroken && streak >= 30 && unlockAchievement(username, 'comeback_champion')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'comeback_champion');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check level achievements
  if (userLevel >= 10 && unlockAchievement(username, 'level_10')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'level_10');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (userLevel >= 25 && unlockAchievement(username, 'level_25')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'level_25');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (userLevel >= 50 && unlockAchievement(username, 'level_50')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'level_50');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check journal achievements
  if (journalEntries >= 1 && unlockAchievement(username, 'journal_1')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'journal_1');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (journalEntries >= 7 && unlockAchievement(username, 'journal_7')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'journal_7');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (journalEntries >= 30 && unlockAchievement(username, 'journal_30')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'journal_30');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (journalEntries >= 100 && unlockAchievement(username, 'journal_100')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'journal_100');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (journalStreak >= 7 && unlockAchievement(username, 'journal_streak_7')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'journal_streak_7');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (longestJournalEntry >= 500 && unlockAchievement(username, 'journal_words_500')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'journal_words_500');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (totalJournalWords >= 10000 && unlockAchievement(username, 'journal_words_10000')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'journal_words_10000');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check challenge achievements
  if (completedChallenges >= 1 && unlockAchievement(username, 'challenge_1')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'challenge_1');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (completedChallenges >= 10 && unlockAchievement(username, 'challenge_10')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'challenge_10');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (completedChallenges >= 50 && unlockAchievement(username, 'challenge_50')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'challenge_50');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check rarity achievements
  if (hasRareCard && unlockAchievement(username, 'rare_card')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'rare_card');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (hasEpicCard && unlockAchievement(username, 'epic_card')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'epic_card');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (hasLegendaryCard && unlockAchievement(username, 'legendary_card')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'legendary_card');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (hasMythicCard && unlockAchievement(username, 'mythic_card')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'mythic_card');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  // Check $VibeOfficial holder exclusive achievements
  if (tokenBalance >= 1000 && unlockAchievement(username, 'vibe_holder')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'vibe_holder');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (tokenBalance >= 10000 && unlockAchievement(username, 'vibe_believer')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'vibe_believer');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (tokenBalance >= 50000 && unlockAchievement(username, 'vibe_champion')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'vibe_champion');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (tokenBalance >= 100000 && unlockAchievement(username, 'vibe_legend')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'vibe_legend');
    if (achievement) newlyUnlocked.push(achievement);
  }
  if (tokenBalance >= 1000000 && unlockAchievement(username, 'vibe_whale')) {
    const achievement = ACHIEVEMENTS.find((a: Achievement) => a.id === 'vibe_whale');
    if (achievement) newlyUnlocked.push(achievement);
  }
  
  return newlyUnlocked;
}
