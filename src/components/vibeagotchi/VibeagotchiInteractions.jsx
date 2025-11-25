import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wind, BookHeart, Gamepad2, Droplets, Pill, Moon, Gift } from 'lucide-react';

export default function VibeagotchiInteractions({ 
  onFeed, 
  onBreathe, 
  onReflect, 
  onPlay, 
  onClean, 
  onHeal, 
  onSleep, 
  onGift,
  cooldowns = {},
  isSleeping = false,
  isSick = false
}) {
  const actions = [
    { 
      key: 'feed', 
      label: 'Feed', 
      icon: Sparkles, 
      color: '#F59E0B',
      onClick: onFeed,
      cooldown: cooldowns.feed,
      disabled: isSleeping
    },
    { 
      key: 'play', 
      label: 'Play', 
      icon: Gamepad2, 
      color: '#EC4899',
      onClick: onPlay,
      cooldown: cooldowns.play,
      disabled: isSleeping || isSick
    },
    { 
      key: 'clean', 
      label: 'Clean', 
      icon: Droplets, 
      color: '#3B82F6',
      onClick: onClean,
      cooldown: cooldowns.clean,
      disabled: isSleeping
    },
    { 
      key: 'breathe', 
      label: 'Breathe', 
      icon: Wind, 
      color: '#10B981',
      onClick: onBreathe,
      cooldown: cooldowns.breathe,
      disabled: isSleeping || isSick
    },
    { 
      key: 'heal', 
      label: 'Heal', 
      icon: Pill, 
      color: '#EF4444',
      onClick: onHeal,
      disabled: !isSick || isSleeping,
      highlight: isSick
    },
    { 
      key: 'sleep', 
      label: isSleeping ? 'Wake' : 'Sleep', 
      icon: Moon, 
      color: '#8B5CF6',
      onClick: onSleep
    },
    { 
      key: 'gift', 
      label: 'Gifts', 
      icon: Gift, 
      color: '#F59E0B',
      onClick: onGift,
      disabled: isSleeping
    },
    { 
      key: 'reflect', 
      label: 'Reflect', 
      icon: BookHeart, 
      color: '#A855F7',
      onClick: onReflect,
      disabled: isSleeping
    }
  ];

  return (
    <div className="flex overflow-x-auto pb-4 gap-3 px-1 no-scrollbar snap-x">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isOnCooldown = action.cooldown && action.cooldown > Date.now();
        const isDisabled = action.disabled || isOnCooldown;
        
        return (
          <motion.div
            key={action.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="snap-start shrink-0"
          >
            <button
              onClick={action.onClick}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl shadow-lg border border-white/10 transition-all active:scale-95 relative overflow-hidden group ${
                action.highlight ? 'animate-pulse ring-2 ring-red-400' : ''
              }`}
              style={{
                background: isDisabled 
                  ? 'var(--bg-secondary)'
                  : `linear-gradient(135deg, ${action.color}, ${action.color}dd)`
              }}
            >
              <div className={`p-2 rounded-full mb-1 ${isDisabled ? 'bg-gray-600/20' : 'bg-white/20'}`}>
                <Icon className={`w-5 h-5 ${isDisabled ? 'text-[var(--text-secondary)]' : 'text-white'}`} />
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isDisabled ? 'text-[var(--text-secondary)]' : 'text-white'
              }`}>
                {action.label}
              </span>

              {isOnCooldown && !isDisabled && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-[10px] font-bold text-white">
                    {Math.ceil((action.cooldown - Date.now()) / 60000)}m
                  </span>
                </div>
              )}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
