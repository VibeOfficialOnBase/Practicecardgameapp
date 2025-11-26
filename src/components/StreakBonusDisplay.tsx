import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  getStreakMultiplier, 
  getNextMilestone, 
  getMilestoneReward,
  STREAK_MILESTONES 
} from '@/utils/streakBonuses';
import { Flame, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakBonusDisplayProps {
  streak: number;
}

export default function StreakBonusDisplay({ streak }: StreakBonusDisplayProps) {
  const multiplier = getStreakMultiplier(streak);
  const nextMilestone = getNextMilestone(streak);
  const currentMilestone = getMilestoneReward(streak);

  if (streak < 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-lg bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-400/30">
        <CardContent className="p-4 space-y-3">
          {/* Current Streak Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <div>
                <p className="text-white font-bold text-lg">{streak} Day Streak</p>
                <p className="text-orange-200 text-xs">Keep it going!</p>
              </div>
            </div>
            
            {multiplier > 1 && (
              <Badge className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-200 border-yellow-400/50 text-lg px-3 py-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {multiplier}x XP
              </Badge>
            )}
          </div>

          {/* Current Milestone Achievement */}
          {currentMilestone && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`bg-gradient-to-r ${currentMilestone.color} p-3 rounded-lg`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentMilestone.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{currentMilestone.name}</p>
                  <p className="text-white/80 text-xs">{currentMilestone.description}</p>
                </div>
                <Award className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}

          {/* Next Milestone Progress */}
          {nextMilestone && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-200">Next: {nextMilestone.name}</span>
                <span className="text-white font-semibold">
                  {nextMilestone.day - streak} days
                </span>
              </div>
              <Progress 
                value={(streak / nextMilestone.day) * 100}
                className="h-2 bg-white/10"
              />
              <p className="text-orange-300/80 text-xs">
                {nextMilestone.reward.xpMultiplier}x multiplier • {nextMilestone.reward.bonusXP} bonus XP
              </p>
            </div>
          )}

          {/* Milestones Grid */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-orange-200 text-xs mb-2">All Milestones:</p>
            <div className="grid grid-cols-4 gap-2">
              {STREAK_MILESTONES.slice(0, 8).map((milestone) => (
                <div
                  key={milestone.day}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    streak >= milestone.day
                      ? `bg-gradient-to-br ${milestone.color}`
                      : 'bg-white/5'
                  }`}
                  title={`${milestone.name} - Day ${milestone.day}`}
                >
                  <span className={`text-xl ${streak >= milestone.day ? '' : 'opacity-30'}`}>
                    {milestone.icon}
                  </span>
                  <span className={`text-xs font-bold ${
                    streak >= milestone.day ? 'text-white' : 'text-gray-500'
                  }`}>
                    {milestone.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
