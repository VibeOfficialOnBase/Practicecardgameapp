import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronDown } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  progress: number;
  isRefreshing: boolean;
  isVisible: boolean;
}

export function PullToRefreshIndicator({
  progress,
  isRefreshing,
  isVisible,
}: PullToRefreshIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-4"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 shadow-2xl">
            <div className="flex items-center gap-3">
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-white text-sm font-semibold">
                    Refreshing...
                  </span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: progress >= 100 ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <span className="text-white text-sm font-semibold">
                    {progress >= 100 ? 'Release to refresh' : 'Pull to refresh'}
                  </span>
                  <div className="relative w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
