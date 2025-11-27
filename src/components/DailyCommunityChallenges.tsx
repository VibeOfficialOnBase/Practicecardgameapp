import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Target, Trophy, Users, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGlobalCommunityStats } from '@/hooks/useGlobalCommunityStats';

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'total_pulls' | 'total_achievements' | 'total_users' | 'rare_cards';
  target: number;
  current: number;
  reward: string;
  expiresAt: Date;
  completed: boolean;
}

// Get daily challenges based on real community stats
const getDailyChallenges = (stats: {
  cardsToday: number;
  cardsThisWeek: number;
  totalUsers: number;
  totalAchievements: number;
}): CommunityChallenge[] => {
  const today = new Date().toDateString();
  
  // Dynamic targets that scale with community size
  const pullTarget = Math.max(50, Math.floor(stats.totalUsers * 3)); // 3 cards per user
  const achievementTarget = Math.max(20, Math.floor(stats.totalUsers * 1.5)); // 1.5 achievements per user
  const userTarget = Math.max(10, Math.floor(stats.totalUsers * 1.2)); // 20% growth
  
  return [
    {
      id: `daily-pulls-${today}`,
      title: '🎴 Community Card Pull Challenge',
      description: `Pull ${pullTarget.toLocaleString()} cards together as a community today!`,
      type: 'total_pulls',
      target: pullTarget,
      current: stats.cardsToday,
      reward: '50 XP + Special Card Glow Effect',
      expiresAt: new Date(new Date().setHours(23, 59, 59)),
      completed: false,
    },
    {
      id: `daily-achievements-${today}`,
      title: '🏆 Achievement Hunters',
      description: `Unlock ${achievementTarget.toLocaleString()} achievements across the community!`,
      type: 'total_achievements',
      target: achievementTarget,
      current: stats.totalAchievements,
      reward: 'Exclusive "Community Champion" Badge',
      expiresAt: new Date(new Date().setHours(23, 59, 59)),
      completed: false,
    },
    {
      id: `daily-users-${today}`,
      title: '👥 Community Growth',
      description: `Welcome ${userTarget.toLocaleString()} total users to PRACTICE!`,
      type: 'total_users',
      target: userTarget,
      current: stats.totalUsers,
      reward: '100 XP + Founder Badge',
      expiresAt: new Date(new Date().setHours(23, 59, 59)),
      completed: false,
    },
  ];
};

export function DailyCommunityChallenges() {
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  
  // Get real community stats from Supabase
  const stats = useGlobalCommunityStats();
  const loading = !stats.connected;

  useEffect(() => {
    if (!loading && stats) {
      const newChallenges = getDailyChallenges({
        cardsToday: stats.pullsToday,
        cardsThisWeek: stats.pullsThisWeek,
        totalUsers: stats.totalUsers,
        totalAchievements: stats.totalAchievements,
      });
      
      // Check for newly completed challenges and trigger confetti
      newChallenges.forEach(challenge => {
        const isCompleted = challenge.current >= challenge.target;
        const wasCompleted = completedChallenges.has(challenge.id);
        
        if (isCompleted && !wasCompleted) {
          confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
            startVelocity: 40,
            gravity: 0.9,
          });
          setCompletedChallenges(prev => new Set([...prev, challenge.id]));
        }
      });
      
      setChallenges(newChallenges.map(c => ({
        ...c,
        completed: c.current >= c.target,
      })));
    }
  }, [loading, stats, completedChallenges]);

  useEffect(() => {
    // Update countdown timer
    const timerInterval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'total_pulls': return Target;
      case 'total_achievements': return Trophy;
      case 'total_users': return Users;
      default: return Users;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card glass-card-glow border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Daily Community Challenges
            </CardTitle>
            <p className="text-white/60 text-sm">Connecting to community...</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 rounded-xl border border-indigo-400/30 animate-pulse">
                <div className="h-20 bg-white/5 rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card glass-card-glow border-purple-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Daily Community Challenges
            </CardTitle>
            <div className="flex items-center gap-2 glass-card px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-semibold text-white">{timeRemaining}</span>
            </div>
          </div>
          <p className="text-white/60 text-sm">Work together to unlock rewards for everyone!</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge, index) => {
            const Icon = getIcon(challenge.type);
            const progress = (challenge.current / challenge.target) * 100;
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card glass-card-hover p-4 rounded-xl border ${
                  challenge.completed 
                    ? 'border-green-400/50 bg-green-900/20' 
                    : 'border-indigo-400/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    challenge.completed ? 'bg-green-500/20' : 'bg-indigo-500/20'
                  }`}>
                    {challenge.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <Icon className="w-6 h-6 text-indigo-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-1">{challenge.title}</h3>
                    <p className="text-white/60 text-sm mb-3">{challenge.description}</p>
                    
                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-white/80 mb-1">
                        <span>{challenge.current.toLocaleString()} / {challenge.target.toLocaleString()}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2 bg-white/10"
                      />
                    </div>
                    
                    {/* Reward */}
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      challenge.completed
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                    }`}>
                      <Trophy className="w-3 h-3" />
                      {challenge.completed ? 'Reward Unlocked!' : `Reward: ${challenge.reward}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
