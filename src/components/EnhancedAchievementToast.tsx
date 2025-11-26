import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Share2 } from 'lucide-react';
import type { Achievement } from '@/utils/achievementsTracking';
import { markAchievementSeen } from '@/utils/achievementsTracking';
import confetti from 'canvas-confetti';

interface EnhancedAchievementToastProps {
  achievement: Achievement | null;
  username: string;
  onClose: () => void;
}

export function EnhancedAchievementToast({ achievement, username, onClose }: EnhancedAchievementToastProps) {
  useEffect(() => {
    if (achievement) {
      // Trigger confetti burst
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Launch confetti from random positions
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#87CEEB'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#87CEEB'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [achievement]);

  const handleClose = () => {
    if (achievement) {
      markAchievementSeen(username, achievement.id);
    }
    onClose();
  };

  const handleShare = () => {
    if (!achievement) return;
    
    const shareText = `🎉 Just unlocked "${achievement.name}" in PRACTICE! ${achievement.icon}\n\n${achievement.description}\n\n#PRACTICE #VibeOfficial #Achievement`;
    
    // Try native share first
    if (navigator.share) {
      navigator.share({
        title: 'Achievement Unlocked!',
        text: shareText,
      }).catch(() => {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(shareText);
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <AnimatePresence>
      {achievement && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
            onClick={handleClose}
          />

          {/* Achievement Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto">
            <Card className={`bg-gradient-to-br ${achievement.color} border-4 border-white/30 shadow-2xl overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <CardHeader className="relative z-10 pb-2">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon with glow effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-7xl filter drop-shadow-2xl"
                  >
                    {achievement.icon}
                  </motion.div>

                  <div>
                    <p className="text-sm font-bold text-white/90 uppercase tracking-wider mb-1">
                      Achievement Unlocked!
                    </p>
                    <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">
                      {achievement.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <p className="text-center text-white/95 text-lg leading-relaxed">
                  {achievement.description}
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={handleClose}
                    className="flex-1 bg-white text-purple-900 hover:bg-white/90 font-bold"
                  >
                    Awesome! ✨
                  </Button>
                </div>

                {/* Sparkle decoration */}
                <div className="absolute -top-6 -right-6 text-6xl opacity-30 animate-spin-slow">
                  ✨
                </div>
                <div className="absolute -bottom-6 -left-6 text-6xl opacity-30 animate-spin-slow">
                  ⭐
                </div>
              </CardContent>
            </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
