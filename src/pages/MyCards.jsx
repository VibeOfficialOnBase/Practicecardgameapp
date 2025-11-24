import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Heart, Sparkles, BookOpen, Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PulledCard from '../components/PulledCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyCards() {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState('favorites');
  
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: favoritedCards, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favoritedCards', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const favorites = await base44.entities.FavoriteCard.filter({ user_email: user.email });
      const cardIds = favorites.map(fav => fav.practice_card_id);
      
      if (cardIds.length === 0) return [];

      const allCards = await base44.entities.PracticeCard.list();
      const userFavoriteCards = allCards.filter(card => cardIds.includes(card.id));

      return favorites.map(fav => ({
        ...fav,
        cardDetails: userFavoriteCards.find(card => card.id === fav.practice_card_id)
      })).filter(item => item.cardDetails);
    },
    enabled: !!user,
  });

  const { data: reflections = [], isLoading: isLoadingReflections } = useQuery({
    queryKey: ['reflections', user?.email],
    queryFn: () => base44.entities.GameReflection.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const handleShare = async (card) => {
    const shareData = {
      title: card.title,
      text: `${card.affirmation} - ${card.leche_value} Practice`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(`${card.title}: ${card.affirmation}`);
      setCopiedId(card.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (isLoadingFavorites || isLoadingReflections) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white ensure-readable">Loading...</p>
      </div>
    );
  }

  const gameNames = {
    chakra_blaster: 'Chakra Blaster',
    challenge_bubbles: 'Challenge Bubbles',
    memory_match: 'Memory Match'
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-4 text-center ensure-readable-strong">My Sacred Space</h1>
        <p className="text-center mb-10 text-lg text-purple-200 ensure-readable">
          Your favorite cards and personal reflections.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favorite Cards
            </TabsTrigger>
            <TabsTrigger value="reflections" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Reflections Journal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">

        {favoritedCards?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-organic p-8 text-center max-w-lg mx-auto"
          >
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 ensure-readable-strong">No Favorite Cards Yet</h2>
            <p className="text-purple-200 ensure-readable mb-4">
              Explore your daily practices and mark cards with a <Heart className="inline w-4 h-4 text-rose-400" /> to save them here.
            </p>
            <Link
              to={createPageUrl('Practice')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start a Practice
            </Link>
          </motion.div>
        ) : (
          <ScrollArea className="h-[70vh] rounded-xl border border-purple-500/20 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6 justify-items-center">
              {favoritedCards?.map((fav, index) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <PulledCard card={fav.cardDetails} userEmail={user.email} />
                  <button
                    onClick={() => handleShare(fav.cardDetails)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all border border-white/40 shadow-lg"
                  >
                    {copiedId === fav.cardDetails.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Share2 className="w-4 h-4" style={{ color: '#C7B1FF' }} />
                    )}
                    <span className="text-sm font-medium font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {copiedId === fav.cardDetails.id ? 'Copied!' : 'Share'}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}

          </TabsContent>

          <TabsContent value="reflections">
            {reflections.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-organic p-8 text-center"
              >
                <MessageSquare className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 ensure-readable-strong">No Reflections Yet</h2>
                <p className="text-purple-200 ensure-readable mb-4">
                  Complete games and write reflections to build your personal journal.
                </p>
                <Link
                  to={createPageUrl('Games')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Playing
                </Link>
              </motion.div>
            ) : (
              <ScrollArea className="h-[70vh] rounded-xl border border-purple-500/20 shadow-inner">
                <div className="space-y-4 p-4 sm:p-6">
                  {reflections.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).map((reflection, index) => (
                    <motion.div
                      key={reflection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-organic p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg ensure-readable-strong">
                            {gameNames[reflection.game_type]}
                          </h3>
                          <p className="text-sm text-label">
                            {new Date(reflection.created_date).toLocaleDateString()} • Score: {reflection.score}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          reflection.performance_rating === 'excelling' ? 'bg-green-500/20 text-green-300' :
                          reflection.performance_rating === 'improving' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {reflection.performance_rating}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 mb-3">
                        <p className="text-sm text-label mb-2 italic">Reflection Prompt:</p>
                        <p className="ensure-readable">"{reflection.ai_prompt}"</p>
                      </div>

                      {reflection.user_reflection && (
                        <div className="bg-purple-500/10 rounded-xl p-4">
                          <p className="text-sm text-label mb-2">Your Reflection:</p>
                          <p className="ensure-readable">{reflection.user_reflection}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}