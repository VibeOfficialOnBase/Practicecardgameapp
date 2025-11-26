import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpToastProps {
  level: number | null;
  onClose: () => void;
}

export function LevelUpToast({ level, onClose }: LevelUpToastProps) {
  useEffect(() => {
    if (level) {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
      });

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [level, onClose]);

  return (
    <AnimatePresence>
      {level && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 w-80 sm:w-96"
        >
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-1 rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-6 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-4"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                    Level Up!
                    <Star className="w-6 h-6 text-yellow-400" />
                  </h3>
                  <p className="text-white/90 text-lg mb-2">
                    You've reached <span className="font-bold text-yellow-400">Level {level}</span>!
                  </p>
                  <p className="text-white/70 text-sm">
                    Keep practicing to unlock more achievements! 🚀
                  </p>
                </motion.div>
              </div>

              {/* Sparkles */}
              <div className="absolute top-4 left-4">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                  className="text-yellow-400 text-2xl"
                >
                  ✨
                </motion.div>
              </div>
              <div className="absolute bottom-4 right-4">
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    delay: 1
                  }}
                  className="text-pink-400 text-2xl"
                >
                  ✨
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
