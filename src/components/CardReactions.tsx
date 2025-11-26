import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Flame, Star, ThumbsUp } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';
import confetti from 'canvas-confetti';

interface CardReactionsProps {
  card: PracticeCard;
  username: string;
}

const REACTIONS = [
  { id: 'resonate', icon: <Heart className="w-5 h-5" />, color: 'text-pink-400', label: 'Resonates' },
  { id: 'inspiring', icon: <Sparkles className="w-5 h-5" />, color: 'text-purple-400', label: 'Inspiring' },
  { id: 'powerful', icon: <Flame className="w-5 h-5" />, color: 'text-orange-400', label: 'Powerful' },
  { id: 'favorite', icon: <Star className="w-5 h-5" />, color: 'text-yellow-400', label: 'Favorite' },
  { id: 'helpful', icon: <ThumbsUp className="w-5 h-5" />, color: 'text-blue-400', label: 'Helpful' },
];

export function CardReactions({ card, username }: CardReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    loadReactions();
  }, [card.id, username]);

  const loadReactions = () => {
    // Load global reactions for this card
    const globalKey = `practice_card_reactions_${card.id}`;
    const stored = localStorage.getItem(globalKey);
    if (stored) {
      setReactions(JSON.parse(stored));
    }

    // Load user's reaction
    const userKey = `practice_user_reaction_${username}_${card.id}`;
    const userStored = localStorage.getItem(userKey);
    if (userStored) {
      setUserReaction(userStored);
    }
  };

  const handleReaction = (reactionId: string) => {
    // Toggle reaction
    const newUserReaction = userReaction === reactionId ? null : reactionId;
    setUserReaction(newUserReaction);

    // Update counts
    const updatedReactions = { ...reactions };
    
    // Remove old reaction
    if (userReaction && updatedReactions[userReaction]) {
      updatedReactions[userReaction] = Math.max(0, updatedReactions[userReaction] - 1);
    }

    // Add new reaction
    if (newUserReaction) {
      updatedReactions[newUserReaction] = (updatedReactions[newUserReaction] || 0) + 1;
      
      // Mini confetti for reaction
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#A78BFA', '#EC4899', '#F59E0B'],
      });
    }

    setReactions(updatedReactions);

    // Save to localStorage
    const globalKey = `practice_card_reactions_${card.id}`;
    localStorage.setItem(globalKey, JSON.stringify(updatedReactions));

    const userKey = `practice_user_reaction_${username}_${card.id}`;
    if (newUserReaction) {
      localStorage.setItem(userKey, newUserReaction);
    } else {
      localStorage.removeItem(userKey);
    }
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-3">
      {/* Reaction Summary */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowReactions(!showReactions)}
          variant="outline"
          size="sm"
          className="glass-card border-white/20 text-white hover:bg-white/10"
        >
          {totalReactions > 0 ? (
            <>
              <Heart className="w-4 h-4 mr-2 text-pink-400" />
              {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-2" />
              React to this card
            </>
          )}
        </Button>
        
        {userReaction && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-sm text-white/70"
          >
            You reacted with {REACTIONS.find(r => r.id === userReaction)?.label}
          </motion.div>
        )}
      </div>

      {/* Reactions Panel */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-5 gap-2"
          >
            {REACTIONS.map((reaction) => {
              const count = reactions[reaction.id] || 0;
              const isActive = userReaction === reaction.id;
              
              return (
                <motion.button
                  key={reaction.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(reaction.id)}
                  className={`
                    relative p-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-white/20 border-2 border-white/40 shadow-lg' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <div className={`${reaction.color} mb-1`}>
                    {reaction.icon}
                  </div>
                  {count > 0 && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {count}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Reactions Summary */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {REACTIONS
            .filter(r => (reactions[r.id] || 0) > 0)
            .sort((a, b) => (reactions[b.id] || 0) - (reactions[a.id] || 0))
            .slice(0, 3)
            .map(reaction => (
              <div
                key={reaction.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-xs text-white"
              >
                <span className={reaction.color}>{reaction.icon}</span>
                <span>{reactions[reaction.id]}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
