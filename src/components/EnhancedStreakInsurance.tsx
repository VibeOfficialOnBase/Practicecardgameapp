import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame, Shield, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedStreakInsuranceProps {
  username: string;
  streak: number;
  onUseInsurance: () => Promise<boolean>;
}

export function EnhancedStreakInsurance({ username, streak, onUseInsurance }: EnhancedStreakInsuranceProps) {
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceCount, setInsuranceCount] = useState(0);
  const [showOffer, setShowOffer] = useState(false);
  const [isUsing, setIsUsing] = useState(false);

  useEffect(() => {
    loadInsuranceStatus();
  }, [username]);

  useEffect(() => {
    // Check if user needs insurance (missed yesterday)
    const lastPull = localStorage.getItem(`practice_last_pull_${username}`);
    if (lastPull) {
      const lastPullDate = new Date(lastPull);
      const now = new Date();
      const daysSince = Math.floor((now.getTime() - lastPullDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSince === 1 && streak > 0 && insuranceCount > 0) {
        setShowOffer(true);
      }
    }
  }, [username, streak, insuranceCount]);

  const loadInsuranceStatus = () => {
    const insurance = localStorage.getItem(`practice_streak_insurance_${username}`);
    if (insurance) {
      const data = JSON.parse(insurance);
      setInsuranceCount(data.count || 0);
      setHasInsurance(data.count > 0);
    }
  };

  const handleUseInsurance = async () => {
    if (insuranceCount === 0) return;

    setIsUsing(true);
    const success = await onUseInsurance();
    
    if (success) {
      const newCount = insuranceCount - 1;
      setInsuranceCount(newCount);
      setHasInsurance(newCount > 0);
      localStorage.setItem(
        `practice_streak_insurance_${username}`,
        JSON.stringify({ count: newCount })
      );
      setShowOffer(false);
      toast.success('🔥 Streak recovered! Your momentum continues!');
    } else {
      toast.error('Failed to use insurance. Please try again.');
    }
    
    setIsUsing(false);
  };

  const handleEarnInsurance = () => {
    // Award insurance for various achievements
    const newCount = insuranceCount + 1;
    setInsuranceCount(newCount);
    setHasInsurance(true);
    localStorage.setItem(
      `practice_streak_insurance_${username}`,
      JSON.stringify({ count: newCount })
    );
    toast.success('🛡️ Earned 1 Streak Insurance! You can save your streak once per month.');
  };

  // Auto-award insurance at streak milestones
  useEffect(() => {
    if (streak === 7 || streak === 30 || streak === 100) {
      handleEarnInsurance();
    }
  }, [streak]);

  if (!showOffer && !hasInsurance) return null;

  return (
    <>
      {/* Insurance Status Display */}
      {hasInsurance && !showOffer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-2 border-blue-400/50 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-white font-bold">Streak Insurance Active 🛡️</p>
                  <p className="text-blue-200 text-sm">You have {insuranceCount} {insuranceCount === 1 ? 'save' : 'saves'} available</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-white font-bold text-xl">{insuranceCount}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recovery Offer */}
      <AnimatePresence>
        {showOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowOffer(false)}
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
                    🛡️
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Use Streak Insurance?
                  </h2>
                  <p className="text-orange-200">
                    Protect your {streak}-day streak!
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
                      <span className="text-white/80">Insurance Available:</span>
                      <span className="text-green-400 font-bold text-xl">{insuranceCount}</span>
                    </div>
                  </div>

                  <div className="bg-orange-900/30 border border-orange-400/30 rounded-lg p-4 space-y-2">
                    <p className="text-orange-200 text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      How it works
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      • Use one insurance to restore your missed day
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      • Earn more insurance at streak milestones (7, 30, 100 days)
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      • Maximum 3 insurance saves can be stored
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleUseInsurance}
                    disabled={isUsing || insuranceCount === 0}
                    variant="gradient"
                    size="lg"
                    className="w-full"
                  >
                    {isUsing ? (
                      'Recovering Streak...'
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Use Insurance (Free)
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowOffer(false)}
                    variant="outline"
                    size="lg"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    I'll Start Fresh
                  </Button>
                </div>

                <p className="text-white/50 text-xs text-center mt-4">
                  Earned through consistent practice
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
