import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GoldenCardWrapperProps {
  children: React.ReactNode;
}

export function GoldenCardWrapper({ children }: GoldenCardWrapperProps) {
  const [showBurst, setShowBurst] = useState(true);

  useEffect(() => {
    // Hide burst after animation completes
    const timer = setTimeout(() => setShowBurst(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Burst Effect on Reveal */}
      {showBurst && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 blur-3xl"
        />
      )}

      {/* Pulsing Outer Glow */}
      <motion.div
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 blur-2xl opacity-50 -z-10"
      />

      {/* Floating Golden Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}%`,
              y: '120%',
              opacity: 0,
            }}
            animate={{
              y: '-20%',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              boxShadow: '0 0 8px 2px rgba(251, 191, 36, 0.8)',
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Holographic Shimmer Effect */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.3) 50%, transparent 70%)',
            'linear-gradient(225deg, transparent 30%, rgba(255, 215, 0, 0.3) 50%, transparent 70%)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay"
      />

      {/* Rotating Rainbow Holographic Effect */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -inset-1 rounded-2xl opacity-30 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
          filter: 'blur(8px)',
        }}
      />

      {/* Golden Animated Border */}
      <div className="relative p-1 rounded-2xl bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-border-flow">
        {/* Inner Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-50 blur-sm animate-pulse" />
        
        {/* Card Content with Dark Background to Make Border Pop */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden">
          {/* Additional Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 pointer-events-none" />
          
          {/* Corner Sparkles */}
          <div className="absolute top-2 right-2 w-8 h-8">
            <motion.div
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
              className="text-2xl"
            >
              ✨
            </motion.div>
          </div>
          <div className="absolute top-2 left-2 w-8 h-8">
            <motion.div
              animate={{
                scale: [0, 1, 0],
                rotate: [0, -180, -360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
              className="text-2xl"
            >
              ✨
            </motion.div>
          </div>
          <div className="absolute bottom-2 right-2 w-8 h-8">
            <motion.div
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
              className="text-2xl"
            >
              ✨
            </motion.div>
          </div>
          <div className="absolute bottom-2 left-2 w-8 h-8">
            <motion.div
              animate={{
                scale: [0, 1, 0],
                rotate: [0, -180, -360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.5,
              }}
              className="text-2xl"
            >
              ✨
            </motion.div>
          </div>

          {/* Crown Icon Floating */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
            >
              👑
            </motion.div>
          </div>

          {children}
        </div>
      </div>

      {/* Legendary Badge Overlay */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 shadow-2xl border-2 border-yellow-200"
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 10px rgba(251, 191, 36, 0.8)',
                '0 0 20px rgba(251, 191, 36, 1)',
                '0 0 10px rgba(251, 191, 36, 0.8)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-black font-bold text-sm uppercase tracking-wider"
          >
            ✨ Legendary Pull ✨
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
