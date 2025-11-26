import { motion } from 'framer-motion';
import { rarityConfig, type CardRarity } from '@/data/cardsWithRarity';
import { Sparkles } from 'lucide-react';

interface CardRarityBadgeProps {
  rarity: CardRarity;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function CardRarityBadge({ rarity, size = 'medium', showLabel = true }: CardRarityBadgeProps) {
  const config = rarityConfig[rarity];
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold shadow-lg ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${config.color}20`,
        borderColor: config.color,
        borderWidth: '2px',
        color: config.color,
        boxShadow: `0 0 20px ${config.glow}`,
      }}
    >
      <Sparkles className="w-4 h-4" />
      {showLabel && <span>{config.label}</span>}
    </motion.div>
  );
}

export function CardRarityGlow({ rarity, children }: { rarity: CardRarity; children: React.ReactNode }) {
  const config = rarityConfig[rarity];
  
  return (
    <div
      className="relative"
      style={{
        filter: `drop-shadow(0 0 10px ${config.glow})`,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
          opacity: 0.3,
        }}
      />
      {children}
    </div>
  );
}
