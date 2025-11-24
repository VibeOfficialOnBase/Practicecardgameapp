import React from 'react';
import { motion } from 'framer-motion';

export default function CardShuffleLoader({ text = 'Shuffling your practice cards...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-48 h-64 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-200 shadow-lg"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
            animate={{
              x: [0, -20 + i * 10, 20 - i * 10, 0],
              y: [0, -10, 10, 0],
              rotate: [0, -5 + i * 2, 5 - i * 2, 0],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl"></div>
          </motion.div>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-stone-600 font-medium"
      >
        {text}
      </motion.p>
    </div>
  );
}