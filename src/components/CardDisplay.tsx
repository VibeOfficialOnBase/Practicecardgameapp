import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Star, Copy, Check, BookOpen } from 'lucide-react';
import type { PracticeCard } from '@/data/cardsWithRarity';
import { CardRarityBadge } from '@/components/CardRarityBadge';

import { isFavorite, toggleFavorite } from '@/utils/favoritesTracking';
import JournalModal from '@/components/JournalModal';
import { FloatingLightParticles } from '@/components/FloatingLightParticles';
import { CardExpansionModal } from '@/components/CardExpansionModal';
import { cardExpansions } from '@/data/cardExpansions';
import { GoDeeperModal } from '@/components/GoDeeperModal';
import confetti from 'canvas-confetti';
import { CARD_RANGES, isCardInRange } from '@/data/index';

interface CardDisplayProps {
  card: PracticeCard;
  onShare: () => void;
  username: string;
  streakDay?: number;
  onJournalSave?: (wordCount: number) => void;
}

/**
 * Memoized CardDisplay component to prevent unnecessary re-renders
 * Only re-renders when card, username, or streakDay changes
 */
export const CardDisplay = memo(function CardDisplay({ card, onShare, username, streakDay = 1, onJournalSave }: CardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [isExpansionOpen, setIsExpansionOpen] = useState(false);
  const [isGoDeeperOpen, setIsGoDeeperOpen] = useState(false);
  
  // Find expansion content for this card
  const expansion = cardExpansions.find(exp => exp.cardId === card.id) || null;
  
  // Check if this is a Vibe Check exclusive card using constants
  const isVibeCheckCard = isCardInRange(card.id, CARD_RANGES.VIBE_CHECK);
  
  useEffect(() => {
    setIsFav(isFavorite(username, card.id));
  }, [username, card.id]);
  
  const handleToggleFavorite = () => {
    const newFavStatus = toggleFavorite(username, card.id);
    setIsFav(newFavStatus);
  };
  
  const handleCopyToClipboard = async () => {
    const text = `${card.affirmation}\n\nMission: ${card.mission}\n\nInspiration: "${card.inspiration}"`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          
          @keyframes glow-pulse {
            0%, 100% {
              box-shadow: 0 0 20px rgba(168, 85, 247, 0.5),
                          0 0 40px rgba(236, 72, 153, 0.3),
                          0 0 60px rgba(147, 51, 234, 0.2);
            }
            50% {
              box-shadow: 0 0 30px rgba(168, 85, 247, 0.8),
                          0 0 60px rgba(236, 72, 153, 0.6),
                          0 0 90px rgba(147, 51, 234, 0.4);
            }
          }
          
          @keyframes radial-glow {
            0% {
              box-shadow: 0 0 40px rgba(168, 85, 247, 0.8),
                          0 0 80px rgba(236, 72, 153, 0.6),
                          0 0 120px rgba(147, 51, 234, 0.4),
                          inset 0 0 60px rgba(168, 85, 247, 0.3);
            }
            100% {
              box-shadow: 0 0 20px rgba(168, 85, 247, 0.4),
                          0 0 40px rgba(236, 72, 153, 0.3),
                          0 0 60px rgba(147, 51, 234, 0.2),
                          inset 0 0 30px rgba(168, 85, 247, 0.1);
            }
          }
          
          .shimmer-effect {
            animation: shimmer 3s infinite linear;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 1000px 100%;
          }
          
          .card-glow {
            animation: glow-pulse 3s ease-in-out infinite;
          }
          
          .card-reveal-glow {
            animation: radial-glow 1s ease-out;
          }

          .flip-card {
            perspective: 1000px;
          }

          .flip-card-inner {
            position: relative;
            width: 100%;
            min-height: 600px;
            transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform-style: preserve-3d;
          }

          .flip-card-inner.flipped {
            transform: rotateY(180deg);
          }

          .flip-card-front,
          .flip-card-back {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          .flip-card-back {
            transform: rotateY(180deg);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            min-height: 100%;
          }
        `
      }} />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="flip-card w-full relative z-20"
      >
        <div 
          className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}
          onClick={() => {
            if (!isFlipped) {
              setIsFlipped(true);
              setShowParticles(true);
              setShowGlow(true);
              
              // Trigger confetti on card reveal
              setTimeout(() => {
                confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.5 },
                  colors: ['#34D399', '#60A5FA', '#A78BFA', '#EC4899', '#FBBF24'],
                  startVelocity: 35,
                  gravity: 0.8,
                });
              }, 400);
              
              setTimeout(() => {
                setShowParticles(false);
                setShowGlow(false);
              }, 3000);
            }
          }}
        >
          {/* Card Back (shown first) */}
          <div className="flip-card-front">
            <Card className={`relative overflow-hidden border-0 shadow-2xl bg-transparent card-glow ${!isFlipped ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}`}>
              <div className="relative w-full aspect-[2/3]">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/26181beb-d34c-4402-b78d-678a67d83bfb-YLQa6lpN5X6aRBgIQSRl9nVNSjS5OS"
                  alt="PRACTICE Card Back"
                 
                  className="object-cover"
                />
                
                {/* Shimmer overlay */}
                <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
                
                {/* Click to reveal text */}
                {!isFlipped && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/50"
                    >
                      <p className="text-white font-bold text-lg">✨ Click to Reveal ✨</p>
                    </motion.div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Card Front (revealed on flip) */}
          <div className="flip-card-back">
            <Card className={`relative overflow-hidden border-0 shadow-2xl bg-transparent ${showGlow ? 'card-reveal-glow' : 'card-glow'}`}>
              {/* Floating Light Particles */}
              <FloatingLightParticles show={showParticles} count={8} />
              <div className="relative w-full aspect-[2/3]">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3c7aff8f-230d-47f2-bcf1-e867252a5833-XsinrK6LfchksIA9GYIBPFTSm2RHNO"
                  alt="PRACTICE Card"
                 
                  className="object-cover"
                />
                
                {/* Shimmer overlay */}
                <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
                
                {/* Rarity Badge at Top */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isFlipped ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-4 right-4 z-10"
                >
                  <CardRarityBadge rarity={card.rarity} size="small" />
                </motion.div>

                {/* Text Overlay with Staggered Animation */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 py-6 space-y-3">
                  {/* Affirmation */}
                  <motion.div 
                    className="space-y-1 max-w-[88%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                  >
                    <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                      Affirmation
                    </h3>
                    <p className="text-white text-sm sm:text-base font-bold leading-tight drop-shadow-lg">
                      {card.affirmation}
                    </p>
                  </motion.div>

                  {/* Mission */}
                  <motion.div 
                    className="space-y-1 max-w-[88%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                  >
                    <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                      Today's Mission
                    </h3>
                    <p className="text-white text-xs sm:text-sm leading-tight drop-shadow-lg font-semibold">
                      {card.mission}
                    </p>
                  </motion.div>

                  {/* Inspiration */}
                  <motion.div 
                    className="space-y-1 max-w-[88%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                  >
                    <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                      Inspiration
                    </h3>
                    <p className="text-white/95 text-xs italic leading-tight drop-shadow-lg font-medium">
                      "{card.inspiration}"
                    </p>
                  </motion.div>
                </div>
                
                {/* VibeOfficial Logo - Bottom Center */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <img
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                    alt="VibeOfficial"
                    width={60}
                    height={60}
                    className="object-contain rounded-full shadow-2xl border-3 border-white/30"
                   
                  />
                </div>
              </div>
            </Card>
            
            {/* Action buttons below the card */}
            {isFlipped && (
              <div className="mt-6 sm:mt-4 space-y-2">
                {/* Go Deeper Button for Vibe Check Cards */}
                {isVibeCheckCard && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGoDeeperOpen(true);
                    }}
                    variant="gradient"
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg"
                  >
                    👑 Go Deeper (Holder Exclusive) 👑
                  </Button>
                )}
                
                {/* Dive Deeper Button */}
                {expansion && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpansionOpen(true);
                    }}
                    variant="gradient"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    🌟 Dive Deeper 🌟
                  </Button>
                )}

                {/* Flip Back Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  variant="gradient"
                  className="w-full"
                >
                  🔄 Flip Back
                </Button>
                
                {/* Action Buttons Row */}
                <div className="flex justify-center gap-2 w-full">
                  {/* Favorite Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite();
                    }}
                    variant="outline"
                    size="icon"
                    className={`border-2 transition-all duration-200 flex-shrink-0 min-w-[48px] min-h-[48px] ${
                      isFav
                        ? 'bg-pink-500/90 border-pink-400 text-white hover:bg-pink-600 shadow-lg glow-epic'
                        : 'glass-card text-white hover:glass-card-hover'
                    }`}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-5 h-5 ${isFav ? 'fill-current animate-pulse' : ''}`} />
                  </Button>
                  
                  {/* Copy Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyToClipboard();
                    }}
                    variant="outline"
                    size="icon"
                    className={`border-2 transition-all duration-200 flex-shrink-0 min-w-[48px] min-h-[48px] ${
                      copied
                        ? 'bg-green-500/90 border-green-400 text-white shadow-lg'
                        : 'glass-card text-white hover:glass-card-hover'
                    }`}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy card text'}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 animate-pulse" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                  
                  {/* Journal Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsJournalOpen(true);
                    }}
                    variant="outline"
                    size="icon"
                    className="glass-card border-2 text-white hover:glass-card-hover hover:border-purple-400 flex-shrink-0 min-w-[48px] min-h-[48px]"
                    aria-label="Open journal"
                  >
                    <BookOpen className="w-5 h-5" />
                  </Button>
                  
                  {/* Share Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare();
                    }}
                    variant="outline"
                    size="icon"
                    className="glass-card border-2 text-white hover:glass-card-hover flex-shrink-0 min-w-[48px] min-h-[48px]"
                    aria-label="Share card"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Full Share Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                  variant="gold"
                  className="w-full"
                >
                  ✨ Share Your Magic ✨
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>


      
      {/* Journal Modal */}
      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        card={card}
        userId={username}
        streakDay={streakDay}
        onSave={(wordCount) => {
          if (onJournalSave) {
            onJournalSave(wordCount);
          }
        }}
      />
      
      {/* Card Expansion Modal */}
      <CardExpansionModal
        open={isExpansionOpen}
        onClose={() => setIsExpansionOpen(false)}
        card={card}
        expansion={expansion}
      />
      
      {/* Go Deeper Modal */}
      <GoDeeperModal
        isOpen={isGoDeeperOpen}
        onClose={() => setIsGoDeeperOpen(false)}
        card={card}
        username={username}
        onJournalSave={onJournalSave}
      />
    </div>
  );
});
