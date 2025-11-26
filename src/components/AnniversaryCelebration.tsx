import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, Trophy, Heart, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface AnniversaryCelebrationProps {
  username: string;
  firstPullDate: string;
}

export function AnniversaryCelebration({ username, firstPullDate }: AnniversaryCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [anniversaryData, setAnniversaryData] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
  } | null>(null);

  useEffect(() => {
    checkAnniversary();
  }, [firstPullDate]);

  const checkAnniversary = () => {
    const firstPull = new Date(firstPullDate);
    const now = new Date();
    
    // Calculate time since first pull
    const timeDiff = now.getTime() - firstPull.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Check if it's an anniversary
    const isYearAnniversary = daysDiff % 365 === 0 && daysDiff > 0;
    const isMonthAnniversary = daysDiff % 30 === 0 && daysDiff >= 30;
    const is100DayMilestone = daysDiff === 100;
    
    if (isYearAnniversary || isMonthAnniversary || is100DayMilestone) {
      const years = Math.floor(daysDiff / 365);
      const remainingDays = daysDiff % 365;
      const months = Math.floor(remainingDays / 30);
      const days = remainingDays % 30;
      
      setAnniversaryData({
        years,
        months,
        days,
        totalDays: daysDiff,
      });
      
      setShowCelebration(true);
      
      // Trigger celebration confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#00CED1'],
      });
      
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#FFD700', '#FFA500', '#FF69B4'],
        });
      }, 400);
    }
  };

  const handleShare = async () => {
    const text = anniversaryData?.years && anniversaryData.years > 0
      ? `🎉 Celebrating ${anniversaryData.years} year${anniversaryData.years !== 1 ? 's' : ''} of PRACTICE! ${anniversaryData.totalDays} days of consistent growth! 🌟`
      : `🎉 Celebrating ${anniversaryData?.totalDays} days of PRACTICE! Building consistency every day! 🌟`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'PRACTICE Anniversary',
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!showCelebration || !anniversaryData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setShowCelebration(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-lg w-full"
        >
          <Card className="bg-gradient-to-br from-purple-950 via-pink-950 to-orange-950 border-4 border-yellow-400/50 shadow-2xl p-8 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/20 via-pink-500/20 to-purple-600/20 animate-gradient"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="text-center mb-6"
              >
                <div className="text-8xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  Anniversary!
                </h2>
                <p className="text-yellow-200 text-lg">
                  Celebrating Your Journey
                </p>
              </motion.div>

              {/* Time Display */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {anniversaryData.years > 0 && (
                  <div className="glass-card p-4 text-center rounded-lg">
                    <p className="text-white font-bold text-3xl">{anniversaryData.years}</p>
                    <p className="text-white/60 text-sm">Year{anniversaryData.years !== 1 ? 's' : ''}</p>
                  </div>
                )}
                {anniversaryData.months > 0 && (
                  <div className="glass-card p-4 text-center rounded-lg">
                    <p className="text-white font-bold text-3xl">{anniversaryData.months}</p>
                    <p className="text-white/60 text-sm">Month{anniversaryData.months !== 1 ? 's' : ''}</p>
                  </div>
                )}
                <div className="glass-card p-4 text-center rounded-lg">
                  <p className="text-white font-bold text-3xl">{anniversaryData.totalDays}</p>
                  <p className="text-white/60 text-sm">Total Days</p>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/10 rounded-lg p-6 mb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-white font-semibold">Consistency Champion</p>
                    <p className="text-white/70 text-sm">{anniversaryData.totalDays} days of dedication</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <div>
                    <p className="text-white font-semibold">Growth Mindset</p>
                    <p className="text-white/70 text-sm">Committed to daily practice</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-white font-semibold">Inspiration</p>
                    <p className="text-white/70 text-sm">Leading by example</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-100 text-center italic leading-relaxed">
                  &quot;Your commitment to PRACTICE over {anniversaryData.totalDays} days is truly inspiring. 
                  Every card pulled, every moment of reflection - it all adds up to extraordinary growth. 
                  Keep shining! ✨&quot;
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleShare}
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Your Journey
                </Button>
                <Button
                  onClick={() => setShowCelebration(false)}
                  variant="outline"
                  size="lg"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  Continue Practicing
                </Button>
              </div>

              <p className="text-white/50 text-xs text-center mt-4">
                @{username} • Member since {new Date(firstPullDate).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
