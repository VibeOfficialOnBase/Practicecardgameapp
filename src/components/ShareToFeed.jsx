import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShareToFeed({ card, userEmail, cardType = 'daily' }) {
  const [showShare, setShowShare] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const queryClient = useQueryClient();

  const sharePost = useMutation({
    mutationFn: async () => {
      await base44.entities.CommunityPost.create({
        content: `🌟 ${cardType === 'bonus' ? 'Bonus Pack' : 'Daily'} Card: ${card.title}\n\n"${card.affirmation}"\n\n${interpretation}`,
        post_type: 'celebration',
        practice_card_id: card.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      setShowShare(false);
      setInterpretation('');
      alert('Shared to community feed!');
    }
  });

  return (
    <div className="card-organic p-4">
      <Button
        onClick={() => setShowShare(!showShare)}
        variant="outline"
        className="w-full rounded-xl flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share to Community
      </Button>

      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <Textarea
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              placeholder="Share your interpretation or how you'll apply this card today..."
              className="min-h-24 rounded-xl"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowShare(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => sharePost.mutate()}
                disabled={!interpretation.trim() || sharePost.isPending}
                className="flex-1 bg-amber-500 hover:bg-amber-600 rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}