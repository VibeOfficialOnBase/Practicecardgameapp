import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp } from 'lucide-react';
import type { GiveawayTier } from '@/data/giveawayTiers';
import { GIVEAWAY_TIERS } from '@/data/giveawayTiers';

interface TierProgressBarProps {
  currentBalance: number;
  showDetails?: boolean;
}

export function TierProgressBar({ currentBalance, showDetails = true }: TierProgressBarProps) {
  // Find current tier and next tier
  const getCurrentTier = (balance: number): { current: GiveawayTier | null; next: GiveawayTier | null; progress: number } => {
    // Sort tiers by required tokens ascending
    const sortedTiers = [...GIVEAWAY_TIERS].sort((a, b) => a.minTokens - b.minTokens);
    
    let currentTier: GiveawayTier | null = null;
    let nextTier: GiveawayTier | null = null;
    let progress = 0;

    for (let i = 0; i < sortedTiers.length; i++) {
      if (balance >= sortedTiers[i].minTokens) {
        currentTier = sortedTiers[i];
        nextTier = sortedTiers[i + 1] || null;
      }
    }

    // If no tier yet, aim for first tier
    if (!currentTier) {
      nextTier = sortedTiers[0];
      progress = (balance / nextTier.minTokens) * 100;
    } else if (nextTier) {
      // Calculate progress to next tier
      const tokensFromCurrent = balance - currentTier.minTokens;
      const tokensNeeded = nextTier.minTokens - currentTier.minTokens;
      progress = (tokensFromCurrent / tokensNeeded) * 100;
    } else {
      // Max tier reached
      progress = 100;
    }

    return { current: currentTier, next: nextTier, progress: Math.min(progress, 100) };
  };

  const { current, next, progress } = getCurrentTier(currentBalance);

  // Don't show if max tier reached and not showing details
  if (!showDetails && !next) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-sm">
        <div className="p-4 space-y-3">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${current ? 'text-yellow-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-white font-bold text-sm">
                  {current ? `${current.name}` : 'No Tier Yet'}
                </p>
                <p className="text-white/60 text-xs">
                  {current ? `${current.entries}x giveaway entries` : 'Start collecting $VibeOfficial'}
                </p>
              </div>
            </div>

            {next && (
              <div className="text-right">
                <p className="text-white/80 text-xs">Next: {next.name}</p>
                <p className="text-purple-300 text-xs font-bold">
                  {next.minTokens.toLocaleString()} $VibeOfficial
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {next && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/70">
                <span>{Math.floor(currentBalance).toLocaleString()} $VibeOfficial</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {Math.floor(progress)}%
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              <p className="text-white/60 text-xs text-center">
                {next.minTokens - currentBalance > 0 
                  ? `${Math.floor(next.minTokens - currentBalance).toLocaleString()} more $VibeOfficial to unlock ${next.name}`
                  : 'Tier unlocked! 🎉'}
              </p>
            </div>
          )}

          {/* Max Tier Celebration */}
          {!next && current && (
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <p className="text-yellow-300 font-bold text-sm">
                🏆 Maximum Tier Achieved! 🏆
              </p>
              <p className="text-white/70 text-xs mt-1">
                You're in the top holder tier with {current.entries}x entries!
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
