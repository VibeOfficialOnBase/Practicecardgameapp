import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentCombo, getComboBonus } from '@/utils/streakBonuses';
import { Zap } from 'lucide-react';

interface ComboTrackerProps {
  userId: string;
}

export default function ComboTracker({ userId }: ComboTrackerProps) {
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  useEffect(() => {
    const checkCombo = () => {
      const current = getCurrentCombo(userId);
      setCombo(current);
      setShowCombo(current >= 2);
    };

    checkCombo();
    const interval = setInterval(checkCombo, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  if (!showCombo) return null;

  const bonusXP = getComboBonus(combo);

  return (
    <AnimatePresence>
      {showCombo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-20 right-4 sm:right-8 z-50"
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl"
            />
            
            {/* Main combo display */}
            <div className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-4 shadow-2xl border-2 border-yellow-300">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-8 h-8 text-white-current" />
                </motion.div>
                
                <div>
                  <motion.p
                    key={combo}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-white font-bold text-3xl"
                  >
                    {combo}x
                  </motion.p>
                  <p className="text-yellow-100 text-xs font-semibold uppercase tracking-wide">
                    Combo
                  </p>
                </div>

                <div className="border-l-2 border-white/30 pl-3">
                  <p className="text-white font-bold text-lg">+{bonusXP}</p>
                  <p className="text-yellow-100 text-xs">Bonus XP</p>
                </div>
              </div>

              {/* Particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 100,
                    y: -50 + (Math.random() * 30),
                    opacity: 0
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>

            {/* Action reminder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-center"
            >
              <p className="text-white text-xs bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                Keep going! 5 min left
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
