import { Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PackBadgeProps {
  packName: string;
  emoji: string;
  isExclusive: boolean;
  cardNumber?: number;
  totalCards?: number;
}

export function PackBadge({ packName, emoji, isExclusive, cardNumber, totalCards }: PackBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-lg border-2 ${
        isExclusive
          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50 text-yellow-100'
          : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 text-purple-100'
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold opacity-80">From:</span>
          <span className="text-sm font-bold">{packName}</span>
          {isExclusive && <Crown className="w-3 h-3 text-yellow-400" />}
        </div>
        {cardNumber && totalCards && (
          <span className="text-xs opacity-70">
            Card #{cardNumber} of {totalCards}
          </span>
        )}
      </div>
    </motion.div>
  );
}
