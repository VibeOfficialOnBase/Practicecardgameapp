import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Palette, User } from 'lucide-react';

const iconMap = {
  game_mode: Trophy,
  theme: Palette,
  avatar: User,
  cosmetic: Sparkles
};

export default function UnlockNotification({ unlocks, onClose }) {
  if (!unlocks || unlocks.length === 0) return null;

  return (
    <AnimatePresence>
      {unlocks.map((unlock, index) => {
        const Icon = iconMap[unlock.content_type] || Sparkles;
        
        return (
          <motion.div
            key={unlock.content_id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ delay: index * 0.3, type: 'spring' }}
            className="fixed right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-2xl border-2 border-white/30 z-50 max-w-sm"
            style={{ top: `${100 + index * 120}px` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-lg mb-1">🎉 Unlocked!</p>
                <p className="text-sm font-semibold">{unlock.content_name}</p>
                <p className="text-xs opacity-80 mt-1">{unlock.unlock_requirement}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}