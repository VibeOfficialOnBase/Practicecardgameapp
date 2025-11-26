import { memo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshBalanceButton } from '@/components/RefreshBalanceButton';
import type { TokenBalance } from '@/utils/tokenGating';
import { MIN_VIBE_FOR_CARD_PULL, VIBE_TOKEN_ADDRESS } from '@/utils/tokenGating';

// Coinbase Wallet buy link for VIBE token on Base
const VIBE_BUY_LINK = `https://go.cb-w.com/swap?asset=${VIBE_TOKEN_ADDRESS}&network=base`;

interface TokenBalanceCardProps {
  tokenBalance: TokenBalance;
  address: string;
  hasUsedFreePull: boolean;
  onRefreshBalance: () => void;
  isRefreshing: boolean;
  achievements: Array<{ achievementId: string }>;
}

export const TokenBalanceCard = memo(function TokenBalanceCard({
  tokenBalance,
  address,
  hasUsedFreePull,
  onRefreshBalance,
  isRefreshing,
  achievements,
}: TokenBalanceCardProps) {
  const hasWhaleAchievement = achievements.some(
    (ach) => ach.achievementId === 'vibe_whale'
  );

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-8 glass-card glass-card-hover glass-card-glow p-6 rounded-2xl shadow-xl max-w-md mx-auto"
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <Wallet className="w-6 h-6 text-purple-300" />
        <span className="text-white font-bold text-lg">Your $VibeOfficial Balance</span>
        <RefreshBalanceButton 
          onRefresh={onRefreshBalance}
          isRefreshing={isRefreshing}
        />
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-2">
        <p className="text-center text-3xl font-bold gradient-text">
          {Math.floor(tokenBalance.formattedBalance).toLocaleString()} $VibeOfficial
        </p>
        {hasWhaleAchievement && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-4xl"
            title="VibeOfficial Whale 🐋 - You hold 1M+ $VibeOfficial!"
          >
            🐋
          </motion.div>
        )}
      </div>
      
      {tokenBalance.hasBalance ? (
        <div className="flex items-center justify-center gap-2 glass-card px-4 py-2 rounded-full mx-auto w-fit">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-sm font-semibold">💎 $VibeOfficial holder perks unlocked!</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 glass-card px-4 py-2 rounded-full mx-auto w-fit">
          <span className="text-xl">✨</span>
          <span className="text-green-300 text-sm font-semibold">Daily pulls free for everyone!</span>
        </div>
      )}
    </motion.div>
  );
});
