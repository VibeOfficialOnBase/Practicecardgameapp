import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function FlippableCard({ frontContent, backContent }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <button
        onClick={() => setIsFlipped(!isFlipped)}
        className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <RotateCcw className="w-5 h-5 text-stone-600" />
      </button>

      <div className="relative h-[500px]" style={{ perspective: '1000px' }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {frontContent}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {backContent}
          </div>
        </motion.div>
      </div>
    </div>
  );
}