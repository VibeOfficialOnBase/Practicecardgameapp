import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Trophy, Users, Target, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGlobalCommunityStats } from '@/hooks/useGlobalCommunityStats';

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  icon: React.ReactNode;
  color: string;
  reward: string;
}

export function MilestoneTracker() {
  // Get real-time stats from Supabase
  const stats = useGlobalCommunityStats();

  const [showMilestoneAchieved, setShowMilestoneAchieved] = useState(false);
  const [achievedMilestone, setAchievedMilestone] = useState<Milestone | null>(null);
  const [previousMilestoneStates, setPreviousMilestoneStates] = useState<Record<string, boolean>>({});

  // Calculate milestones with REAL data from Supabase
  const milestones = useMemo<Milestone[]>(() => [
    {
      id: 'community-1000',
      title: '1,000 Community Members',
      description: 'Unlock exclusive community NFT',
      target: 1000,
      current: stats.totalUsers, // Real data from Supabase
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-500',
      reward: '🎁 Exclusive NFT Badge'
    },
    {
      id: 'pulls-10000',
      title: '10,000 Total Card Pulls',
      description: 'Special LECHE expansion pack',
      target: 10000,
      current: stats.totalPulls, // Real data from Supabase
      icon: <Target className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      reward: '🎴 LECHE Pack Unlocked'
    },
    {
      id: 'streaks-100',
      title: '100 Active Users Goal',
      description: 'Community celebration event',
      target: 100,
      current: stats.activeUsersToday, // Real data from Supabase
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      reward: '🎉 Community Event'
    }
  ], [stats]);

  // Check for newly completed milestones
  useEffect(() => {
    milestones.forEach(milestone => {
      const isComplete = milestone.current >= milestone.target;
      const wasComplete = previousMilestoneStates[milestone.id] || false;

      // Milestone just completed (wasn't complete before, but is now)
      if (isComplete && !wasComplete) {
        setAchievedMilestone(milestone);
        setShowMilestoneAchieved(true);

        // Trigger confetti
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
        });

        // Hide after 5 seconds
        setTimeout(() => setShowMilestoneAchieved(false), 5000);
      }
    });

    // Update previous states
    const newStates: Record<string, boolean> = {};
    milestones.forEach(milestone => {
      newStates[milestone.id] = milestone.current >= milestone.target;
    });
    setPreviousMilestoneStates(newStates);
  }, [milestones]);

  return (
    <div className="space-y-4">
      {/* Milestone Achievement Banner */}
      <AnimatePresence>
        {showMilestoneAchieved && achievedMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4"
          >
            <Card className="bg-gradient-to-r from-yellow-900/90 to-orange-900/90 border-2 border-yellow-400/50 backdrop-blur-xl shadow-2xl p-6 max-w-md">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  🏆
                </motion.div>
                <div className="flex-1">
                  <p className="text-yellow-300 font-bold text-lg">Milestone Achieved!</p>
                  <p className="text-white">{achievedMilestone.title}</p>
                  <p className="text-yellow-200 text-sm mt-1">{achievedMilestone.reward}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const progress = (milestone.current / milestone.target) * 100;
          const isComplete = progress >= 100;

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br ${milestone.color} bg-opacity-10 border border-white/20 backdrop-blur-sm p-4`}>
                {/* Progress background */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`absolute inset-0 bg-gradient-to-r ${milestone.color} opacity-20`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-br ${milestone.color} p-2 rounded-lg`}>
                        {milestone.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{milestone.title}</h4>
                        <p className="text-white/70 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                    {isComplete && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Trophy className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">
                        {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}
                      </span>
                      <span className="text-white font-bold">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${milestone.color} relative`}
                      >
                        <motion.div
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Reward preview */}
                  {!isComplete && progress >= 80 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-white/80 text-xs"
                    >
                      <span className="text-yellow-400">🎁</span>
                      <span>Almost there! {milestone.reward}</span>
                    </motion.div>
                  )}

                  {isComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-green-500/20 border border-green-400/50 rounded-lg px-3 py-2 flex items-center justify-between"
                    >
                      <span className="text-green-300 text-sm font-bold">✅ Completed!</span>
                      <span className="text-green-200 text-xs">{milestone.reward}</span>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
