import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Flame, Star, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { upgradeManager } from './games/chakra-blaster/UpgradeManager';

const DAILY_REWARDS = [
  { day: 1, coins: 10, icon: '🎁' },
  { day: 2, coins: 15, icon: '✨' },
  { day: 3, coins: 20, icon: '💫' },
  { day: 4, coins: 25, icon: '⭐' },
  { day: 5, coins: 35, icon: '🌟' },
  { day: 6, coins: 50, icon: '💎' },
  { day: 7, coins: 100, icon: '👑' }
];

export default function DailyRewardsModal({ isOpen, onClose, userEmail }) {
  const queryClient = useQueryClient();

  const { data: rewardData } = useQuery({
    queryKey: ['dailyReward', userEmail],
    queryFn: async () => {
      const records = await base44.entities.DailyReward.filter({ user_email: userEmail });
      return records[0] || null;
    },
    enabled: !!userEmail && isOpen
  });

  const claimReward = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (!rewardData) {
        // First time claim
        const newRecord = await base44.entities.DailyReward.create({
          user_email: userEmail,
          current_streak: 1,
          longest_streak: 1,
          last_claim_date: today,
          total_coins_earned: DAILY_REWARDS[0].coins,
          available_claim: false
        });
        upgradeManager.addCoins(DAILY_REWARDS[0].coins);
        return { coins: DAILY_REWARDS[0].coins, streak: 1 };
      }

      let newStreak = rewardData.current_streak;
      
      if (rewardData.last_claim_date === yesterday) {
        // Continue streak
        newStreak += 1;
      } else if (rewardData.last_claim_date !== today) {
        // Broke streak, reset
        newStreak = 1;
      } else {
        throw new Error('Already claimed today');
      }

      const rewardIndex = Math.min(newStreak - 1, DAILY_REWARDS.length - 1);
      const coins = DAILY_REWARDS[rewardIndex].coins;

      await base44.entities.DailyReward.update(rewardData.id, {
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, rewardData.longest_streak),
        last_claim_date: today,
        total_coins_earned: (rewardData.total_coins_earned || 0) + coins,
        available_claim: false
      });

      upgradeManager.addCoins(coins);
      return { coins, streak: newStreak };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyReward'] });
    }
  });

  const canClaim = () => {
    if (!rewardData) return true;
    const today = new Date().toISOString().split('T')[0];
    return rewardData.last_claim_date !== today;
  };

  const getCurrentDay = () => {
    if (!rewardData) return 1;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (rewardData.last_claim_date === today) {
      return rewardData.current_streak;
    } else if (rewardData.last_claim_date === yesterday) {
      return rewardData.current_streak + 1;
    } else {
      return 1;
    }
  };

  const handleClaim = async () => {
    try {
      await claimReward.mutateAsync();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  if (!isOpen) return null;

  const currentDay = getCurrentDay();
  const canClaimToday = canClaim();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-b from-purple-900/95 via-indigo-900/95 to-black/95 backdrop-blur-xl rounded-3xl border-2 border-purple-500/50 shadow-2xl max-w-md w-full p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-safe hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <Gift className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h2 className="text-3xl font-bold ensure-readable-strong mb-2">Daily Rewards</h2>
                <div className="flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-lg ensure-readable">
                    {rewardData?.current_streak || 0} Day Streak
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {DAILY_REWARDS.map((reward, index) => {
                  const dayNum = index + 1;
                  const isClaimed = rewardData && currentDay > dayNum;
                  const isToday = currentDay === dayNum;
                  const isLocked = currentDay < dayNum;

                  return (
                    <motion.div
                      key={dayNum}
                      whileHover={{ scale: isToday ? 1.05 : 1 }}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border-2 relative ${
                        isClaimed
                          ? 'bg-green-500/20 border-green-500/50'
                          : isToday
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-lg'
                          : 'bg-black/30 border-purple-500/20'
                      }`}
                    >
                      <span className="text-2xl">{reward.icon}</span>
                      <span className={`text-xs font-bold mt-1 ${
                        isClaimed ? 'text-green-400' : isToday ? 'text-white' : 'text-gray-500'
                      }`}>
                        {reward.coins}
                      </span>
                      {isClaimed && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {canClaimToday ? (
                <motion.button
                  onClick={handleClaim}
                  disabled={claimReward.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ensure-readable-strong"
                >
                  {claimReward.isPending ? 'Claiming...' : `Claim ${DAILY_REWARDS[currentDay - 1]?.coins} Coins`}
                </motion.button>
              ) : (
                <div className="text-center p-4 bg-black/40 rounded-2xl border border-purple-500/30">
                  <p className="ensure-readable">Come back tomorrow for your next reward!</p>
                  <p className="text-sm text-muted mt-1">
                    Total earned: {rewardData?.total_coins_earned || 0} coins
                  </p>
                </div>
              )}

              {claimReward.isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center"
                >
                  <p className="text-green-400 font-bold">
                    🎉 Claimed {claimReward.data.coins} Lumina Coins!
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}