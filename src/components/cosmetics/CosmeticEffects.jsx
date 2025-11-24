import React from 'react';
import { motion } from 'framer-motion';
import { getEquippedCosmetic } from './cosmeticsData';

// Wrapper for cards with cosmetic effects
export function CardWithCosmetics({ children, equippedCosmetics = [], className = '' }) {
  const cardEffect = getEquippedCosmetic(equippedCosmetics, 'card-effect');
  const cardBackground = getEquippedCosmetic(equippedCosmetics, 'card-background');
  
  const hasGoldenAura = equippedCosmetics.includes('golden-aura');
  const hasShimmer = equippedCosmetics.includes('shimmer-trail');
  const hasRainbowFlip = equippedCosmetics.includes('rainbow-flip');

  return (
    <motion.div 
      className={`relative ${className}`}
      whileHover={hasShimmer ? { scale: 1.02 } : {}}
    >
      {hasGoldenAura && (
        <>
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              filter: 'blur(20px)',
              opacity: 0.3,
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.2)',
              border: '2px solid rgba(255, 215, 0, 0.5)',
            }}
          />
        </>
      )}

      {cardBackground && (
        <div 
          className="absolute inset-0 rounded-3xl opacity-20"
          style={{
            background: cardBackground.data.background,
          }}
        />
      )}

      <div className="relative z-10">
        {children}
      </div>

      {hasShimmer && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Badge for profile names in community
export function ProfileBadge({ equippedCosmetics = [] }) {
  const badge = getEquippedCosmetic(equippedCosmetics, 'profile-badge');
  
  if (!badge) return null;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-block ml-2"
      title={badge.name}
    >
      {badge.data.icon}
    </motion.span>
  );
}

// Enhanced background for theme cosmetics
export function CosmeticBackground({ equippedCosmetics = [], children }) {
  const theme = getEquippedCosmetic(equippedCosmetics, 'theme');
  const hasCelestialTheme = equippedCosmetics.includes('celestial-theme');

  return (
    <div className="relative">
      {hasCelestialTheme && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FFA500', '#FF69B4'][Math.floor(Math.random() * 3)],
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}