import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Check, Gift, TrendingUp } from 'lucide-react';
import { getReferralCount, getReferralCode } from '@/utils/referralTracking';

interface ReferralDashboardProps {
  username: string;
}

export function ReferralDashboard({ username }: ReferralDashboardProps) {
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const referralCode = getReferralCode(username);
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${referralCode}`;

  useEffect(() => {
    const count = getReferralCount(username, true);
    setReferralCount(count);
  }, [username]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Calculate rewards based on referrals
  const rewards = [
    { count: 5, reward: 'Bronze Referrer Badge', unlocked: referralCount >= 5 },
    { count: 10, reward: 'Silver Referrer Badge', unlocked: referralCount >= 10 },
    { count: 25, reward: 'Gold Referrer Badge', unlocked: referralCount >= 25 },
    { count: 100, reward: 'Diamond Referrer Badge', unlocked: referralCount >= 100 },
  ];

  const nextReward = rewards.find((r) => !r.unlocked);
  const progressToNext = nextReward 
    ? (referralCount / nextReward.count) * 100 
    : 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-400/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/20 p-3 rounded-full">
                <Users className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Referral Program</h3>
                <p className="text-white/60 text-sm">Invite friends, earn rewards</p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-white">{referralCount}</p>
              <p className="text-white/70 text-xs uppercase tracking-wider">Referrals</p>
            </motion.div>
          </div>

          {/* Referral Link */}
          <div className="space-y-3">
            <label className="text-white/80 text-sm font-semibold">Your Referral Link:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="glass-card border-2 text-white hover:glass-card-hover min-w-[100px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress to Next Reward */}
      {nextReward && (
        <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-sm">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-300" />
                <h4 className="text-white font-bold">Next Reward</h4>
              </div>
              <p className="text-white/70 text-sm">
                {referralCount}/{nextReward.count} referrals
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
              </div>
              <p className="text-white/80 text-sm text-center">
                {nextReward.count - referralCount} more to unlock: <span className="font-bold">{nextReward.reward}</span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Rewards List */}
      <Card className="bg-gradient-to-br from-slate-900/40 to-gray-900/40 border-slate-400/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h4 className="text-white font-bold">All Rewards</h4>
          </div>

          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.count}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  reward.unlocked
                    ? 'bg-green-900/20 border-green-400/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${reward.unlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                    {index === 0 ? '🥉' : index === 1 ? '🥈' : index === 2 ? '🥇' : '💎'}
                  </div>
                  <div>
                    <p className={`font-semibold ${reward.unlocked ? 'text-white' : 'text-white/60'}`}>
                      {reward.reward}
                    </p>
                    <p className="text-white/50 text-xs">{reward.count} referrals</p>
                  </div>
                </div>
                {reward.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="bg-green-500/20 px-3 py-1 rounded-full"
                  >
                    <p className="text-green-300 text-xs font-bold">Unlocked!</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* How it Works */}
      <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/30 backdrop-blur-sm">
        <div className="p-6">
          <h4 className="text-white font-bold mb-4">How It Works</h4>
          <div className="space-y-3 text-white/80 text-sm">
            <div className="flex gap-3">
              <span className="text-blue-300 font-bold">1.</span>
              <p>Share your unique referral link with friends</p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-300 font-bold">2.</span>
              <p>They connect their wallet and start pulling cards</p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-300 font-bold">3.</span>
              <p>You both earn rewards and unlock badges!</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
