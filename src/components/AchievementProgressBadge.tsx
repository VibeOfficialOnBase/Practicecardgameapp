import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, CheckCircle } from 'lucide-react';
import type { Achievement } from '@/utils/achievementsTracking';

interface AchievementProgressBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: number;
  currentProgress: number;
  requirement: number;
}

export function AchievementProgressBadge({ 
  achievement, 
  unlocked, 
  unlockedAt,
  currentProgress,
  requirement 
}: AchievementProgressBadgeProps) {
  const progressPercentage = Math.min((currentProgress / requirement) * 100, 100);
  const isClose = !unlocked && progressPercentage >= 50;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: unlocked ? 1.05 : 1.02 }}
      className="relative"
    >
      <Card
        className={`relative overflow-hidden border-2 backdrop-blur-sm transition-all duration-300 ${
          unlocked
            ? `bg-gradient-to-br ${achievement.color} border-white/30 shadow-lg`
            : isClose
            ? 'bg-white/10 border-yellow-400/40 shadow-yellow-400/20 shadow-md'
            : 'bg-white/5 border-white/10 opacity-60'
        }`}
      >
        <CardContent className="p-4 text-center">
          {/* Icon */}
          <div className={`text-4xl mb-2 ${!unlocked && 'grayscale opacity-40'}`}>
            {unlocked ? (
              <div className="relative">
                {achievement.icon}
                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-400 bg-white rounded-full" />
              </div>
            ) : (
              <Lock className="w-10 h-10 mx-auto text-white/30" />
            )}
          </div>
          
          {/* Name */}
          <h3 className={`font-bold mb-1 text-sm ${unlocked ? 'text-white' : 'text-white/50'}`}>
            {achievement.name}
          </h3>
          
          {/* Description */}
          <p className={`text-xs mb-2 ${unlocked ? 'text-white/90' : 'text-white/40'}`}>
            {achievement.description}
          </p>
          
          {/* Progress Bar (only show if not unlocked) */}
          {!unlocked && (
            <div className="space-y-1 mt-3">
              <div className="flex justify-between items-center text-xs">
                <span className={isClose ? 'text-yellow-300 font-semibold' : 'text-white/60'}>
                  Progress
                </span>
                <span className={isClose ? 'text-yellow-300 font-bold' : 'text-white/60'}>
                  {currentProgress}/{requirement}
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className={`h-2 ${isClose ? 'bg-white/20' : 'bg-white/10'}`}
              />
              {isClose && (
                <p className="text-yellow-300 text-xs font-semibold mt-1 animate-pulse">
                  Almost there! 🌟
                </p>
              )}
            </div>
          )}
          
          {/* Unlocked Badge */}
          {unlocked && unlockedAt && (
            <Badge variant="secondary" className="bg-white/20 text-white text-xs mt-2">
              {new Date(unlockedAt).toLocaleDateString()}
            </Badge>
          )}
          
          {!unlocked && !isClose && (
            <Badge variant="outline" className="border-white/20 text-white/50 text-xs mt-2">
              Locked
            </Badge>
          )}
          
          {/* Shine Effect for Unlocked */}
          {unlocked && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
          )}
          
          {/* Glow Effect for Close to Completion */}
          {isClose && !unlocked && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
