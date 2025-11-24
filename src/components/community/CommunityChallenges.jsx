import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import PeerEndorsement from './PeerEndorsement';
import ChallengeLeaderboard from './ChallengeLeaderboard';

export default function CommunityChallenges({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => base44.entities.CommunityChallenge.filter({ is_active: true }, '-start_date', 10),
  });

  const { data: myParticipations = [] } = useQuery({
    queryKey: ['myParticipations', userEmail],
    queryFn: () => base44.entities.ChallengeParticipant.filter({ user_email: userEmail }),
  });

  const joinChallenge = useMutation({
    mutationFn: async ({ challengeId, isAnonymous }) => {
      await base44.entities.ChallengeParticipant.create({
        challenge_id: challengeId,
        user_email: userEmail,
        joined_date: new Date().toISOString(),
        is_anonymous: isAnonymous,
        share_progress: !isAnonymous
      });

      // Award participation points
      await base44.entities.ChallengePoints.create({
        user_email: userEmail,
        challenge_id: challengeId,
        points: 10,
        participation_points: 10
      });

      // Award 10 XP for joining
      const userLevels = await base44.entities.UserLevel.filter({ user_email: userEmail });
      if (userLevels[0]) {
        const currentXP = userLevels[0].experience_points + 10;
        const newLevel = Math.floor(currentXP / 100) + 1;
        await base44.entities.UserLevel.update(userLevels[0].id, {
          experience_points: currentXP,
          level: newLevel,
          points_to_next_level: (newLevel * 100) - currentXP
        });
      }
      
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        await base44.entities.CommunityChallenge.update(challengeId, {
          participants_count: (challenge.participants_count || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
    }
  });

  const isParticipating = (challengeId) => {
    return myParticipations.some(p => p.challenge_id === challengeId);
  };

  const lecheColors = {
    Love: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
    Empathy: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
    Community: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
    Healing: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
    Empowerment: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    All: 'from-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">Community Challenges</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {challenges.map((challenge, index) => {
          const participating = isParticipating(challenge.id);
          const participation = myParticipations.find(p => p.challenge_id === challenge.id);
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card-organic p-6 bg-gradient-to-br ${lecheColors[challenge.leche_value] || lecheColors.All} border`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                  <span className="text-sm text-amber-400 font-medium">{challenge.theme}</span>
                </div>
                {participating && (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                )}
              </div>

              <p className="text-slate-300 text-sm mb-4">{challenge.description}</p>

              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span>{challenge.duration_days} days</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants_count || 0} joined</span>
                  </div>
                </div>
                {participating && participation && (
                  <PeerEndorsement
                    challengeId={challenge.id}
                    participantEmail={participation.user_email}
                    userEmail={userEmail}
                  />
                )}
              </div>

              {participating && participation ? (
                <>
                  <div className="bg-white/10 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Your Progress</span>
                      <span className="text-sm font-bold text-amber-400">
                        {participation.progress_days}/{challenge.duration_days}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(participation.progress_days / challenge.duration_days) * 100}%` }}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                  <ChallengeLeaderboard challengeId={challenge.id} />
                </>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => joinChallenge.mutate({ challengeId: challenge.id, isAnonymous: false })}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm"
                  >
                    Join Openly
                  </button>
                  <button
                    onClick={() => joinChallenge.mutate({ challengeId: challenge.id, isAnonymous: true })}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm"
                  >
                    Join Anonymously
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}