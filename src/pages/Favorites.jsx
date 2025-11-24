import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import PulledCard from '../components/PulledCard';

export default function Favorites() {
  const [user, setUser] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: () => base44.entities.FavoriteCard.filter({ user_email: user?.email }, '-favorited_date', 50),
    enabled: !!user
  });

  const { data: allCards = [] } = useQuery({
    queryKey: ['practiceCards'],
    queryFn: () => base44.entities.PracticeCard.list('-created_date', 100),
  });

  const favoriteCards = favorites
    .map(fav => allCards.find(card => card.id === fav.practice_card_id))
    .filter(Boolean);

  if (selectedCard) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCard(null)}
          className="text-amber-400 hover:text-amber-300 font-medium"
        >
          ← Back to Favorites
        </button>
        <PulledCard card={selectedCard} userEmail={user?.email} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
          <Heart className="w-12 h-12 text-rose-400 fill-rose-400" />
          Favorite Cards
        </h1>
        <p className="text-slate-300 text-lg">
          Your collection of meaningful practices
        </p>
      </motion.div>

      {favoriteCards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-organic p-12 text-center"
        >
          <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg">
            No favorite cards yet. Start by favoriting cards during your practice!
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCard(card)}
              className="card-organic p-6 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-slate-300 text-sm mb-3 italic">"{card.affirmation}"</p>
              <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">
                {card.leche_value}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}