import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppShareButtonProps {
  onClick: () => void;
  className?: string;
}

export function AppShareButton({ onClick, className = '' }: AppShareButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className={`fixed bottom-24 right-4 z-40 ${className}`}
    >
      <Button
        onClick={onClick}
        size="lg"
        className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 rounded-full w-14 h-14 p-0"
        aria-label="Share PRACTICE app"
      >
        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <div className="relative flex items-center justify-center">
          <Share2 className="w-6 h-6 animate-pulse" />
        </div>
      </Button>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
    </motion.div>
  );
}
