import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';

export default function BreathingExercise({ onComplete, duration = 12 }) {
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [cyclesRemaining, setCyclesRemaining] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          if (phase === 'inhale') {
            setPhase('hold1');
            return 4;
          } else if (phase === 'hold1') {
            setPhase('exhale');
            return 4;
          } else if (phase === 'exhale') {
            setPhase('hold2');
            return 4;
          } else {
            setCyclesRemaining(prev => {
              if (prev <= 1) {
                if (onComplete) onComplete();
                return 0;
              }
              setPhase('inhale');
              return prev - 1;
            });
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  const phaseText = {
    inhale: 'Breathe In',
    hold1: 'Hold',
    exhale: 'Breathe Out',
    hold2: 'Hold'
  };

  const phaseColor = {
    inhale: 'from-blue-400 to-cyan-400',
    hold1: 'from-purple-400 to-indigo-400',
    exhale: 'from-green-400 to-emerald-400',
    hold2: 'from-purple-400 to-indigo-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <Wind className="w-16 h-16 text-white mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Take a Moment</h2>
        <p className="text-lg text-purple-300 mb-12">Let's breathe together</p>

        <motion.div
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${phaseColor[phase]} mx-auto mb-8 flex items-center justify-center`}
          animate={{
            scale: phase === 'inhale' ? [1, 1.3] : phase === 'exhale' ? [1.3, 1] : 1
          }}
          transition={{ duration: count }}
        >
          <div className="text-center">
            <p className="text-6xl font-bold text-white mb-2">{count}</p>
            <p className="text-xl text-white font-semibold">{phaseText[phase]}</p>
          </div>
        </motion.div>

        <p className="text-sm text-purple-300">
          {cyclesRemaining} more {cyclesRemaining === 1 ? 'cycle' : 'cycles'}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="mt-8 px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
        >
          Skip
        </motion.button>
      </motion.div>
    </motion.div>
  );
}