import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';

export default function CardDeck({ onPull, isPulling }) {
  const { play } = useSound();
  const { trigger } = useHaptic();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const handlePull = () => {
    if (isPulling) return;
    play('card-shuffle');
    trigger('medium');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    onPull();
  };

  return (
    <div className="relative h-[420px] flex items-center justify-center py-8">
      {/* Deck Stack */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[260px] h-[380px] rounded-[32px] bg-gradient-to-br from-purple-900 to-indigo-900 shadow-2xl border border-white/10"
          style={{
            zIndex: 5 - i,
          }}
          initial={{
            scale: 0.9 - (i * 0.05),
            y: i * 10,
            rotate: (i % 2 === 0 ? 1 : -1) * (i * 2)
          }}
          animate={{ 
            scale: isPulling ? 0.8 : 0.9 - (i * 0.05),
            y: isPulling ? i * 5 : i * 10,
          }}
        />
      ))}

      {/* Top Card (Actionable) */}
      <motion.button
        onClick={handlePull}
        disabled={isPulling}
        className="relative w-[260px] h-[380px] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden z-10 group"
        animate={{
          y: isPulling ? -200 : 0,
          scale: isPulling ? 0.5 : 1,
          opacity: isPulling ? 0 : 1,
          rotate: isPulling ? 10 : 0
        }}
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: "backOut" }}
      >
        {/* Card Back Design */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-700">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_60%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-white/40" />
                </div>
            </div>

            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Label */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
             <span className="px-4 py-2 rounded-full bg-black/20 backdrop-blur-md text-white text-sm font-bold tracking-widest uppercase border border-white/10 group-hover:bg-white/20 transition-colors">
                Draw Card
             </span>
        </div>
      </motion.button>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
