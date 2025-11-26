import { motion } from 'framer-motion';
import { Flame, Award, Zap, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import confetti from 'canvas-confetti';

interface SuperchargedStreakDisplayProps {
  streak: number;
  username: string;
  onStreakRecovery?: () => void;
}

export function SuperchargedStreakDisplay({ 
  streak, 
  username,
  onStreakRecovery 
}: SuperchargedStreakDisplayProps) {
  const [showRecovery, setShowRecovery] = useState(false);

  // Determine streak tier and styling
  const getStreakTier = () => {
    if (streak >= 365) return { name: 'IMMORTAL', icon: '👑', color: 'from-yellow-400 via-yellow-500 to-orange-500', glow: 'drop-shadow-[0_0_25px_rgba(234,179,8,1)]' };
    if (streak >= 100) return { name: 'LEGEND', icon: '💎', color: 'from-purple-400 via-purple-500 to-pink-500', glow: 'drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]' };
    if (streak >= 30) return { name: 'WARRIOR', icon: '⚔️', color: 'from-blue-400 via-blue-500 to-cyan-500', glow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]' };
    if (streak >= 7) return { name: 'CHAMPION', icon: '🔥', color: 'from-orange-400 via-red-500 to-pink-500', glow: 'drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]' };
    if (streak >= 3) return { name: 'RISING', icon: '✨', color: 'from-green-400 via-emerald-500 to-teal-500', glow: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]' };
    return { name: 'BEGINNER', icon: '🌱', color: 'from-gray-400 via-gray-500 to-gray-600', glow: 'drop-shadow-[0_0_8px_rgba(156,163,175,0.6)]' };
  };

  const tier = getStreakTier();
  const progress = ((streak % 7) / 7) * 100; // Progress to next week milestone
  const nextMilestone = Math.ceil(streak / 7) * 7;

  const celebrateStreak = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#EF4444', '#EC4899'],
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Main Streak Display */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl shadow-2xl">
        {/* Animated background glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${tier.color} opacity-20 blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-yellow-400-yellow-400" />
              </motion.div>
              <h3 className="text-white font-bold text-lg">Your Streak Power</h3>
            </div>
            <motion.div
              className={`px-4 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white font-bold text-sm ${tier.glow}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {tier.icon} {tier.name}
            </motion.div>
          </div>

          {/* Massive Streak Number */}
          <motion.div 
            className="text-center mb-6"
            onClick={celebrateStreak}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative inline-block cursor-pointer">
              {/* Flame icons */}
              <div className="flex items-center justify-center gap-2 mb-2">
                {[...Array(Math.min(Math.floor(streak / 7) + 1, 5))].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    <Flame 
                      className={`w-8 h-8 ${tier.glow}`}
                      style={{
                        color: `hsl(${45 - i * 10}, 100%, ${50 + i * 5}%)`,
                       : `hsl(${45 - i * 10}, 100%, ${50 + i * 5}%)`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Streak number */}
              <motion.div
                className={`text-8xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent ${tier.glow}`}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {streak}
              </motion.div>
              <p className="text-white/80 text-sm font-semibold mt-2">Day Streak</p>

              {/* Animated ring around number */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-full border-4 border-dashed"
                style={{
                  borderColor: 'transparent',
                  borderTopColor: tier.color.includes('yellow') ? '#FBBF24' : '#A78BFA',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Progress to next milestone */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Progress to {nextMilestone} days</span>
              <span className="text-white/90 font-bold">{streak % 7}/7 this week</span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${tier.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{streak > 0 ? '+' : ''}{streak}</p>
              <p className="text-xs text-white/60">Total Days</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
              <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{Math.floor(streak / 7)}</p>
              <p className="text-xs text-white/60">Weeks</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">x{Math.min(Math.floor(streak / 3) + 1, 10)}</p>
              <p className="text-xs text-white/60">Multiplier</p>
            </div>
          </div>

          {/* Encouragement message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-400/30"
          >
            <p className="text-white/90 text-sm text-center font-medium">
              {streak === 0 && "🌱 Start your journey today!"}
              {streak > 0 && streak < 3 && "💪 Great start! Keep the momentum going!"}
              {streak >= 3 && streak < 7 && "🔥 You're on fire! Almost at your first week!"}
              {streak >= 7 && streak < 30 && "⚔️ Warrior status unlocked! Keep fighting!"}
              {streak >= 30 && streak < 100 && "🌟 Legendary dedication! You're unstoppable!"}
              {streak >= 100 && streak < 365 && "💎 Diamond-level commitment! You're elite!"}
              {streak >= 365 && "👑 IMMORTAL STATUS! You are the 0.1%!"}
            </p>
          </motion.div>
        </div>
      </Card>

      {/* Streak Recovery Option (if streak broken) */}
      {streak === 0 && onStreakRecovery && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-r from-orange-900/40 to-red-900/40 border-orange-400/30">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💔</div>
              <div className="flex-1">
                <h4 className="text-white font-bold mb-1">Streak Broken?</h4>
                <p className="text-white/80 text-sm mb-3">
                  Life happens! Restore your streak for just 1,000 $VibeOfficial tokens.
                </p>
                <Button
                  onClick={onStreakRecovery}
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  🔥 Restore Streak
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
