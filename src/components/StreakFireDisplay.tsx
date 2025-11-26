import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakFireDisplayProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  animate?: boolean;
}

export function StreakFireDisplay({ 
  streak, 
  size = 'md', 
  showNumber = true,
  animate = true 
}: StreakFireDisplayProps) {
  // Determine fire intensity based on streak
  const getFireColor = () => {
    if (streak >= 100) return 'text-purple-500';
    if (streak >= 30) return 'text-blue-500';
    if (streak >= 7) return 'text-orange-500';
    return 'text-yellow-500';
  };

  const getGlowColor = () => {
    if (streak >= 100) return 'drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]';
    if (streak >= 30) return 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]';
    if (streak >= 7) return 'drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]';
    return 'drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]';
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-5 h-5';
      case 'lg': return 'w-10 h-10';
      default: return 'w-7 h-7';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  // Multiple flame count based on milestone
  const getFlameCount = () => {
    if (streak >= 100) return 3;
    if (streak >= 30) return 2;
    return 1;
  };

  const flameCount = getFlameCount();

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        {[...Array(flameCount)].map((_, index) => (
          <motion.div
            key={index}
            className={`${index > 0 ? '-ml-2' : ''} relative`}
            animate={animate ? {
              y: [0, -3, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          >
            <Flame 
              className={`${getSize()} ${getFireColor()} ${getGlowColor()}-current`}
              style={{ 
                filter: animate ? `brightness(${1 + Math.sin(Date.now() / 500 + index) * 0.3})` : undefined
              }}
            />
          </motion.div>
        ))}
        
        {/* Particle effects for high streaks */}
        {streak >= 30 && animate && (
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          >
            <div className={`w-full h-full rounded-full ${streak >= 100 ? 'bg-purple-500' : 'bg-orange-500'} blur-xl opacity-50`} />
          </motion.div>
        )}
      </div>
      
      {showNumber && (
        <motion.span 
          className={`${getTextSize()} font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent`}
          animate={animate ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {streak}
        </motion.span>
      )}
      
      {/* Milestone badges */}
      {streak >= 7 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
        >
          {streak >= 100 ? '💯 LEGEND' : streak >= 30 ? '🌟 WARRIOR' : '🔥 WEEK'}
        </motion.span>
      )}
    </div>
  );
}
