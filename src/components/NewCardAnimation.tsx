import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PracticeCard } from '@/data/cardsWithRarity';
import { rarityConfig } from '@/data/cardsWithRarity';
import { Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewCardAnimationProps {
  card: PracticeCard | null;
  onComplete: () => void;
}

export function NewCardAnimation({ card, onComplete }: NewCardAnimationProps) {
  const [show, setShow] = useState(!!card);

  useEffect(() => {
    if (card) {
      setShow(true);
      
      // Trigger confetti based on rarity
      const config = rarityConfig[card.rarity];
      const particleCount = card.rarity === 'legendary' ? 200 : card.rarity === 'epic' ? 150 : 100;
      
      confetti({
        particleCount,
        spread: 100,
        origin: { y: 0.5 },
        colors: [config.color],
      });

      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [card, onComplete]);

  if (!card) return null;

  const config = rarityConfig[card.rarity];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => {
            setShow(false);
            setTimeout(onComplete, 300);
          }}
        >
          <motion.div
            initial={{ scale: 0.5, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative"
            style={{
              filter: `drop-shadow(0 0 30px ${config.glow})`,
            }}
          >
            {/* Animated background glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl blur-3xl"
              style={{ background: config.glow }}
            />
            
            {/* Card container */}
            <div className="relative bg-white/10 backdrop-blur-md border-4 rounded-3xl p-8 max-w-md"
              style={{ borderColor: config.color }}
            >
              {/* New card header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-8 h-8 animate-spin" style={{ color: config.color, animationDuration: '3s' }} />
                  <h2 className="text-3xl font-bold text-white">NEW CARD!</h2>
                  <Star className="w-8 h-8 animate-spin" style={{ color: config.color, animationDuration: '3s', animationDirection: 'reverse' }} />
                </div>
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg"
                  style={{
                    backgroundColor: `${config.color}30`,
                    color: config.color,
                    border: `2px solid ${config.color}`,
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  {config.label} Rarity
                </div>
              </motion.div>

              {/* Card details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-white text-lg font-semibold mb-4">{card.affirmation}</p>
                <p className="text-white/80 text-sm">
                  You've unlocked this {config.label.toLowerCase()} card! It's now in your collection.
                </p>
              </motion.div>

              {/* Tap to continue */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white/60 text-sm text-center mt-6"
              >
                Tap anywhere to continue
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
