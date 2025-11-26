import { Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TokenBalance } from '@/utils/tokenGating';
import { MIN_VIBE_FOR_CARD_PULL } from '@/utils/tokenGating';

interface CompactTokenBadgeProps {
  tokenBalance: TokenBalance;
  onExpand?: () => void;
}

export function CompactTokenBadge({ tokenBalance, onExpand }: CompactTokenBadgeProps) {
  const balance = Math.floor(tokenBalance.formattedBalance);
  const hasEnough = tokenBalance.hasBalance;
  
  return (
    <motion.button
      onClick={onExpand || undefined}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
        hasEnough
          ? 'bg-green-500/20 border-green-400/50 text-green-300 hover:bg-green-500/30'
          : 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/30'
      }`}
      aria-label={`$VibeOfficial Token Balance: ${balance.toLocaleString()} tokens. ${hasEnough ? 'Eligible to pull cards' : `Need ${MIN_VIBE_FOR_CARD_PULL.toLocaleString()} to pull cards`}. Click to view details.`}
    >
      <Wallet className="w-4 h-4" />
      <span className="text-sm font-bold">{balance.toLocaleString()}</span>
      {hasEnough && <span className="text-xs">✓</span>}
    </motion.button>
  );
}
