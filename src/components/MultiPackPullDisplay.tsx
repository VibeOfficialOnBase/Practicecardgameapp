import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

import type { VibeCheckPack } from '@/data/vibeCheckPacks';
import { allCards } from '@/data/cardsWithRarity';
import { PackBadge } from './PackBadge';
import { CardDisplay } from './CardDisplay';

interface MultiPackPullDisplayProps {
  claimedPacks: VibeCheckPack[];
  pulledCards: Record<string, number | null>; // packId -> cardId
  canPullFromPack: Record<string, boolean>; // packId -> canPull
  onPullCard: (packId: string) => void;
  checkingToken: boolean;
  username: string;
  streakDay: number;
  onShare: (card: typeof allCards[0]) => void;
  onJournalSave: (wordCount: number) => void;
}

export function MultiPackPullDisplay({
  claimedPacks,
  pulledCards,
  canPullFromPack,
  onPullCard,
  checkingToken,
  username,
  streakDay,
  onShare,
  onJournalSave,
}: MultiPackPullDisplayProps) {
  // Get card objects from card IDs
  const getCardForPack = (packId: string) => {
    const cardId = pulledCards[packId];
    if (!cardId) return null;
    return allCards.find(c => c.id === cardId) || null;
  };

  // Determine if pack is exclusive (golden styling)
  const isExclusivePack = (pack: VibeCheckPack) => pack.requiredVibeBalance > 0;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header explaining the multi-pack system */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {claimedPacks.length === 1 
            ? 'Your Available Pack 🎴'
            : 'Your Available Packs 🎴🎴'
          }
        </h2>
        <p className="text-white/70 text-sm">
          {claimedPacks.length === 1
            ? 'Pull one unique card from your deck daily'
            : `Pull one unique card from each of your ${claimedPacks.length} packs daily`
          }
        </p>
      </motion.div>

      {/* Grid of pack cards */}
      <div className={`grid gap-12 sm:gap-8 md:gap-10 ${claimedPacks.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
        {claimedPacks.map((pack, index) => {
          const card = getCardForPack(pack.id);
          const canPull = canPullFromPack[pack.id] ?? true;
          const isExclusive = isExclusivePack(pack);

          return (
            <motion.div
              key={pack.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="w-full pb-4 sm:pb-0"
            >
              {/* Pack Header */}
              <div className="mb-4 text-center">
                <PackBadge
                  packName={pack.name}
                  emoji={pack.emoji}
                  isExclusive={isExclusive}
                  cardNumber={card?.id}
                  totalCards={pack.cardCount}
                />
              </div>

              {/* Card Display or Pull Button */}
              {card ? (
                // Show pulled card
                <div className={`${isExclusive ? 'relative' : ''}`}>
                  {isExclusive && (
                    /* Optimized golden glow effect - single layer */
                    <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/25 via-orange-500/25 to-yellow-400/25 rounded-3xl blur-lg animate-pulse" />
                  )}
                  <div className="relative">
                    <CardDisplay
                      card={card}
                      onShare={() => onShare(card)}
                      username={username}
                      streakDay={streakDay}
                      onJournalSave={onJournalSave}
                    />
                  </div>
                </div>
              ) : (
                // Show card back with pull button
                <div className="relative w-full aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden">
                  {/* Card Back Image */}
                  <img
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/26181beb-d34c-4402-b78d-678a67d83bfb-YLQa6lpN5X6aRBgIQSRl9nVNSjS5OS"
                    alt={`${pack.name} Card Back`}
                   
                    className="object-cover"
                  />

                  {/* Pack Logo/Emoji */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl">
                      <span className="text-4xl">{pack.emoji}</span>
                    </div>
                  </div>

                  {/* Optimized golden glow for Vibe Check pack */}
                  {isExclusive && (
                    <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/25 via-orange-500/25 to-yellow-400/25 rounded-3xl blur-lg animate-pulse" />
                  )}

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/20">
                    <Sparkles className={`w-12 h-12 mb-4 drop-shadow-lg ${isExclusive ? 'text-yellow-300' : 'text-white'}`} />
                    <h3 className={`text-2xl font-bold mb-2 drop-shadow-lg ${isExclusive ? 'text-yellow-300' : 'text-white'}`}>
                      {pack.name}
                    </h3>
                    <p className={`text-sm mb-6 drop-shadow-lg font-semibold ${isExclusive ? 'text-yellow-100/90' : 'text-white/90'}`}>
                      Pull your daily card from this {isExclusive ? 'exclusive' : ''} pack
                    </p>
                    <Button
                      onClick={() => onPullCard(pack.id)}
                      disabled={!canPull || checkingToken}
                      variant={isExclusive ? "default" : "gradient"}
                      size="lg"
                      className={`shadow-2xl animate-smooth-pulse disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none ${
                        isExclusive ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold' : ''
                      }`}
                    >
                      {checkingToken
                        ? 'Checking...'
                        : !canPull
                        ? 'Come Back Tomorrow'
                        : isExclusive
                        ? `👑 Pull ${pack.name} Card`
                        : `✨ Pull ${pack.name} Card`}
                    </Button>
                    {!canPull && (
                      <p className={`text-sm mt-4 drop-shadow-lg font-semibold ${isExclusive ? 'text-yellow-100/80' : 'text-white/80'}`}>
                        You've already pulled from {pack.name} today!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Helper text */}
      {claimedPacks.length > 1 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-center text-white/60 text-sm ${
            Object.values(pulledCards).some(cardId => cardId !== null)
              ? 'mt-12 md:mt-8' // Extra spacing on mobile when cards are flipped
              : 'mt-8'
          }`}
        >
          You can pull one card from each pack every day. Keep your streak going across all your packs!
        </motion.p>
      )}
    </div>
  );
}
