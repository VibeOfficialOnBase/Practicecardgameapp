import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

const affirmations = [
  "Every attempt makes you stronger 💪",
  "You're learning and growing! 🌱",
  "Progress, not perfection ✨",
  "Your resilience is inspiring! 🌟",
  "Each game is a step forward 🚀",
  "You've got this! Keep shining ⭐",
  "Believe in your journey 🦋",
  "You're doing amazing! 💫",
  "Small steps lead to big wins 🎯",
  "Your effort matters! 💝",
  "Keep going, you're incredible! 🌈",
  "Every challenge shapes you 🔥",
  "You're braver than you think 💜",
  "Rest, reflect, and rise again 🌅",
  "Your spirit is unbreakable! ⚡"
];

export default function AffirmingMessage({ onContinue }) {
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-xl flex items-center justify-center z-50 p-4"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Heart className="w-20 h-20 text-pink-400 mx-auto mb-4 fill-pink-400" />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-6"
        >
          {randomAffirmation}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-purple-200 mb-8"
        >
          Remember: This is a journey of growth, not a test. You're exactly where you need to be.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
        >
          Continue with Love ✨
        </motion.button>
      </div>
    </motion.div>
  );
}