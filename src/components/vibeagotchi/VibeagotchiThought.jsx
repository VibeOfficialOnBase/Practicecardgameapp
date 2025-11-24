import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function VibeagotchiThought({ thought }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (thought) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [thought]);

  return (
    <AnimatePresence>
      {isVisible && thought && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4"
        >
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border-2 border-purple-300 max-w-xs">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-gray-800 leading-relaxed italic">
                "{thought}"
              </p>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/95" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}