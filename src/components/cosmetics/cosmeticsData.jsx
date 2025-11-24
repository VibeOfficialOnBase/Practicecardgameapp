export const COSMETICS = [
  {
    id: 'golden-aura',
    name: 'Golden Aura',
    description: 'Radiant golden glow around your practice cards',
    type: 'card-effect',
    requiresToken: true,
    tokenType: 'vibe',
    preview: '✨',
    data: {
      borderGradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
      glowColor: 'rgba(255, 215, 0, 0.5)',
      animation: 'pulse'
    }
  },
  {
    id: 'cosmic-gradient',
    name: 'Cosmic Card Background',
    description: 'Animated cosmic gradient for your pulled cards',
    type: 'card-background',
    requiresToken: true,
    tokenType: 'vibe',
    preview: '🌌',
    data: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      animated: true
    }
  },
  {
    id: 'purple-crown',
    name: 'Royal Crown Badge',
    description: 'Display a crown next to your name in community posts',
    type: 'profile-badge',
    requiresToken: true,
    tokenType: 'vibe',
    preview: '👑',
    data: {
      icon: '👑',
      color: '#9333ea'
    }
  },
  {
    id: 'shimmer-trail',
    name: 'Shimmer Trail',
    description: 'Sparkle effects when flipping cards',
    type: 'card-effect',
    requiresToken: true,
    tokenType: 'vibe',
    preview: '✨',
    data: {
      particleColor: '#FFD700',
      particleCount: 20,
      trailDuration: 1500
    }
  },
  {
    id: 'celestial-theme',
    name: 'Celestial Theme',
    description: 'Enhanced starfield background throughout the app',
    type: 'theme',
    requiresToken: true,
    tokenType: 'vibe',
    preview: '⭐',
    data: {
      starDensity: 'high',
      starColors: ['#FFD700', '#FFA500', '#FF69B4']
    }
  },
  {
    id: 'rainbow-flip',
    name: 'Rainbow Card Flip',
    description: 'Rainbow gradient appears when flipping cards',
    type: 'card-effect',
    requiresToken: true,
    tokenType: 'vibe',
    preview: '🌈',
    data: {
      gradient: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
      duration: 800
    }
  }
];

export const getCosmeticsByType = (type) => {
  return COSMETICS.filter(c => c.type === type);
};

export const getEquippedCosmetic = (equippedIds, type) => {
  return COSMETICS.find(c => equippedIds.includes(c.id) && c.type === type);
};