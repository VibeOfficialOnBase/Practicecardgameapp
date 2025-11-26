import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  emoji?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: ReactNode;
}

export function EnhancedEmptyState({
  icon: Icon,
  title,
  description,
  emoji = '🌱',
  action,
  illustration
}: EnhancedEmptyStateProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto"
    >
      {/* Icon Container with Animation */}
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6 relative"
      >
        {illustration || (
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
            />
            <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 w-24 h-24 rounded-full flex items-center justify-center border-2 border-purple-400/30 shadow-2xl">
              <Icon className="w-12 h-12 text-purple-300" />
            </div>
          </div>
        )}
      </motion.div>

      {/* Emoji with bounce */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-6xl mb-4"
      >
        {emoji}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-white mb-3"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/70 leading-relaxed mb-6"
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={action.onClick}
            variant="gradient"
            size="lg"
            className="shadow-xl hover:shadow-2xl transition-shadow"
          >
            {action.label}
          </Button>
        </motion.div>
      )}

      {/* Decorative floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
            className="absolute w-2 h-2 bg-purple-400/50 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              bottom: '0%',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
