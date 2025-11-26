import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Flame, Trophy, Sparkles } from 'lucide-react';

interface Activity {
  id: string;
  type: 'pull' | 'achievement' | 'streak' | 'milestone';
  username: string;
  message: string;
  timestamp: number;
}

export function SocialProofNotifications() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  useEffect(() => {
    // Simulate real-time activity feed
    const generateActivity = () => {
      const types: Array<'pull' | 'achievement' | 'streak' | 'milestone'> = ['pull', 'achievement', 'streak', 'milestone'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const usernames = [
        'vibemaster',
        'zenwarrior', 
        'cardcollector',
        'streakchaser',
        'dailypractice',
        'mindfulone',
        'growthhacker',
        'consistency_pro',
      ];
      
      const username = usernames[Math.floor(Math.random() * usernames.length)];
      
      let message = '';
      switch (type) {
        case 'pull':
          message = `just pulled their daily card`;
          break;
        case 'achievement':
          const achievements = [
            'Week Warrior',
            'Month Master',
            'Share Champion',
            'Level Up'
          ];
          message = `unlocked ${achievements[Math.floor(Math.random() * achievements.length)]}`;
          break;
        case 'streak':
          const days = Math.floor(Math.random() * 100) + 7;
          message = `reached a ${days}-day streak! 🔥`;
          break;
        case 'milestone':
          message = `just hit 100 total pulls!`;
          break;
      }

      const activity: Activity = {
        id: Date.now().toString() + Math.random(),
        type,
        username,
        message,
        timestamp: Date.now(),
      };

      setActivities(prev => [activity, ...prev].slice(0, 50));
      setCurrentActivity(activity);

      // Hide current notification after 5 seconds
      setTimeout(() => {
        setCurrentActivity(null);
      }, 5000);
    };

    // Generate initial activity
    generateActivity();

    // Generate new activity every 10-20 seconds
    const interval = setInterval(() => {
      const delay = 10000 + Math.random() * 10000;
      setTimeout(generateActivity, delay);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'pull':
        return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'milestone':
        return <Users className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <>
      {/* Floating Notification */}
      <AnimatePresence>
        {currentActivity && (
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className="glass-card backdrop-blur-xl bg-gradient-to-r from-indigo-950/95 via-purple-950/95 to-pink-950/95 border-2 border-white/20 rounded-full px-6 py-3 shadow-2xl">
              <div className="flex items-center gap-3">
                {getIcon(currentActivity.type)}
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">@{currentActivity.username}</span>
                  <span className="text-white/70 text-sm">{currentActivity.message}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Counter Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 right-6 z-50 pointer-events-none"
      >
        <div className="glass-card bg-gradient-to-br from-purple-900/80 to-pink-900/80 border border-white/20 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <Users className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">
              {activities.length}+ active
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
