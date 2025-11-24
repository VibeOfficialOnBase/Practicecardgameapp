import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, Leaf, Zap, Trophy, Award, Star, Flame, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';

const iconMap = {
  Heart, Users, Leaf, Zap, Trophy, Award, Star, Flame, Sparkles
};

const categoryColors = {
  Love: 'from-rose-400 to-pink-500',
  Empathy: 'from-blue-400 to-indigo-500',
  Community: 'from-purple-400 to-violet-500',
  Healing: 'from-emerald-400 to-green-500',
  Empowerment: 'from-amber-400 to-orange-500'
};

export default function AchievementUnlock({ achievement, onClose }) {
  const { play } = useSound();
  const { trigger } = useHaptic();

  useEffect(() => {
    play('achievement-unlock');
    trigger('celebration');
  }, [play, trigger]);

  if (!achievement) return null;

  const Icon = iconMap[achievement.icon] || Star;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", duration: 0.7 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative rounded-3xl bg-gradient-to-br ${categoryColors[achievement.category]} p-8 shadow-2xl max-w-md w-full`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="text-center text-white mb-6">
            <p className="text-sm font-medium opacity-90 mb-2">Achievement Unlocked!</p>
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-6"
            >
              <div className="inline-block p-6 rounded-full bg-white/20 backdrop-blur">
                <Icon className="w-20 h-20" fill="white" />
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold mb-3">{achievement.title}</h2>
            <p className="text-lg opacity-90 mb-4">{achievement.description}</p>
            <p className="text-sm italic opacity-80">"{achievement.unlockedMessage}"</p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-xl backdrop-blur border-2 border-white/30"
          >
            Continue
          </Button>

          {/* Confetti */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: '-10%'
                }}
                animate={{
                  y: ['0vh', '120vh'],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 360],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}