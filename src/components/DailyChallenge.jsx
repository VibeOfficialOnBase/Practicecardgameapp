import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyChallenge({ card, userEmail }) {
  const [completionNote, setCompletionNote] = useState('');
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: challenges = [] } = useQuery({
    queryKey: ['dailyChallenge', userEmail, today],
    queryFn: () => base44.entities.DailyChallenge.filter({
      user_email: userEmail,
      challenge_date: today
    }),
    enabled: !!userEmail
  });

  const challenge = challenges[0];

  const generateChallenge = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('generateDailyChallenge', {
        cardTheme: card.leche_value,
        cardTitle: card.title,
        cardMission: card.mission
      });

      await base44.entities.DailyChallenge.create({
        user_email: userEmail,
        challenge_date: today,
        challenge_text: response.data.challenge,
        card_theme: card.leche_value
      });

      queryClient.invalidateQueries({ queryKey: ['dailyChallenge'] });
    }
  });

  const completeChallenge = useMutation({
    mutationFn: async () => {
      await base44.entities.DailyChallenge.update(challenge.id, {
        completed: true,
        completion_note: completionNote
      });

      const userLevels = await base44.entities.UserLevel.filter({ user_email: userEmail });
      const userLevel = userLevels[0];
      
      if (userLevel) {
        const newXP = (userLevel.experience_points || 0) + 50;
        const newLevel = Math.floor(newXP / 100) + 1;
        await base44.entities.UserLevel.update(userLevel.id, {
          experience_points: newXP,
          level: newLevel,
          points_to_next_level: (newLevel * 100) - newXP
        });
      } else {
        await base44.entities.UserLevel.create({
          user_email: userEmail,
          level: 1,
          experience_points: 50,
          points_to_next_level: 50
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyChallenge'] });
      queryClient.invalidateQueries({ queryKey: ['userLevel'] });
      alert('Challenge completed! +50 XP earned!');
      setCompletionNote('');
    }
  });

  useEffect(() => {
    if (!challenge && card && userEmail) {
      generateChallenge.mutate();
    }
  }, [card, userEmail, challenge]);

  if (!challenge) {
    return (
      <div className="card-organic p-6 text-center">
        <Target className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <p className="text-slate-600">Generating your daily challenge...</p>
      </div>
    );
  }

  if (challenge.completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-organic p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
      >
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-900 mb-2">Challenge Complete!</h3>
          <p className="text-green-700">+50 XP earned today</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-organic p-6 space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Today's Challenge</h3>
          <p className="text-sm text-amber-600 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Complete for +50 XP
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
        <p className="text-slate-800 font-medium">{challenge.challenge_text}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-slate-700">
          How did you complete this challenge?
        </label>
        <Textarea
          value={completionNote}
          onChange={(e) => setCompletionNote(e.target.value)}
          placeholder="Share what you did..."
          className="min-h-24 rounded-xl"
        />
      </div>

      <Button
        onClick={() => completeChallenge.mutate()}
        disabled={!completionNote.trim() || completeChallenge.isPending}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-4"
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        {completeChallenge.isPending ? 'Completing...' : 'Complete Challenge'}
      </Button>
    </motion.div>
  );
}