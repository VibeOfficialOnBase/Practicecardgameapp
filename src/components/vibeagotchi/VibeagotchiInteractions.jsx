import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wind, BookHeart, Gamepad2, Droplets, Pill, Moon, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="grid grid-cols-2 gap-2 md:gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isOnCooldown = action.cooldown && action.cooldown > Date.now();
        const isDisabled = action.disabled || isOnCooldown;
        
        return (
          <motion.div
            key={action.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              onClick={action.onClick}
              disabled={isDisabled}
              className={`w-full h-16 md:h-20 rounded-xl md:rounded-2xl relative overflow-hidden ${
                action.highlight ? 'animate-pulse' : ''
              }`}
              style={{
                background: isDisabled 
                  ? '#4B5563' 
                  : `linear-gradient(135deg, ${action.color}aa, ${action.color})`
              }}
            >
              <div className="flex flex-col items-center gap-0.5 md:gap-1">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="text-white font-semibold text-xs md:text-sm">{action.label}</span>
                {isOnCooldown && (
                  <span className="text-xs text-white/70">
                    {Math.ceil((action.cooldown - Date.now()) / 60000)}m
                  </span>
                )}
              </div>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}