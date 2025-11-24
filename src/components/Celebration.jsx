import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Award, Star, PartyPopper } from 'lucide-react';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';

export default function Celebration({ milestone, onComplete }) {
  const { play } = useSound();
  const { trigger } = useHaptic();

  useEffect(() => {
    if (milestone) {
      play('streak-milestone');
      if (milestone === 'yearly' || milestone === 'century') {
        trigger('milestone');
      } else {
        trigger('celebration');
      }
    }

    if (milestone && milestone !== 'daily') {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    } else if (milestone === 'daily') {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [milestone, onComplete]);

  const celebrationConfig = {
    daily: {
      icon: Sparkles,
      title: '+1 Day!',
      message: 'Practice complete',
      color: 'from-green-400 to-emerald-500',
      confetti: 20
    },
    weekly: {
      icon: Award,
      title: 'Week of Practice!',
      message: '7 days of consistent growth',
      color: 'from-blue-400 to-indigo-500',
      confetti: 50
    },
    monthly: {
      icon: Trophy,
      title: 'Month of Growth!',
      message: '30 days of transformation',
      color: 'from-purple-400 to-pink-500',
      confetti: 100
    },
    century: {
      icon: Star,
      title: 'Century Club!',
      message: '100 days of dedication',
      color: 'from-yellow-400 to-orange-500',
      confetti: 150
    },
    yearly: {
      icon: PartyPopper,
      title: 'Year of Mastery!',
      message: '365 days of commitment',
      color: 'from-rose-400 to-red-500',
      confetti: 200
    }
  };

  const config = celebrationConfig[milestone];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onComplete}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", duration: 0.8 }}
          className={`relative rounded-3xl bg-gradient-to-br ${config.color} p-12 shadow-2xl max-w-md mx-4`}
        >
          <div className="text-center text-white">
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-24 h-24 mx-auto mb-6" fill="white" />
            </motion.div>

            <h2 className="text-4xl font-bold mb-3">{config.title}</h2>
            <p className="text-xl opacity-90">{config.message}</p>
          </div>

          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(config.confetti)].map((_, i) => (
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