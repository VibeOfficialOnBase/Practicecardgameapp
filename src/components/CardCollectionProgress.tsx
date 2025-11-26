import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Book, Sparkles } from 'lucide-react';
import { getUserPulls } from '@/utils/pullTracking';
import { practiceCards, rarityConfig, type CardRarity } from '@/data/cardsWithRarity';

interface CardCollectionProgressProps {
  username: string;
}

export function CardCollectionProgress({ username }: CardCollectionProgressProps) {
  const collectionStats = useMemo(() => {
    const pulls = getUserPulls(username);
    const uniqueCardIds = new Set(pulls.map(p => p.cardId));
    
    // Count cards by rarity
    const rarityCount: Record<CardRarity, { collected: number; total: number }> = {
      common: { collected: 0, total: 0 },
      uncommon: { collected: 0, total: 0 },
      rare: { collected: 0, total: 0 },
      epic: { collected: 0, total: 0 },
      legendary: { collected: 0, total: 0 },
    };
    
    // Count total cards per rarity
    practiceCards.forEach(card => {
      rarityCount[card.rarity].total++;
      if (uniqueCardIds.has(card.id)) {
        rarityCount[card.rarity].collected++;
      }
    });
    
    return {
      totalCollected: uniqueCardIds.size,
      totalCards: practiceCards.length,
      percentage: (uniqueCardIds.size / practiceCards.length) * 100,
      rarityCount,
    };
  }, [username]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card glass-card-glow border-indigo-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold gradient-text flex items-center gap-2">
            <Book className="w-5 h-5 text-indigo-400" />
            Card Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">
                {collectionStats.totalCollected} / {collectionStats.totalCards} Cards
              </span>
              <span className="text-indigo-300 font-bold">
                {collectionStats.percentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={collectionStats.percentage} className="h-3 bg-white/10" />
          </div>

          {/* Rarity breakdown */}
          <div className="space-y-2">
            <h4 className="text-white/80 text-sm font-semibold mb-2">By Rarity:</h4>
            {(Object.keys(rarityConfig) as CardRarity[]).map(rarity => {
              const config = rarityConfig[rarity];
              const stats = collectionStats.rarityCount[rarity];
              const percentage = stats.total > 0 ? (stats.collected / stats.total) * 100 : 0;
              
              return (
                <motion.div
                  key={rarity}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-3 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: config.color }} />
                      <span 
                        className="font-semibold text-sm"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                    </div>
                    <span className="text-white/80 text-sm">
                      {stats.collected} / {stats.total}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-1.5"
                    style={{
                      background: `${config.color}20`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Collection milestone */}
          {collectionStats.percentage === 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-lg p-3 text-center"
            >
              <p className="text-yellow-300 font-bold text-sm">
                🎉 Collection Complete! You've collected all cards!
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
