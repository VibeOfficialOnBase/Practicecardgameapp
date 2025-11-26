import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VibeHolderBadgeProps {
  vibeBalance: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function VibeHolderBadge({ vibeBalance, size = 'md', showText = true }: VibeHolderBadgeProps) {
  // Determine holder tier
  const getTier = (): { emoji: string; title: string; color: string; glow: string } | null => {
    if (vibeBalance >= 1000000) {
      return {
        emoji: '🐋',
        title: 'Whale',
        color: 'from-cyan-400 via-blue-500 to-indigo-600',
        glow: 'shadow-cyan-500/50',
      };
    } else if (vibeBalance >= 100000) {
      return {
        emoji: '👑',
        title: 'Legend',
        color: 'from-purple-500 via-pink-500 to-rose-500',
        glow: 'shadow-purple-500/50',
      };
    } else if (vibeBalance >= 50000) {
      return {
        emoji: '🏆',
        title: 'Champion',
        color: 'from-yellow-400 via-orange-400 to-red-500',
        glow: 'shadow-yellow-500/50',
      };
    } else if (vibeBalance >= 10000) {
      return {
        emoji: '✨',
        title: 'Believer',
        color: 'from-blue-400 via-cyan-400 to-teal-500',
        glow: 'shadow-blue-500/50',
      };
    } else if (vibeBalance >= 1000) {
      return {
        emoji: '💎',
        title: 'Holder',
        color: 'from-purple-400 via-pink-400 to-purple-500',
        glow: 'shadow-purple-500/50',
      };
    }
    return null;
  };

  const tier = getTier();

  if (!tier) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="inline-block"
    >
      <Badge
        className={`
          bg-gradient-to-r ${tier.color} 
          text-white font-bold border-2 border-white/30
          ${sizeClasses[size]}
          shadow-lg ${tier.glow}
          hover:scale-105 transition-transform duration-200
          cursor-default
        `}
      >
        <span className="mr-1">{tier.emoji}</span>
        {showText && (
          <>
            <span>$VibeOfficial {tier.title}</span>
            <Sparkles className={`ml-1 ${iconSizes[size]} animate-pulse`} />
          </>
        )}
      </Badge>
    </motion.div>
  );
}

interface VibeHolderPerksTooltipProps {
  vibeBalance: number;
}

export function VibeHolderPerksTooltip({ vibeBalance }: VibeHolderPerksTooltipProps) {
  const getPerks = (): string[] => {
    const perks: string[] = [];
    
    if (vibeBalance >= 1000) {
      perks.push('🎁 Access to exclusive giveaways');
      perks.push('✨ Special $VibeOfficial holder achievements');
      perks.push('🏆 Exclusive holder badge');
    }
    
    if (vibeBalance >= 10000) {
      perks.push('⚡ Priority in community features');
      perks.push('💫 Enhanced profile customization');
    }
    
    if (vibeBalance >= 50000) {
      perks.push('👑 VIP status in leaderboards');
      perks.push('🌟 Early access to new features');
    }
    
    if (vibeBalance >= 100000) {
      perks.push('💎 Legendary pack bonuses');
      perks.push('🎯 Exclusive challenges');
    }
    
    if (vibeBalance >= 1000000) {
      perks.push('🐋 Ultimate whale perks');
      perks.push('🚀 Direct influence on roadmap');
    }
    
    return perks;
  };

  const perks = getPerks();

  if (perks.length === 0) return null;

  return (
    <div className="space-y-2 p-4 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
      <h4 className="text-white font-bold text-sm flex items-center gap-2">
        <Crown className="w-4 h-4 text-yellow-400" />
        Your $VibeOfficial Holder Perks
      </h4>
      <ul className="space-y-1">
        {perks.map((perk, index) => (
          <li key={index} className="text-purple-200 text-xs">
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}
