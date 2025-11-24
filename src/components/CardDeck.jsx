import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';

export default function CardDeck({ onPull, isPulling }) {
  const { play } = useSound();
  const { trigger } = useHaptic();
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
        100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
      }
      .shimmer-effect {
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 100%
        );
        animation: shimmer 3s infinite;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handlePull = () => {
    if (isPulling) return;
    play('card-shuffle');
    trigger('medium');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    onPull();
  };

  return (
    <div className="relative h-[500px] flex items-center justify-center">
      {/* Confetti particles */}
      {showConfetti && (
        <>
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#fbbf24', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'][i % 6],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0.5],
                x: (Math.random() - 0.5) * 600,
                y: Math.random() * -500 - 100,
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 1.5 + Math.random(),
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
      
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-72 h-[450px] rounded-3xl shadow-2xl overflow-hidden"
          style={{
            rotate: (i - 2) * 3,
            y: i * 4,
            x: (i - 2) * 8,
            zIndex: 5 - i,
            pointerEvents: 'none'
          }}
          initial={{ scale: 0.95, opacity: 0.3 }}
          animate={{ 
            scale: 0.95, 
            opacity: 0.5 - i * 0.1,
            rotate: isPulling ? [(i - 2) * 3, (i - 2) * 3 + 360] : (i - 2) * 3
          }}
          transition={{ duration: isPulling ? 0.6 : 0 }}
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/43aec5bff_PRACTICECARDBACK.jpg"
            alt="Card back"
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}

      <motion.button
        onClick={handlePull}
        disabled={isPulling}
        className="relative w-72 h-[450px] rounded-3xl shadow-2xl cursor-pointer overflow-hidden"
        style={{ 
          zIndex: 10,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: isPulling ? -100 : 0,
          rotateY: isPulling ? 180 : 0,
          opacity: isPulling ? 0 : 1,
          scale: isPulling ? 1.2 : 1
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/43aec5bff_PRACTICECARDBACK.jpg"
          alt="PRACTICE card"
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 shimmer-effect"></div>
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
          <p className="text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-full">
            Tap to pull
          </p>
        </div>
      </motion.button>
    </div>
  );
}