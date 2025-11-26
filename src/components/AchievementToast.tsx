import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Achievement } from '@/utils/achievementsTracking';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);
  
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`relative overflow-hidden rounded-2xl border-2 border-white/30 backdrop-blur-lg shadow-2xl bg-gradient-to-br ${achievement.color}`}>
            {/* Shine Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
            
            <div className="relative p-6">
              {/* Close Button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
              
              {/* Content */}
              <div className="text-center">
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <div className="inline-block px-3 py-1 mb-2 bg-white/20 rounded-full">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">
                    Achievement Unlocked!
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {achievement.name}
                </h3>
                <p className="text-white/90 text-sm">
                  {achievement.description}
                </p>
              </div>
              
              {/* Sparkles */}
              <div className="absolute top-4 left-4 text-white/50 animate-pulse">✨</div>
              <div className="absolute bottom-4 right-4 text-white/50 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
