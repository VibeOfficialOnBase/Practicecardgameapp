import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap, Star } from 'lucide-react';

import confetti from 'canvas-confetti';

interface EnhancedCardRevealAnimationProps {
  onRevealComplete: () => void;
  cardBackUrl: string;
  cardFrontUrl: string;
}

export function EnhancedCardRevealAnimation({ 
  onRevealComplete, 
  cardBackUrl, 
  cardFrontUrl 
}: EnhancedCardRevealAnimationProps) {
  const [stage, setStage] = useState<'anticipation' | 'countdown' | 'flip' | 'burst' | 'revealed'>('anticipation');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Anticipation stage - building suspense
    if (stage === 'anticipation') {
      const timer = setTimeout(() => {
        setStage('countdown');
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Countdown: 3... 2... 1...
    if (stage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        
        // Small confetti burst on each countdown number
        confetti({
          particleCount: 20,
          spread: 30,
          origin: { y: 0.6 },
          colors: ['#A78BFA', '#EC4899', '#34D399'],
        });
      }, 700);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      // Start the dramatic flip
      setTimeout(() => {
        setStage('flip');
        
        // Firework-style confetti during flip
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        
        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }
          
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#FFA500', '#FF69B4'],
          });
          
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#34D399', '#60A5FA', '#A78BFA'],
          });
        }, 50);
        
        // Transition to burst
        setTimeout(() => {
          setStage('burst');
          
          // MASSIVE confetti explosion
          confetti({
            particleCount: 300,
            spread: 180,
            origin: { y: 0.5 },
            colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#34D399', '#60A5FA'],
            startVelocity: 60,
            gravity: 1.2,
            scalar: 1.5,
            shapes: ['circle', 'square'],
          });
          
          // Sparkle burst
          setTimeout(() => {
            for (let i = 0; i < 10; i++) {
              setTimeout(() => {
                confetti({
                  particleCount: 30,
                  spread: 360,
                  origin: { 
                    x: 0.3 + Math.random() * 0.4,
                    y: 0.3 + Math.random() * 0.4
                  },
                  colors: ['#FFFFFF', '#FFD700'],
                  startVelocity: 25,
                  shapes: ['star'],
                });
              }, i * 100);
            }
          }, 200);
        }, 1200);
        
        // Complete reveal
        setTimeout(() => {
          setStage('revealed');
          onRevealComplete();
        }, 2500);
      }, 300);
    }
  }, [stage, countdown, onRevealComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      {/* Background pulse effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <AnimatePresence mode="wait">
        {/* Anticipation Stage */}
        {stage === 'anticipation' && (
          <motion.div
            key="anticipation"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] mx-auto" />
            </motion.div>
            <motion.p 
              className="text-white text-2xl mt-6 font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Preparing your magic...
            </motion.p>
          </motion.div>
        )}
        
        {/* Countdown Stage */}
        {stage === 'countdown' && countdown > 0 && (
          <motion.div
            key="countdown"
            initial={{ scale: 0, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="relative"
            >
              {/* Number with multiple glow layers */}
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 scale-150" />
                <motion.div
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(236,72,153,0.6)',
                      '0 0 40px rgba(168,85,247,1), 0 0 80px rgba(236,72,153,0.8)',
                      '0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(236,72,153,0.6)',
                    ]
                  }}
                  transition={{ duration: 0.7 }}
                  className="text-9xl sm:text-[12rem] font-black bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent relative z-10"
                >
                  {countdown}
                </motion.div>
              </div>
              
              {/* Orbiting sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: 120,
                    height: 120,
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.25
                  }}
                >
                  <Star 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400-yellow-400"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.8))'
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
              <p className="text-white text-xl font-bold">
                Get ready for your transformation...
              </p>
              <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
            </motion.div>
          </motion.div>
        )}
        
        {/* Flip Animation */}
        {stage === 'flip' && (
          <motion.div
            key="flip"
            initial={{ rotateY: 0, scale: 0.9 }}
            animate={{ 
              rotateY: [0, 90, 180],
              scale: [0.9, 1.1, 1],
            }}
            transition={{ 
              duration: 1.2, 
              ease: [0.34, 1.56, 0.64, 1],
              times: [0, 0.5, 1]
            }}
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: 1500
            }}
            className="relative w-full max-w-md px-4"
          >
            <Card className="relative overflow-hidden border-4 border-purple-500/50 shadow-2xl bg-transparent rounded-3xl">
              <div className="relative w-full aspect-[2/3]">
                <img
                  src={cardBackUrl}
                  alt="PRACTICE Card"
                 
                  className="object-cover"
                 
                />
                
                {/* Animated shimmer sweeps */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 1.2, ease: "linear" }}
                />
                
                {/* Rotating border glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'conic-gradient(from 0deg, #A78BFA, #EC4899, #34D399, #60A5FA, #A78BFA)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    padding: '4px',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                />
              </div>
            </Card>
          </motion.div>
        )}
        
        {/* Burst Effect */}
        {stage === 'burst' && (
          <motion.div
            key="burst"
            initial={{ scale: 0, opacity: 0, rotateY: 180 }}
            animate={{ 
              scale: [0, 1.3, 1], 
              opacity: [0, 1, 1],
              rotateY: [180, 180, 180]
            }}
            transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            className="relative w-full max-w-md px-4"
          >
            {/* Radial explosion waves */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 -z-10 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 3, 4],
                  opacity: [0.8, 0.3, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.15,
                  ease: "easeOut"
                }}
              />
            ))}
            
            <Card className="relative overflow-hidden border-4 border-yellow-400 shadow-2xl bg-transparent rounded-3xl">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(250,204,21,0)',
                    '0 0 60px rgba(250,204,21,0.8)',
                    '0 0 0px rgba(250,204,21,0)',
                  ]
                }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative w-full aspect-[2/3]">
                  <img
                    src={cardFrontUrl}
                    alt="PRACTICE Card Revealed"
                   
                    className="object-cover"
                   
                  />
                  
                  {/* Sparkle explosions */}
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        boxShadow: '0 0 10px rgba(250,204,21,1)',
                      }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        x: (Math.random() - 0.5) * 300,
                        y: (Math.random() - 0.5) * 400,
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.02,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                  
                  {/* Center impact flash */}
                  <motion.div
                    className="absolute inset-0 bg-white"
                    animate={{
                      opacity: [1, 0],
                      scale: [0.5, 2],
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
