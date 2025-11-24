import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ThumbsUp, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PeerEndorsement({ challengeId, participantEmail, userEmail }) {
  const [isEndorsing, setIsEndorsing] = useState(false);
  const queryClient = useQueryClient();

  const { data: endorsements = [] } = useQuery({
    queryKey: ['challengeEndorsements', challengeId, participantEmail],
    queryFn: () => base44.entities.Endorsement.filter({
      endorsed_email: participantEmail
    }),
  });

  const hasEndorsed = endorsements.some(e => e.endorser_email === userEmail);
  const endorsementCount = endorsements.length;

  const endorseMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Endorsement.create({
        endorser_email: userEmail,
        endorsed_email: participantEmail,
        trait: 'Dedicated',
        message: 'Amazing work on this challenge!'
      });

      // Award XP to endorsed user
      const userLevels = await base44.entities.UserLevel.filter({ user_email: participantEmail });
      if (userLevels[0]) {
        const currentXP = userLevels[0].experience_points + 25;
        const newLevel = Math.floor(currentXP / 100) + 1;
        await base44.entities.UserLevel.update(userLevels[0].id, {
          experience_points: currentXP,
          level: newLevel,
          points_to_next_level: (newLevel * 100) - currentXP
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challengeEndorsements'] });
      queryClient.invalidateQueries({ queryKey: ['allUserLevels'] });
      setIsEndorsing(false);
    }
  });

  if (participantEmail === userEmail) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      {hasEndorsed ? (
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Endorsed</span>
        </div>
      ) : (
        <Button
          onClick={() => endorseMutation.mutate()}
          disabled={endorseMutation.isPending}
          size="sm"
          variant="ghost"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Endorse ({endorsementCount})
        </Button>
      )}
    </motion.div>
  );
}