import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import { predictStreakRisk } from '@/utils/predictionService';

interface FOMONotificationProps {
  username: string;
  streak: number;
  onPullCard: () => void;
}

export function FOMONotification({ username, streak, onPullCard }: FOMONotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    checkRisk();
    const interval = setInterval(checkRisk, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [username, streak]);

  useEffect(() => {
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const checkRisk = () => {
    const prediction = predictStreakRisk(username);
    const risk = prediction.prediction as 'low' | 'medium' | 'high';
    
    setRiskLevel(risk);
    setShowNotification(risk !== 'low' && streak > 0);
  };

  const updateTimeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diff = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeRemaining(`${hours}h ${minutes}m`);
  };

  if (!showNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-4"
      >
        <Card className={`border-2 backdrop-blur-xl shadow-2xl ${
          riskLevel === 'high'
            ? 'bg-gradient-to-r from-red-950/95 to-orange-950/95 border-red-400/50'
            : 'bg-gradient-to-r from-yellow-950/95 to-orange-950/95 border-yellow-400/50'
        }`}>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={riskLevel === 'high' ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <Flame className={`w-6 h-6 ${
                    riskLevel === 'high' ? 'text-red-400' : 'text-orange-400'
                  }`} />
                </motion.div>
                <div>
                  <p className={`font-bold ${
                    riskLevel === 'high' ? 'text-red-300' : 'text-yellow-300'
                  }`}>
                    {riskLevel === 'high' ? 'Streak at Risk!' : 'Don\'t Forget!'}
                  </p>
                  <p className="text-white/70 text-xs">
                    {streak}-day streak
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Message */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/60" />
                <p className="text-white text-sm">
                  {timeRemaining} left to pull today's card
                </p>
              </div>
              
              {riskLevel === 'high' && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-900/30 border border-red-400/30">
                  <TrendingUp className="w-4 h-4 text-red-300" />
                  <p className="text-red-200 text-xs">
                    12+ people just extended their streaks!
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => {
                onPullCard();
                setShowNotification(false);
              }}
              variant="gradient"
              size="sm"
              className="w-full animate-smooth-pulse"
            >
              <Flame className="w-4 h-4 mr-2" />
              Pull Card Now
            </Button>

            <p className="text-white/50 text-xs text-center mt-2">
              Tap to continue your journey
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
