import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  emoji = '✨'
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card border-white/20 rounded-2xl p-8 sm:p-12 max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-purple-300" />
          </div>
          <div className="text-5xl mb-4">{emoji}</div>
        </motion.div>
        
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/70 mb-6 leading-relaxed">{description}</p>
        
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="gradient"
            className="shadow-xl"
          >
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
