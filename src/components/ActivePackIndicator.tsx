import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap } from 'lucide-react';

interface ActivePackIndicatorProps {
  packName: string;
  emoji: string;
  isExclusive: boolean;
  cardCount: number;
}

export function ActivePackIndicator({ packName, emoji, isExclusive, cardCount }: ActivePackIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      {/* Main Indicator Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border-4 shadow-2xl backdrop-blur-lg ${
          isExclusive
            ? 'bg-gradient-to-br from-yellow-900/60 via-orange-900/60 to-pink-900/60 border-yellow-400'
            : 'bg-gradient-to-br from-purple-900/60 via-pink-900/60 to-indigo-900/60 border-purple-400'
        }`}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {isExclusive ? (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-400/30 rounded-full blur-3xl"
              />
            </>
          ) : (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400/30 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl"
              />
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Top Label */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {isExclusive ? (
                <Crown className="w-6 h-6 text-yellow-300" />
              ) : (
                <Sparkles className="w-6 h-6 text-purple-300" />
              )}
            </motion.div>
            <p className={`font-bold text-sm uppercase tracking-widest ${
              isExclusive ? 'text-yellow-200' : 'text-purple-200'
            }`}>
              {isExclusive ? '👑 Pulling from Exclusive Pack 👑' : '✨ Currently Pulling From ✨'}
            </p>
          </div>

          {/* Pack Name & Emoji */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.span
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl drop-shadow-2xl"
            >
              {emoji}
            </motion.span>
            <h2 className="text-5xl font-black text-white drop-shadow-2xl">
              {packName}
            </h2>
          </div>

          {/* Card Count Badge */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`px-6 py-3 rounded-full backdrop-blur-sm border-2 ${
              isExclusive
                ? 'bg-yellow-500/20 border-yellow-300'
                : 'bg-purple-500/20 border-purple-300'
            }`}>
              <p className="text-white font-black text-2xl">
                {cardCount} Cards
              </p>
            </div>
            {isExclusive && (
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-yellow-200"
              >
                <p className="text-black font-black text-sm flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  HOLDER EXCLUSIVE
                </p>
              </motion.div>
            )}
          </div>

          {/* Description */}
          <div className="text-center max-w-xl mx-auto">
            {isExclusive ? (
              <div className="space-y-2">
                <p className="text-yellow-100 font-bold text-lg">
                  🎉 You have access to ALL 465 legendary cards! 🎉
                </p>
                <p className="text-yellow-200/90 text-sm">
                  365 base PRACTICE cards + 100 exclusive $VibeOfficial holder cards
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                  <p className="text-yellow-300/80 text-xs font-semibold uppercase tracking-wider">
                    Maximum Frequency
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-purple-100 font-bold text-base">
                  Drawing from the core PRACTICE collection
                </p>
                <p className="text-purple-200/80 text-sm">
                  365 daily affirmations, missions, and inspiration
                </p>
                <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-purple-200/70 text-xs">
                    💡 Become a $VibeOfficial holder (1,000+ $VIBE) to unlock 100 additional exclusive frequency cards!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Decorative Border */}
        <div className={`h-2 ${
          isExclusive
            ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500'
            : 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400'
        }`} />
      </div>

      {/* Pulsing Glow Effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute inset-0 rounded-3xl blur-2xl -z-10 ${
          isExclusive
            ? 'bg-gradient-to-r from-yellow-400/40 via-orange-500/40 to-pink-500/40'
            : 'bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-purple-400/40'
        }`}
      />
    </motion.div>
  );
}
