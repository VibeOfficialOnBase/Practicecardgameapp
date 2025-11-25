import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Leaf, Zap, Sparkles } from 'lucide-react';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { soundManager } from '../components/utils/soundManager';

const lecheIcons = {
  Love: Heart,
  Empathy: Users,
  Community: Users,
  Healing: Leaf,
  Empowerment: Zap
};

const lecheColors = {
  Love: 'from-rose-400 to-pink-500',
  Empathy: 'from-blue-400 to-indigo-500',
  Community: 'from-purple-400 to-violet-500',
  Healing: 'from-emerald-400 to-green-500',
  Empowerment: 'from-amber-400 to-orange-500'
};

export default function PulledCard({ card, userEmail }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  // Fallback logic for card data
  const Icon = lecheIcons[card.leche_value] || Heart;
  const missionText = card.mission || "Reflect on how this value manifests in your life today.";

  const { play } = useSound();
  const { trigger } = useHaptic();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userEmail],
    queryFn: () => base44.entities.FavoriteCard.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const isFavorited = favorites.some(fav => fav.practice_card_id === card.id);

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        const favorite = favorites.find(fav => fav.practice_card_id === card.id);
        await base44.entities.FavoriteCard.delete(favorite.id);
      } else {
        await base44.entities.FavoriteCard.create({
          practice_card_id: card.id,
          user_email: userEmail,
          favorited_date: new Date().toISOString()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      play('success');
      trigger('light');
    }
  });

  React.useEffect(() => {
    play('card-flip');
    trigger('strong');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [play, trigger]);

  const handleFlip = () => {
    if (soundManager.isEnabled()) {
      play('card-flip');
    }
    trigger('light');
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, rotateY: -180, opacity: 0, y: 50 }}
      animate={{ scale: 1, rotateY: 0, opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        duration: 0.8,
        bounce: 0.3
      }}
      className="mx-auto relative w-full max-w-[320px] aspect-[2/3]"
      style={{ perspective: '1000px' }}
    >
      {showConfetti && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full z-50"
              style={{
                background: ['#fbbf24', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][i % 5],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 300,
                y: Math.random() * -300 - 50,
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1 + Math.random(),
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front (technically back of card before flip) */}
        <div
          className="absolute inset-0 rounded-[32px] shadow-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-purple-900 to-indigo-900 border border-white/10"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          onClick={handleFlip}
        >
          <div className="absolute inset-0 bg-[url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/43aec5bff_PRACTICECARDBACK.jpg')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 text-center">
             <p className="text-white/70 text-sm font-medium animate-pulse">Tap to Reveal</p>
          </div>
        </div>

        {/* Back (Content Side) */}
        <div
          className="absolute inset-0 rounded-[32px] shadow-2xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          onClick={handleFlip}
        >
            {/* Card Art Background (Using gradient/pattern instead of potentially broken image) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${lecheColors[card.leche_value] || 'from-purple-500 to-indigo-600'} opacity-10`} />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col p-6">
                {/* Header Icon */}
                <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${lecheColors[card.leche_value] || 'from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center text-center justify-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                        {card.title}
                    </h2>

                    <div className="relative py-4 px-2">
                        <Sparkles className="absolute top-0 left-0 w-4 h-4 text-amber-400 opacity-50" />
                        <p className="text-lg font-serif italic text-slate-600 dark:text-slate-300">
                            "{card.affirmation}"
                        </p>
                        <Sparkles className="absolute bottom-0 right-0 w-4 h-4 text-amber-400 opacity-50" />
                    </div>

                    {/* Mission Bubble */}
                    <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-black/5 dark:border-white/10 shadow-sm w-full">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Mission</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                            {missionText}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                     <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <span>⏱️ {card.estimated_time || '5m'}</span>
                     </div>
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite.mutate();
                        }}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                     >
                        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                     </button>
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
