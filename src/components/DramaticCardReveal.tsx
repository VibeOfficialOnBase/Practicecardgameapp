import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

import confetti from 'canvas-confetti';

interface DramaticCardRevealProps {
  onRevealComplete: () => void;
  cardImageUrl: string;
}

export function DramaticCardReveal({ onRevealComplete, cardImageUrl }: DramaticCardRevealProps) {
  const [stage, setStage] = useState<'countdown' | 'flip' | 'burst' | 'revealed'>('countdown');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown: 3... 2... 1...
    if (stage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      // Start flip animation
      setTimeout(() => {
        setStage('flip');
        
        // Multiple confetti bursts during flip
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
        }, 500);
        
        setTimeout(() => {
          // Side confetti bursts
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
        }, 700);
        
        // Final burst
        setTimeout(() => {
          setStage('burst');
          confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
            startVelocity: 55,
            gravity: 1,
            scalar: 1.2,
          });
        }, 1000);
        
        // Complete reveal
        setTimeout(() => {
          setStage('revealed');
          onRevealComplete();
        }, 1500);
      }, 400);
    }
  }, [stage, countdown, onRevealComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
      <AnimatePresence mode="wait">
        {/* Countdown */}
        {stage === 'countdown' && countdown > 0 && (
          <motion.div
            key="countdown"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
            >
              {countdown}
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-white text-2xl mt-4 font-semibold"
            >
              Preparing your magic...
            </motion.div>
          </motion.div>
        )}
        
        {/* Flip Animation */}
        {stage === 'flip' && (
          <motion.div
            key="flip"
            initial={{ rotateY: 0, scale: 1 }}
            animate={{ 
              rotateY: 180, 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: 1000
            }}
            className="relative w-full max-w-md px-4"
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-transparent">
              <div className="relative w-full aspect-[2/3]">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/26181beb-d34c-4402-b78d-678a67d83bfb-YLQa6lpN5X6aRBgIQSRl9nVNSjS5OS"
                  alt="PRACTICE Card"
                 
                  className="object-cover"
                 
                />
                {/* Shimmer sweep */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
            </Card>
          </motion.div>
        )}
        
        {/* Burst Effect */}
        {stage === 'burst' && (
          <motion.div
            key="burst"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md px-4"
          >
            {/* Radial glow burst */}
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{
                scale: [1, 2, 1.5],
                opacity: [0.8, 0, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blur-3xl" />
            </motion.div>
            
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-transparent">
              <div className="relative w-full aspect-[2/3]">
                <img
                  src={cardImageUrl}
                  alt="PRACTICE Card Revealed"
                 
                  className="object-cover"
                 
                />
                {/* Sparkle particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.02,
                    }}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
