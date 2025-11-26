import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { allCards, type PracticeCard } from '@/data/cardsWithRarity';
import { getUserPulls } from '@/utils/pullTracking';
import { getFavorites } from '@/utils/favoritesTracking';
import { getAllPulledCardIds } from '@/utils/multiPackPullTracking';
import { Search, Calendar, Heart, BookOpen } from 'lucide-react';
import { CollectionCard } from '@/components/CollectionCard';


interface CardCollectionGalleryProps {
  username: string;
  onCardClick?: (card: PracticeCard) => void;
}

export function CardCollectionGallery({ username, onCardClick }: CardCollectionGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'favorites'>('all');
  
  const userPulls = getUserPulls(username);
  const favorites = getFavorites(username);
  
  // Get cards from BOTH old system AND multi-pack system
  const pulledCardIds = useMemo(() => {
    // Old system cards
    const oldSystemCards = Array.from(new Set(userPulls.map((pull) => pull.cardId)));
    
    // Multi-pack system cards (ALL historical pulls from all packs)
    const multiPackCards = getAllPulledCardIds(username);
    
    // Combine both systems
    return Array.from(new Set([...oldSystemCards, ...multiPackCards]));
  }, [userPulls, username]);
  
  const pulledCards = useMemo(() => {
    return allCards.filter((card) => pulledCardIds.includes(card.id));
  }, [pulledCardIds]);
  
  const favoriteCards = useMemo(() => {
    const favIds = favorites.map((fav) => fav.cardId);
    return allCards.filter((card) => favIds.includes(card.id));
  }, [favorites]);
  
  const displayCards = filterTab === 'favorites' ? favoriteCards : pulledCards;
  
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return displayCards;
    
    const query = searchQuery.toLowerCase();
    return displayCards.filter((card) =>
      card.affirmation.toLowerCase().includes(query) ||
      card.mission.toLowerCase().includes(query) ||
      card.inspiration.toLowerCase().includes(query)
    );
  }, [displayCards, searchQuery]);
  
  if (pulledCards.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card border-white/20 rounded-2xl p-8 sm:p-12 max-w-md mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-purple-300" />
          </div>
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-white mb-3">No Cards Yet</h3>
          <p className="text-white/70 leading-relaxed">
            Pull your first daily card to start your collection and begin your PRACTICE journey!
          </p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-white/80 text-sm">Powered By</span>
        <img
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
          alt="VibeOfficial"
          width={32}
          height={32}
          className="object-contain rounded-full shadow-lg border-2 border-purple-300/50"
        />
        <span className="text-white font-bold">$VibeOfficial</span>
      </div>
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-white">{pulledCards.length}</div>
            <div className="text-indigo-200 text-sm">Cards Collected</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-white">{favorites.length}</div>
            <div className="text-indigo-200 text-sm">Favorites</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-white/20 backdrop-blur-sm col-span-2 sm:col-span-1">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-white">{userPulls.length}</div>
            <div className="text-indigo-200 text-sm">Total Pulls</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            placeholder="Search your cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
          />
        </div>
        <Tabs value={filterTab} onValueChange={(val) => setFilterTab(val as 'all' | 'favorites')}>
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
              <Calendar className="w-4 h-4 mr-2" />
              All ({pulledCards.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-white/20">
              <Heart className="w-4 h-4 mr-2" />
              Favorites ({favorites.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white/80">No cards match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card, index) => (
            <CollectionCard
              key={card.id}
              card={card}
              username={username}
              onCardClick={onCardClick}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
