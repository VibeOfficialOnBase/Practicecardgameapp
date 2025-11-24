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
  const gradient = lecheColors[card.leche_value];
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
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <motion.div
      initial={{ scale: 0, rotateY: -180, opacity: 0, y: 100 }}
      animate={{ scale: 1, rotateY: 0, opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        duration: 1,
        bounce: 0.4
      }}
      className="mx-auto relative"
      style={{ width: '288px' }}
    >
      {showConfetti && (
        <>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#fbbf24', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][i % 5],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0.5],
                x: (Math.random() - 0.5) * 400,
                y: Math.random() * -400 - 100,
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
      <div className="relative h-[450px]" style={{ perspective: '1000px' }}>
        {/* Card Glow & Shimmer */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(138,75,255,0.4), transparent 70%)',
            filter: 'blur(30px)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
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
          <div 
            className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              filter: 'drop-shadow(0 0 20px rgba(138,75,255,0.5))'
            }}
            onClick={handleFlip}
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/43aec5bff_PRACTICECARDBACK.jpg"
              alt="Card cover"
              className="w-full h-full object-cover"
            />
          </div>

          <div 
            className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              filter: 'drop-shadow(0 0 20px rgba(138,75,255,0.5))'
            }}
            onClick={handleFlip}
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/ff516bb3a_PRACTICECARDFRONT.jpg"
              alt="Card details"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-3"
          >
            <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/60 inline-flex items-center gap-1.5 shadow-lg">
              <Icon className="w-4 h-4 text-white drop-shadow-lg" />
              <span className="font-bold text-xs uppercase tracking-wider text-safe">
                {card.leche_value}
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-title text-xl font-bold mb-3 px-2 text-safe"
          >
            {card.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-3"
          >
            <Sparkles className="w-4 h-4 text-amber-300 mx-auto mb-2 drop-shadow-lg" />
            <p className="text-sm font-medium leading-snug italic px-3 text-safe">
              "{card.affirmation}"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/25 backdrop-blur-md rounded-xl p-3 border border-white/60 max-w-[240px] shadow-2xl"
          >
            <h3 className="font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2 justify-center text-safe">
              <span className="w-6 h-0.5 bg-white/80 rounded shadow-lg"></span>
              Your Mission
              <span className="w-6 h-0.5 bg-white/80 rounded shadow-lg"></span>
            </h3>
            <p className="card-back-text text-xs leading-relaxed text-safe">
              {card.mission}
            </p>
          </motion.div>

          {card.estimated_time && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-3 text-xs font-medium bg-white/25 backdrop-blur-md rounded-full px-3 py-1.5 inline-block shadow-lg text-safe border border-white/60"
            >
              ⏱️ {card.estimated_time}
            </motion.div>
          )}
           </div>
          </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-6">
          <button
           onClick={(e) => {
             e.stopPropagation();
             toggleFavorite.mutate();
           }}
           className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-lg ${
             isFavorited 
               ? 'bg-rose-500' 
               : 'bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/40'
           }`}
          >
           <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} 
                  style={{ color: isFavorited ? '#ffffff' : '#F2D6FF' }} />
           <span className="text-sm font-medium text-safe">
             {isFavorited ? 'Favorited' : 'Favorite'}
           </span>
          </button>
          <p className="text-sm font-medium text-safe">
           Tap card to flip
          </p>
          </div>
          </div>
          </motion.div>
          );
          }