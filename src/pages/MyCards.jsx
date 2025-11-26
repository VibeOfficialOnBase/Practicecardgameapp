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
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ShareModal from '../components/common/ShareModal';

export default function MyCards() {
  const [shareCard, setShareCard] = useState(null);
  
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: favoritedCards, isLoading } = useQuery({
    queryKey: ['favoritedCards', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const favorites = await base44.entities.CardsFavorites.filter({ user_id: user.id });
      if (!favorites) return [];
      const cardIds = favorites.map(fav => fav.card_id);
      
      if (cardIds.length === 0) return [];

      const allCards = await base44.entities.PracticeCard.list();
      const userFavoriteCards = allCards.filter(card => cardIds.includes(card.id));

      return favorites.map(fav => ({
        ...fav,
        cardDetails: userFavoriteCards.find(card => card.id === fav.card_id)
      })).filter(item => item.cardDetails);
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Sacred Collection"
        subtitle="Your favorite cards & insights"
      />

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[var(--bg-secondary)] p-1 rounded-2xl mb-6">
            <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-[var(--bg-primary)] data-[state=active]:shadow-sm">Favorites</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-[var(--bg-primary)] data-[state=active]:shadow-sm">History</TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
            {!favoritedCards || favoritedCards.length === 0 ? (
                <Card className="p-8 text-center">
                    <BookOpen className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">No Favorites Yet</h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                        Mark cards with a <Heart className="inline w-3 h-3 text-rose-500" /> to save them here.
                    </p>
                    <Link to={createPageUrl('Practice')}>
                        <Button variant="primary">Start a Practice</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {favoritedCards.map((fav, index) => (
                        <motion.div
                            key={fav.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <PulledCard card={fav.cardDetails} userEmail={user.email} />
                            <Button
                                variant="secondary"
                                size="sm"
                                className="mt-4 w-full max-w-[200px]"
                                onClick={() => setShareCard(fav.cardDetails)}
                            >
                                <Share2 className="w-4 h-4 mr-2" /> Share
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}
        </TabsContent>

        <TabsContent value="history">
            {/* Placeholder for history if needed, or just redirect to Calendar */}
            <Card className="p-6 text-center">
                <p>View your full history in the Journal.</p>
                <Link to={createPageUrl('Calendar')} className="text-[var(--accent-primary)] font-bold mt-2 inline-block">Go to Journal</Link>
            </Card>
        </TabsContent>
      </Tabs>

      {shareCard && <ShareModal card={shareCard} onClose={() => setShareCard(null)} />}
    </div>
  );
}
