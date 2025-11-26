import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Sparkles, Lock } from 'lucide-react';
import { getRarityCollectionStats, RARITY_CONFIG, type CardRarity } from '@/utils/cardRarity';
import { getUserPulls } from '@/utils/pullTracking';

interface CollectionProgressProps {
  username: string;
}

export function CollectionProgress({ username }: CollectionProgressProps) {
  const [stats, setStats] = useState<any>(null);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    calculateProgress();
  }, [username]);

  const calculateProgress = () => {
    const pulls = getUserPulls(username);
    const uniqueCards = new Set(pulls.map((p: any) => p.cardId));
    const totalCards = 365;
    const progress = Math.round((uniqueCards.size / totalCards) * 100);
    
    setTotalProgress(progress);
    setStats({
      collected: uniqueCards.size,
      total: totalCards,
      remaining: totalCards - uniqueCards.size,
    });
  };

  if (!stats) {
    return null;
  }

  const milestones = [
    { threshold: 25, reward: '🌱 Beginner Badge', unlocked: totalProgress >= 25 },
    { threshold: 50, reward: '🌿 Collector Badge', unlocked: totalProgress >= 50 },
    { threshold: 75, reward: '🌳 Master Badge', unlocked: totalProgress >= 75 },
    { threshold: 100, reward: '👑 Completionist Crown', unlocked: totalProgress >= 100 },
  ];

  return (
    <Card className="glass-card border-2 border-purple-400/30 bg-gradient-to-br from-purple-950/40 to-pink-950/40">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Collection Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Overall Completion</span>
            <span className="text-white font-bold">{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-3" />
          <p className="text-white/60 text-xs mt-2">
            {stats.collected} / {stats.total} cards collected
          </p>
        </div>

        {/* Milestones */}
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Collection Milestones</p>
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  milestone.unlocked
                    ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-400/50'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {milestone.unlocked ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400-yellow-400" />
                    </motion.div>
                  ) : (
                    <Lock className="w-5 h-5 text-white/40" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${
                      milestone.unlocked ? 'text-green-300' : 'text-white/60'
                    }`}>
                      {milestone.reward}
                    </p>
                    <p className="text-white/40 text-xs">
                      {milestone.threshold}% completion
                    </p>
                  </div>
                </div>
                {milestone.unlocked && (
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Milestone */}
        {totalProgress < 100 && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-400/30">
            <p className="text-blue-300 text-sm font-semibold mb-2">🎯 Next Milestone</p>
            <p className="text-white text-sm mb-2">
              {milestones.find(m => !m.unlocked)?.reward || 'Completionist Crown'}
            </p>
            <div className="flex items-center gap-2">
              <Progress 
                value={totalProgress % 25 * 4} 
                className="h-2 flex-1"
              />
              <span className="text-white/60 text-xs">
                {Math.ceil((milestones.find(m => !m.unlocked)?.threshold || 100) - totalProgress)}% to go
              </span>
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        {totalProgress === 100 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-lg bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-400/50 text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-6xl mb-3"
            >
              👑
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-2">
              Collection Complete!
            </h3>
            <p className="text-yellow-200 text-sm">
              You've collected all {stats.total} cards! You are a true PRACTICE master! 🎉
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
