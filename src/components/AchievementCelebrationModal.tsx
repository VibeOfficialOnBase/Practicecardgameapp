import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import type { Achievement } from '@/utils/achievementsTracking';

interface AchievementCelebrationModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementCelebrationModal({ achievement, onClose }: AchievementCelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (achievement) {
      setShowConfetti(true);
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Confetti */}
        {showConfetti && (
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
            colors={['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#00CED1']}
          />
        )}

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.8, rotateY: -90, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.8, rotateY: 90, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.6,
          }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-md w-full"
        >
          <div className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 rounded-3xl border-4 border-yellow-400/50 shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Animated background rays */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-full h-full"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-t from-transparent via-yellow-300/50 to-transparent origin-bottom"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  />
                ))}
              </motion.div>
            </div>

            <div className="relative z-10 p-8 text-center space-y-6">
              {/* Trophy Icon with Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  delay: 0.2,
                }}
                className="flex justify-center"
              >
                <div className="relative">
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
                    className="text-8xl"
                  >
                    {achievement.icon}
                  </motion.div>
                  
                  {/* Sparkles around trophy */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeInOut',
                      }}
                      className="absolute text-yellow-300"
                      style={{
                        top: `${20 + Math.cos((i * Math.PI) / 3) * 60}px`,
                        left: `${20 + Math.sin((i * Math.PI) / 3) * 60}px`,
                      }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Achievement Unlocked Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <p className="text-yellow-300 text-xl font-bold uppercase tracking-wider">
                  🎉 Achievement Unlocked! 🎉
                </p>
                
                <h2 className="text-white text-3xl font-bold">
                  {achievement.name}
                </h2>
                
                <p className="text-white/80 text-lg leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>

              {/* Badge Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400/50"
              >
                <Star className="w-5 h-5 text-yellow-400-yellow-400" />
                <span className="text-white font-bold text-sm uppercase tracking-wider">
                  Achievement Unlocked
                </span>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">XP Earned:</span>
                  <span className="text-green-400 font-bold text-lg">+50 XP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Unlocked:</span>
                  <span className="text-white font-semibold text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-3 pt-4"
              >
                <Button
                  onClick={onClose}
                  variant="gradient"
                  size="lg"
                  className="w-full text-lg"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Keep Going!
                </Button>
                
                <Button
                  onClick={() => {
                    // Share functionality ready for future enhancement
                    onClose();
                  }}
                  variant="outline"
                  className="w-full glass-card border-2 text-white hover:glass-card-hover"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Share Achievement
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
