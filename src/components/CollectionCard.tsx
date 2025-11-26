import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';

import { isFavorite, toggleFavorite } from '@/utils/favoritesTracking';

interface CollectionCardProps {
  card: PracticeCard;
  username: string;
  onCardClick?: (card: PracticeCard) => void;
  index: number;
}

export function CollectionCard({ card, username, onCardClick, index }: CollectionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(username, card.id);
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const handleCardClick = () => {
    // Toggle flip state - just flip the card, don't navigate
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="w-full"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .collection-flip-card {
            perspective: 1000px;
          }

          .collection-flip-inner {
            position: relative;
            width: 100%;
            transition: transform 0.8s ease-in-out;
            transform-style: preserve-3d;
          }

          .collection-flip-inner.flipped {
            transform: rotateY(180deg);
          }

          .collection-flip-front,
          .collection-flip-back {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          .collection-flip-back {
            transform: rotateY(180deg);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        `
      }} />
      
      <div className="collection-flip-card">
        <div className={`collection-flip-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front Face - Card with centered text */}
          <div className="collection-flip-front">
            <Card
              className="group relative overflow-hidden bg-transparent border-2 border-white/20 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl"
              onClick={handleCardClick}
            >
              <div className="relative w-full aspect-[2/3]">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3c7aff8f-230d-47f2-bcf1-e867252a5833-XsinrK6LfchksIA9GYIBPFTSm2RHNO"
                  alt="PRACTICE Card"
                 
                  className="object-cover"
                />
                
                {/* Text Overlay - Centered */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 space-y-3">
                  {/* Affirmation */}
                  <div className="space-y-1">
                    <h3 className="text-white/80 text-[0.5rem] uppercase tracking-wider font-bold drop-shadow-lg">
                      Affirmation
                    </h3>
                    <p className="text-white text-sm font-bold leading-tight drop-shadow-lg line-clamp-3">
                      {card.affirmation}
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="space-y-1">
                    <h3 className="text-white/80 text-[0.5rem] uppercase tracking-wider font-bold drop-shadow-lg">
                      Today's Mission
                    </h3>
                    <p className="text-white text-xs leading-tight drop-shadow-lg font-semibold line-clamp-2">
                      {card.mission}
                    </p>
                  </div>

                  {/* Inspiration */}
                  <div className="space-y-1">
                    <h3 className="text-white/80 text-[0.5rem] uppercase tracking-wider font-bold drop-shadow-lg">
                      Inspiration
                    </h3>
                    <p className="text-white/95 text-xs italic leading-tight drop-shadow-lg font-medium line-clamp-2">
                      "{card.inspiration}"
                    </p>
                  </div>
                </div>
                
                {/* Favorite Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className={`absolute top-2 right-2 w-7 h-7 p-0 rounded-full backdrop-blur-sm transition-all duration-300 z-10 ${
                    isFavorite(username, card.id)
                      ? 'bg-pink-500/80 hover:bg-pink-600/80 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white/70'
                  }`}
                  onClick={handleToggleFavorite}
                >
                  <Star
                    className={`w-3 h-3 ${
                      isFavorite(username, card.id) ? 'fill-current' : ''
                    }`}
                  />
                </Button>
                
                {/* Card Number Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <span className="text-white text-[0.6rem] font-bold">#{card.id}</span>
                </div>

                {/* Click to flip hint */}
                {!isFlipped && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <p className="text-white text-[0.6rem] font-bold">✨ Click to flip ✨</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Back Face - Card back design */}
          <div className="collection-flip-back">
            <Card
              className="relative overflow-hidden bg-transparent border-2 border-white/20 backdrop-blur-sm cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl"
              onClick={handleCardClick}
            >
              <div className="relative w-full aspect-[2/3]">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/26181beb-d34c-4402-b78d-678a67d83bfb-YLQa6lpN5X6aRBgIQSRl9nVNSjS5OS"
                  alt="PRACTICE Card Back"
                 
                  className="object-cover"
                />
                
                {/* Click to view full hint */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/50"
                  >
                    <p className="text-white font-bold text-xs">✨ Click for details ✨</p>
                  </motion.div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
