import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

import confetti from 'canvas-confetti';

interface EnhancedCardRevealProps {
  onReveal: () => void;
  isRevealing: boolean;
}

export function EnhancedCardReveal({ onReveal, isRevealing }: EnhancedCardRevealProps) {
  const [stage, setStage] = useState<'ready' | 'flipping' | 'revealed'>('ready');

  useEffect(() => {
    if (isRevealing && stage === 'ready') {
      // Start the reveal sequence
      setStage('flipping');
      
      // Trigger confetti bursts during flip
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34D399', '#60A5FA', '#A78BFA', '#EC4899', '#FBBF24'],
        });
      }, 200);
      
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399'],
          startVelocity: 45,
        });
      }, 400);
      
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x: 0.3, y: 0.6 },
          colors: ['#FBBF24', '#F472B6', '#C084FC'],
        });
        
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x: 0.7, y: 0.6 },
          colors: ['#34D399', '#60A5FA', '#A78BFA'],
        });
      }, 600);
      
      setTimeout(() => {
        setStage('revealed');
      }, 800);
    }
  }, [isRevealing, stage]);

  return (
    <AnimatePresence mode="wait">
      {stage === 'ready' && (
        <motion.div
          key="ready"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.4 }}
          className="relative cursor-pointer"
          onClick={onReveal}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-transparent hover:scale-105 transition-all duration-300">
            <div className="relative w-full aspect-[2/3]">
              <img
                src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/26181beb-d34c-4402-b78d-678a67d83bfb-YLQa6lpN5X6aRBgIQSRl9nVNSjS5OS"
                alt="PRACTICE Card Back"
               
                className="object-cover"
               
              />
              
              {/* Pulsing glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-pulse" />
              
              {/* Click to reveal prompt */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-black/70 backdrop-blur-md px-8 py-4 rounded-full border-2 border-white/60 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
                    <p className="text-white font-bold text-xl">Tap to Reveal</p>
                    <Sparkles className="w-6 h-6 text-pink-300 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {stage === 'flipping' && (
        <motion.div
          key="flipping"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-transparent">
            <div className="relative w-full aspect-[2/3]">
              <img
                src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/26181beb-d34c-4402-b78d-678a67d83bfb-YLQa6lpN5X6aRBgIQSRl9nVNSjS5OS"
                alt="PRACTICE Card"
               
                className="object-cover"
               
              />
              {/* Shimmer effect during flip */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 0.8, ease: "linear" }}
              />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
