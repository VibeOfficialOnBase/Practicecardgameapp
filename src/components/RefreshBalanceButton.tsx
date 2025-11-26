import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface RefreshBalanceButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function RefreshBalanceButton({ onRefresh, isRefreshing }: RefreshBalanceButtonProps) {
  return (
    <motion.button
      onClick={onRefresh}
      disabled={isRefreshing}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      aria-label={isRefreshing ? 'Refreshing balance...' : 'Refresh token balance'}
    >
      <RefreshCw 
        className={`w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors ${
          isRefreshing ? 'animate-spin' : ''
        }`}
      />
    </motion.button>
  );
}
