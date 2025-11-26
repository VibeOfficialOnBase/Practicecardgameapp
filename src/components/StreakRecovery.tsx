import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame, DollarSign, AlertCircle } from 'lucide-react';

interface StreakRecoveryProps {
  lastPullDate: Date;
  streak: number;
  onRecover: () => Promise<boolean>;
}

export function StreakRecovery({ lastPullDate, streak, onRecover }: StreakRecoveryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  // Check if user missed yesterday
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const lastPull = new Date(lastPullDate);
  lastPull.setHours(0, 0, 0, 0);
  
  const daysSinceLastPull = Math.floor((now.getTime() - lastPull.getTime()) / (1000 * 60 * 60 * 24));
  
  // Only show if exactly 1 day missed and streak > 0
  const canRecover = daysSinceLastPull === 1 && streak > 0;

  const handleRecover = async () => {
    setIsRecovering(true);
    const success = await onRecover();
    if (success) {
      setIsOpen(false);
    }
    setIsRecovering(false);
  };

  if (!canRecover) {
    return null;
  }

  return (
    <>
      {/* Streak Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-400/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </motion.div>
              <div>
                <p className="text-white font-bold">Your {streak}-day streak is about to break! 🔥</p>
                <p className="text-orange-200 text-sm">You missed yesterday's pull</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              size="sm"
              className="border-orange-400 text-orange-300 hover:bg-orange-500/20"
            >
              <Flame className="w-4 h-4 mr-2" />
              Recover
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Recovery Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <Card className="bg-gradient-to-br from-orange-950 to-red-950 border-2 border-orange-400/50 shadow-2xl p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="text-6xl mb-4"
                  >
                    🔥
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Streak Recovery
                  </h2>
                  <p className="text-orange-200">
                    Keep your {streak}-day streak alive!
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80">Current Streak:</span>
                      <span className="text-white font-bold text-xl">{streak} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Recovery Cost:</span>
                      <span className="text-green-400 font-bold text-xl">$1.00</span>
                    </div>
                  </div>

                  <div className="bg-orange-900/30 border border-orange-400/30 rounded-lg p-4 space-y-2">
                    <p className="text-orange-200 text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      One-time recovery offer
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Recover your streak now for just $1. This is a one-time grace period per streak cycle.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleRecover}
                    disabled={isRecovering}
                    variant="gradient"
                    size="lg"
                    className="w-full"
                  >
                    {isRecovering ? (
                      'Processing...'
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" />
                        Recover Streak for $1
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    size="lg"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Maybe Later
                  </Button>
                </div>

                <p className="text-white/50 text-xs text-center mt-4">
                  Payment processed securely via Stripe
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
