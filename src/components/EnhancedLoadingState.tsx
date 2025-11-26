import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';


interface EnhancedLoadingStateProps {
  message?: string;
}

const messages = [
  'Shuffling the cosmic deck...',
  'Channeling LECHE energy...',
  'Your card is manifesting...',
  'Consulting the universe...',
  'Brewing some PRACTICE magic...',
  'Aligning the stars...',
  'Gathering wisdom...',
  'Preparing your affirmation...'
];

export function EnhancedLoadingState({ message }: EnhancedLoadingStateProps) {
  const randomMessage = message || messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Animated Logo */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        <img
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
          alt="Loading"
          width={80}
          height={80}
          className="rounded-full border-4 border-purple-400/50 shadow-2xl"
        />
        
        {/* Orbiting sparkles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
            className="absolute inset-0"
            style={{
              transformOrigin: 'center center',
            }}
          >
            <Sparkles
              className="w-4 h-4 text-yellow-400 absolute"
              style={{
                top: '50%',
                left: '100%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading message with fade animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.p
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-white text-lg font-semibold"
        >
          {randomMessage}
        </motion.p>
      </motion.div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-purple-400 rounded-full"
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="h-full w-1/2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
        />
      </div>
    </div>
  );
}
