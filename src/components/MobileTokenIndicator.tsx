import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X, TrendingUp, Crown } from 'lucide-react';
import type { TokenBalance } from '@/utils/tokenGating';
import { MIN_VIBE_FOR_CARD_PULL } from '@/utils/tokenGating';
import { Button } from '@/components/ui/button';

interface MobileTokenIndicatorProps {
  tokenBalance: TokenBalance;
  onBuyClick: () => void;
}

export function MobileTokenIndicator({ tokenBalance, onBuyClick }: MobileTokenIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const balance = Math.floor(tokenBalance.formattedBalance);
  const hasEnough = tokenBalance.hasBalance;
  const isHolder = balance >= 1000;

  return (
    <>
      {/* Compact Mobile Badge */}
      <motion.button
        onClick={() => setIsExpanded(true)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg backdrop-blur-md border-2 transition-all duration-200 md:hidden ${
          isHolder
            ? 'bg-yellow-500/20 border-yellow-400/70 text-yellow-300'
            : hasEnough
            ? 'bg-green-500/20 border-green-400/70 text-green-300'
            : 'bg-purple-500/20 border-purple-400/70 text-purple-300'
        }`}
        aria-label="View token balance"
      >
        {isHolder ? (
          <Crown className="w-4 h-4" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        <span className="text-sm font-bold">{balance.toLocaleString()}</span>
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
      </motion.button>

      {/* Expanded Mobile Modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-900/98 to-pink-900/98 backdrop-blur-lg rounded-t-3xl shadow-2xl border-t-2 border-purple-400/50 md:hidden"
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-purple-300" />
                    <h3 className="text-lg font-bold text-white">Your Balance</h3>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>

                {/* Balance Display */}
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      {balance.toLocaleString()}
                    </p>
                    {isHolder && (
                      <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-center text-white/80 text-sm font-semibold">$VibeOfficial</p>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full ${
                  isHolder
                    ? 'bg-yellow-500/20 border-2 border-yellow-400/50'
                    : hasEnough
                    ? 'bg-green-500/20 border-2 border-green-400/50'
                    : 'bg-purple-500/20 border-2 border-purple-400/50'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    isHolder
                      ? 'bg-yellow-400'
                      : hasEnough
                      ? 'bg-green-400'
                      : 'bg-purple-400'
                  }`}></div>
                  <span className="text-white text-sm font-semibold">
                    {isHolder
                      ? '👑 Holder Status - Exclusive Access'
                      : hasEnough
                      ? '✓ Eligible for Card Pulls'
                      : `Need ${MIN_VIBE_FOR_CARD_PULL.toLocaleString()} to pull cards`
                    }
                  </span>
                </div>

                {/* Benefits List */}
                {isHolder && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/90 text-sm font-semibold mb-2">Your Holder Perks:</p>
                    <ul className="space-y-1 text-white/70 text-xs">
                      <li>✨ Access to Vibe Check exclusive pack</li>
                      <li>👑 Holder badge on leaderboard</li>
                      <li>🎁 Special raffle entries</li>
                      <li>🚀 Early access to new features</li>
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                {!isHolder && (
                  <Button
                    onClick={() => {
                      setIsExpanded(false);
                      onBuyClick();
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get More $VibeOfficial
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="w-full text-white/60 hover:text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
