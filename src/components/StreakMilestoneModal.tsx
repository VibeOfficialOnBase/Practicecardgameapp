import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Flame, Star, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakMilestoneModalProps {
  streak: number;
  isOpen: boolean;
  onClose: () => void;
}

const MILESTONES = [
  { days: 3, title: '3-Day Warrior', icon: Flame, color: 'from-orange-400 to-red-500', message: 'You\'re building momentum!' },
  { days: 7, title: 'Week Champion', icon: Star, color: 'from-yellow-400 to-orange-500', message: 'One week of excellence!' },
  { days: 14, title: '2-Week Legend', icon: Trophy, color: 'from-blue-400 to-purple-500', message: 'You\'re unstoppable!' },
  { days: 30, title: 'Month Master', icon: Trophy, color: 'from-purple-400 to-pink-500', message: 'A full month of PRACTICE!' },
  { days: 50, title: '50-Day Hero', icon: Star, color: 'from-green-400 to-blue-500', message: 'You\'re a true practitioner!' },
  { days: 100, title: '100-Day LEGEND', icon: Trophy, color: 'from-yellow-300 to-red-500', message: 'Absolute dedication!' },
  { days: 365, title: '365-DAY MASTER', icon: Sparkles, color: 'from-purple-500 via-pink-500 to-yellow-500', message: 'You completed the full year!' },
];

export function StreakMilestoneModal({ streak, isOpen, onClose }: StreakMilestoneModalProps) {
  const [show, setShow] = useState(false);
  
  const milestone = MILESTONES.find(m => m.days === streak);
  
  useEffect(() => {
    if (isOpen && milestone) {
      setShow(true);
      
      // Trigger confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
        });
        
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#34D399', '#60A5FA', '#A78BFA', '#EC4899'],
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, milestone]);
  
  if (!milestone) return null;
  
  const Icon = milestone.icon;
  
  return (
    <Dialog open={show} onOpenChange={(open) => {
      if (!open) {
        setShow(false);
        onClose();
      }
    }}>
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-indigo-900/95 border-2 border-purple-400/50 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex flex-col items-center text-center py-8 px-4"
        >
          {/* Animated Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className={`mb-6 p-6 rounded-full bg-gradient-to-br ${milestone.color} shadow-2xl`}
          >
            <Icon className="w-16 h-16 text-white" />
          </motion.div>
          
          {/* Streak Number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
          >
            {streak}
          </motion.div>
          
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-3"
          >
            {milestone.title}
          </motion.h2>
          
          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 mb-6"
          >
            {milestone.message}
          </motion.p>
          
          {/* Flame Trail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            {[...Array(Math.min(streak, 10))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + (i * 0.05) }}
              >
                <Flame className="w-6 h-6 text-orange-500-orange-500" />
              </motion.div>
            ))}
            {streak > 10 && (
              <span className="text-orange-400 font-bold text-xl">+{streak - 10}</span>
            )}
          </motion.div>
          
          {/* Encouragement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 mb-6 border border-white/20"
          >
            <p className="text-white text-sm leading-relaxed">
              Your dedication to PRACTICE is inspiring! Keep this momentum going and watch how your daily commitment transforms your life. 🌟
            </p>
          </motion.div>
          
          {/* Share Button */}
          <Button
            onClick={() => {
              const text = `I just hit a ${streak}-day streak on PRACTICE! 🔥 ${milestone.title} #PRACTICE #SelfImprovement`;
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://practice.xyz`;
              window.open(url, '_blank');
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-lg py-6"
          >
            🎉 Share Your Achievement
          </Button>
          
          <Button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            variant="ghost"
            className="mt-4 text-white hover:bg-white/10"
          >
            Continue Your Journey →
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
