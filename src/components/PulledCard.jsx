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
  const Icon = lecheIcons[card.leche_value] || Heart;
  const missionText = card.mission || "Reflect on how this value manifests in your life today.";

  const { play } = useSound();
  const { trigger } = useHaptic();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userEmail],
    queryFn: () => base44.entities.CardsFavorites.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const isFavorited = favorites.some(fav => fav.card_id === card.id);

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        const favorite = favorites.find(fav => fav.card_id === card.id);
        await base44.entities.CardsFavorites.delete(favorite.id);
      } else {
        await base44.entities.CardsFavorites.create({
          card_id: card.id,
          user_id: userEmail,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userEmail] });
      queryClient.invalidateQueries({ queryKey: ['favoritedCards', userEmail] });
    },
    onError: (error) => {
      console.error("Failed to toggle favorite:", error);
      // Optionally: Add user-facing error toast
    }
  });

  const handleFlip = () => {
    if (soundManager.isEnabled()) play('card-flip');
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
      transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
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
              transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
            />
          ))}
        </>
      )}

      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front (Back of card) */}
        <div
          className="absolute inset-0 rounded-[32px] shadow-2xl overflow-hidden cursor-pointer border border-white/10"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          onClick={handleFlip}
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/43aec5bff_PRACTICECARDBACK.jpg"
            alt="Card Back"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 text-center">
             <p className="text-white/90 text-sm font-bold tracking-widest uppercase animate-pulse">Tap to Reveal</p>
          </div>
        </div>

        {/* Back (Content Side - Restored Visual Design) */}
        <div
          className="absolute inset-0 rounded-[32px] shadow-2xl overflow-hidden cursor-pointer border border-white/10 bg-black"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          onClick={handleFlip}
        >
            {/* Full Image Background */}
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/ff516bb3a_PRACTICECARDFRONT.jpg"
              alt="Card Art"
              className="w-full h-full object-cover opacity-60"
            />

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col p-6 z-10">
                {/* Header Badge */}
                <div className="flex justify-center mb-auto pt-4">
                    <div className={`px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-2 shadow-lg`}>
                        <Icon className="w-4 h-4 text-white drop-shadow-md" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">
                            {card.leche_value}
                        </span>
                    </div>
                </div>

                {/* Main Text */}
                <div className="text-center space-y-4 mb-8">
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg leading-tight">
                        {card.title}
                    </h2>

                    <div className="relative px-2">
                        <Sparkles className="absolute -top-2 -left-1 w-3 h-3 text-amber-300 opacity-80" />
                        <p className="text-lg font-serif italic text-white/90 drop-shadow-md leading-relaxed">
                            "{card.affirmation}"
                        </p>
                        <Sparkles className="absolute -bottom-2 -right-1 w-3 h-3 text-amber-300 opacity-80" />
                    </div>
                </div>

                {/* Mission Box */}
                <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-4">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1 text-center">Mission</p>
                    <p className="text-xs font-medium text-white text-center leading-relaxed">
                        {missionText}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-auto">
                     <div className="text-xs font-bold text-white/80 flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                        <span>⏱️ {card.estimated_time || '5m'}</span>
                     </div>
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite.mutate();
                        }}
                        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-white/20 transition-all border border-white/10"
                     >
                        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                     </button>
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
