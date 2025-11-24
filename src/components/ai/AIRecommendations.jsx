import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, X, Check, Zap, Users, Heart, GamepadIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const iconMap = {
  game: GamepadIcon,
  practice: Sparkles,
  friend: Users,
  affirmation_card: Heart
};

export default function AIRecommendations({ userEmail }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: recommendations = [] } = useQuery({
    queryKey: ['aiRecommendations', userEmail],
    queryFn: () => base44.entities.AIRecommendation.filter({
      user_email: userEmail,
      dismissed: false
    }),
    enabled: !!userEmail
  });

  const acceptRecommendation = useMutation({
    mutationFn: async (recommendation) => {
      await base44.entities.AIRecommendation.update(recommendation.id, { accepted: true });
      
      // Handle navigation based on type
      if (recommendation.recommendation_type === 'game') {
        const gamePageMap = {
          'chakra_blaster': 'ChakraBlasterMax',
          'challenge_bubbles': 'ChallengeBubbles',
          'memory_match': 'MemoryMatch'
        };
        navigate(createPageUrl(gamePageMap[recommendation.recommendation_data.game_type]));
      } else if (recommendation.recommendation_type === 'practice') {
        navigate(createPageUrl('Practice'));
      } else if (recommendation.recommendation_type === 'friend') {
        navigate(createPageUrl('Friends'));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] });
    }
  });

  const dismissRecommendation = useMutation({
    mutationFn: (recommendationId) => 
      base44.entities.AIRecommendation.update(recommendationId, { dismissed: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] });
    }
  });

  if (recommendations.length === 0) return null;

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedRecs = [...recommendations].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold ensure-readable-strong flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          AI-Powered Suggestions
        </h3>
        <span className="text-xs text-label px-3 py-1 bg-amber-500/20 rounded-full">
          Personalized
        </span>
      </div>
      
      <AnimatePresence>
        {sortedRecs.slice(0, 3).map((rec, index) => {
          const Icon = iconMap[rec.recommendation_type] || Sparkles;
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="card-organic p-4 relative"
            >
              <button
                onClick={() => dismissRecommendation.mutate(rec.id)}
                className="absolute top-2 right-2 text-label hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold ensure-readable-strong">
                    {rec.recommendation_data.title || 'Personalized Suggestion'}
                  </h4>
                  <p className="text-sm ensure-readable mt-1">
                    {rec.reasoning}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => acceptRecommendation.mutate(rec)}
                size="sm"
                className="w-full mt-3 bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Try This
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}