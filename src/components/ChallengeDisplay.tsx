import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  getActiveChallenges, 
  getUserChallengeProgress, 
  type Challenge 
} from '@/utils/challengeTracking';

interface ChallengeDisplayProps {
  userId: string;
}

export default function ChallengeDisplay({ userId }: ChallengeDisplayProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const activeChallenges = getActiveChallenges();
    setChallenges(activeChallenges);
  }, []);

  const formatTimeRemaining = (endDate: number): string => {
    const now = Date.now();
    const remaining = endDate - now;
    
    if (remaining < 0) return 'Expired';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-white">🎯 Active Challenges</h2>
      </div>

      {challenges.map((challenge: Challenge) => {
        const userProgress = getUserChallengeProgress(userId, challenge.id);
        const progress = userProgress?.progress || 0;
        const progressPercent = (progress / challenge.requirement.target) * 100;
        const isCompleted = userProgress?.completed || false;

        return (
          <Card 
            key={challenge.id}
            className={`bg-gradient-to-br ${
              challenge.type === 'daily' 
                ? 'from-blue-900/50 to-indigo-900/50' 
                : 'from-purple-900/50 to-pink-900/50'
            } backdrop-blur-sm border-2 ${
              isCompleted ? 'border-green-500/50' : 'border-purple-500/30'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{challenge.icon}</span>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {challenge.name}
                    </CardTitle>
                    <p className="text-gray-300 text-sm mt-1">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    challenge.type === 'daily'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                  }
                >
                  {challenge.type.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {progress} / {challenge.requirement.target}
                  </span>
                  <span className="text-gray-300">
                    {isCompleted ? '✅ Completed!' : `${Math.min(100, Math.round(progressPercent))}%`}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, progressPercent)} 
                  className="h-2"
                />
              </div>

              {/* Reward and Time */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-semibold">
                    {challenge.xpReward} XP
                  </span>
                  {isCompleted && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      Claimed
                    </Badge>
                  )}
                </div>
                <span className="text-gray-400 text-sm">
                  ⏱️ {formatTimeRemaining(challenge.endDate)}
                </span>
              </div>

              {/* Next Step Hint */}
              {!isCompleted && progressPercent < 100 && (
                <div className="bg-white/5 rounded p-2 text-xs text-gray-400">
                  💡 {
                    challenge.requirement.action === 'morning_pull' ? 'Pull before 9 AM' :
                    challenge.requirement.action === 'share' ? 'Share your card' :
                    challenge.requirement.action === 'journal_words' ? 'Write in your journal' :
                    challenge.requirement.action === 'combo' ? 'Pull, favorite, and share quickly' :
                    challenge.requirement.action === 'favorite' ? 'Favorite cards from collection' :
                    challenge.requirement.action === 'daily_pulls' ? 'Pull card every day' :
                    challenge.requirement.action === 'shares' ? 'Share cards this week' :
                    challenge.requirement.action === 'journal_entries' ? 'Journal daily' :
                    'Keep going!'
                  }
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {challenges.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardContent className="py-8 text-center text-gray-400">
            <p>No active challenges. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
