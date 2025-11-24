import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, endOfWeek } from 'date-fns';

const getWeekId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil((now.getDate() - now.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

export default function WeeklyChallengeCard({ userEmail }) {
  const queryClient = useQueryClient();
  const currentWeek = getWeekId();

  const { data: challenges = [] } = useQuery({
    queryKey: ['weeklyChallenges', currentWeek],
    queryFn: () => base44.entities.WeeklyChallenge.filter({ 
      week_id: currentWeek,
      is_active: true 
    })
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['weeklyProgress', userEmail, currentWeek],
    queryFn: async () => {
      const allProgress = [];
      for (const challenge of challenges) {
        const prog = await base44.entities.WeeklyChallengeProgress.filter({
          user_email: userEmail,
          challenge_id: challenge.id
        });
        allProgress.push(...prog);
      }
      return allProgress;
    },
    enabled: !!userEmail && challenges.length > 0
  });

  const claimReward = useMutation({
    mutationFn: async (progressId) => {
      await base44.entities.WeeklyChallengeProgress.update(progressId, {
        reward_claimed: true
      });
      
      const prog = progress.find(p => p.id === progressId);
      const challenge = challenges.find(c => c.id === prog.challenge_id);
      
      const userLevels = await base44.entities.UserLevel.filter({ user_email: userEmail });
      if (userLevels[0]) {
        await base44.entities.UserLevel.update(userLevels[0].id, {
          experience_points: userLevels[0].experience_points + challenge.reward_xp
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userLevel'] });
    }
  });

  if (challenges.length === 0) return null;

  const weekEnd = endOfWeek(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-organic p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold ensure-readable-strong flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Weekly Challenges
        </h3>
        <div className="flex items-center gap-2 text-sm text-label">
          <Clock className="w-4 h-4" />
          <span>Ends {format(weekEnd, 'MMM d')}</span>
        </div>
      </div>

      <div className="space-y-4">
        {challenges.map(challenge => {
          const userProgress = progress.find(p => p.challenge_id === challenge.id);
          const progressPercent = userProgress 
            ? Math.min(100, (userProgress.current_progress / challenge.target_value) * 100)
            : 0;
          const isComplete = userProgress?.completed || false;
          const canClaim = isComplete && !userProgress?.reward_claimed;

          return (
            <div key={challenge.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold ensure-readable mb-1">{challenge.challenge_title}</h4>
                  <p className="text-sm text-label">{challenge.challenge_description}</p>
                </div>
                {isComplete && (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-label mb-1">
                  <span>Progress</span>
                  <span>{userProgress?.current_progress || 0} / {challenge.target_value}</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-600 to-orange-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-label">Reward: +{challenge.reward_xp} XP</span>
                </div>
                {canClaim && (
                  <Button
                    onClick={() => claimReward.mutate(userProgress.id)}
                    size="sm"
                    className="bg-gradient-to-r from-amber-600 to-orange-600"
                  >
                    Claim Reward
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}