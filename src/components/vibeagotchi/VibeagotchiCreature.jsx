import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const evolutionData = {
  0: { name: 'Spark', color: '#A855F7', size: 80, particles: 5 },
  1: { name: 'Ember', color: '#EC4899', size: 100, particles: 10 },
  2: { name: 'Flame', color: '#F59E0B', size: 120, particles: 15 },
  3: { name: 'Radiant', color: '#10B981', size: 140, particles: 20 },
  4: { name: 'Celestial', color: '#3B82F6', size: 160, particles: 25 },
  5: { name: 'Transcendent', color: '#8B5CF6', size: 180, particles: 30 }
};

const emotionColors = {
  happy: '#FCD34D',
  calm: '#93C5FD',
  curious: '#C084FC',
  playful: '#FF6B9D',
  sleepy: '#9CA3AF',
  hungry: '#F59E0B',
  sick: '#EF4444',
  low_energy: '#9CA3AF',
  overwhelmed: '#F87171',
  glowing: '#FBBF24',
  excited: '#FF00FF',
  content: '#10B981'
};

export default function VibeagotchiCreature({ state, onTap, equippedItem }) {
  const [blinkState, setBlinkState] = useState(false);
  const [bounce, setBounce] = useState(false);
  const evolution = evolutionData[state.evolution_stage] || evolutionData[0];
  const emotionColor = emotionColors[state.current_emotion] || emotionColors.curious;

  useEffect(() => {
    if (state.current_emotion === 'excited' || state.current_emotion === 'playful') {
      const bounceInterval = setInterval(() => {
        setBounce(true);
        setTimeout(() => setBounce(false), 500);
      }, 2000);
      return () => clearInterval(bounceInterval);
    }
  }, [state.current_emotion]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ height: '400px' }}>
      {/* Background Aura */}
      <motion.div
        className="absolute rounded-full opacity-30 blur-3xl"
        style={{
          width: evolution.size * 2,
          height: evolution.size * 2,
          background: `radial-gradient(circle, ${evolution.color}, transparent)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Floating Particles */}
      {[...Array(evolution.particles)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: emotionColor,
            left: `${50 + (Math.random() - 0.5) * 200}%`,
            top: `${50 + (Math.random() - 0.5) * 200}%`
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Main Creature */}
      <motion.div
        className="relative cursor-pointer"
        onClick={onTap}
        animate={{
          y: state.is_sleeping ? [0, -5, 0] : (bounce ? [0, -40, 0] : [0, -20, 0]),
          rotate: state.is_sleeping ? [0] : (state.is_sick ? [-5, 5, -5] : [0, 5, 0, -5, 0]),
          opacity: state.is_sick ? [1, 0.7, 1] : 1
        }}
        transition={{
          y: { duration: state.is_sleeping ? 2 : (bounce ? 0.5 : 4), repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: state.is_sick ? 0.5 : 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1, repeat: Infinity }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Core Orb */}
        <div
          className="rounded-full relative overflow-hidden"
          style={{
            width: evolution.size,
            height: evolution.size,
            background: `radial-gradient(circle at 30% 30%, ${emotionColor}, ${evolution.color})`,
            boxShadow: `0 0 40px ${evolution.color}, 0 0 80px ${emotionColor}`
          }}
        >
          {/* Inner Glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6), transparent)`
            }}
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Eyes */}
          {state.evolution_stage >= 1 && !state.is_sleeping && (
            <div className="absolute inset-0 flex items-center justify-center gap-4">
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scaleY: blinkState || state.is_sick ? 0.1 : 1
                }}
                transition={{ duration: 0.1 }}
              />
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scaleY: blinkState || state.is_sick ? 0.1 : 1
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}

          {/* Sleeping Eyes */}
          {state.is_sleeping && state.evolution_stage >= 1 && (
            <div className="absolute inset-0 flex items-center justify-center gap-4">
              <div className="text-white text-xl">😴</div>
            </div>
          )}

          {/* Sick Indicator */}
          {state.is_sick && (
            <div className="absolute -top-2 -right-2 text-2xl">🤒</div>
          )}

          {/* Energy Waves */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: emotionColor }}
            animate={{
              scale: [1, 1.3],
              opacity: [0.6, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Equipped Item */}
        {equippedItem && (
          <motion.div
            className="absolute -top-6 -right-2 text-3xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {equippedItem === 'crown' && '👑'}
            {equippedItem === 'star_badge' && '⭐'}
            {equippedItem === 'heart_charm' && '💖'}
            {equippedItem === 'sparkle_ring' && '✨'}
          </motion.div>
        )}

        {/* Evolution Stage Name */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-sm font-bold text-center" style={{ color: evolution.color, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {evolution.name}
          </p>
        </div>
      </motion.div>

      {/* Emotion Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md"
      >
        <p className="text-xs font-semibold capitalize" style={{ color: emotionColor }}>
          {state.current_emotion.replace('_', ' ')}
        </p>
      </motion.div>
    </div>
  );
}