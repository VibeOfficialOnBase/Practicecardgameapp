import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Trophy,
  Sparkles,
  Share2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  completed: boolean;
}

interface DailyChallengeWidgetProps {
  username: string;
  onChallengeComplete?: (challengeId: string) => void;
}

export function DailyChallengeWidget({ username, onChallengeComplete }: DailyChallengeWidgetProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  // Generate daily challenges (would be from backend in production)
  useEffect(() => {
    const storageKey = `practice_daily_challenges_${username}_${new Date().toDateString()}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      setChallenges(JSON.parse(saved));
    } else {
      const dailyChallenges: Challenge[] = [
        {
          id: 'pull_card',
          title: 'Pull Your Card',
          description: 'Pull today\'s PRACTICE card',
          reward: 5,
          icon: '🎴',
          completed: false
        },
        {
          id: 'journal',
          title: 'Journal Your Thoughts',
          description: 'Write at least 50 words in your journal',
          reward: 5,
          icon: '📝',
          completed: false
        },
        {
          id: 'share',
          title: 'Share the Magic',
          description: 'Share your card on social media',
          reward: 3,
          icon: '✨',
          completed: false
        },
        {
          id: 'meditate',
          title: 'Take 5 Minutes',
          description: 'Complete a meditation or breathwork session',
          reward: 5,
          icon: '🧘',
          completed: false
        },
        {
          id: 'support',
          title: 'Support Someone',
          description: 'Like or comment on a community post',
          reward: 2,
          icon: '💜',
          completed: false
        }
      ];
      setChallenges(dailyChallenges);
      localStorage.setItem(storageKey, JSON.stringify(dailyChallenges));
    }
  }, [username]);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalRewards = challenges.reduce((sum, c) => sum + (c.completed ? c.reward : 0), 0);
  const maxRewards = challenges.reduce((sum, c) => sum + c.reward, 0);
  const progress = (completedCount / challenges.length) * 100;

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => {
      const updated = prev.map(c => 
        c.id === challengeId ? { ...c, completed: true } : c
      );
      
      // Save to localStorage
      const storageKey = `practice_daily_challenges_${username}_${new Date().toDateString()}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      return updated;
    });

    // Celebrate
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#34D399', '#60A5FA', '#A78BFA'],
    });

    // Check if all complete
    const updatedCompleted = completedCount + 1;
    if (updatedCompleted === challenges.length) {
      setTimeout(() => {
        setCelebrating(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
          startVelocity: 60,
        });
        
        setTimeout(() => setCelebrating(false), 3000);
      }, 300);
    }

    if (onChallengeComplete) {
      onChallengeComplete(challengeId);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-xl shadow-xl">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        <div className="relative z-10 p-6">
          {/* Header */}
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-lg">Daily Challenges</h3>
                <p className="text-white/70 text-sm">
                  {completedCount}/{challenges.length} complete • +{totalRewards} entries
                </p>
              </div>
            </div>
            
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar className="w-5 h-5 text-white/60" />
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress value={progress} className="h-3 bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </Progress>
            <p className="text-white/60 text-xs mt-1 text-center">
              Complete all for +{maxRewards} giveaway entries! 🎁
            </p>
          </div>

          {/* Challenge List (Expandable) */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-4 transition-all duration-200 ${
                      challenge.completed 
                        ? 'bg-green-900/30 border-green-400/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => !challenge.completed && completeChallenge(challenge.id)}
                          disabled={challenge.completed}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {challenge.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-white/40 hover:text-white/60 transition-colors" />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{challenge.icon}</span>
                            <h4 className={`font-semibold ${
                              challenge.completed ? 'text-green-300 line-through' : 'text-white'
                            }`}>
                              {challenge.title}
                            </h4>
                          </div>
                          <p className="text-white/60 text-sm">
                            {challenge.description}
                          </p>
                        </div>

                        {/* Reward */}
                        <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-bold ${
                          challenge.completed 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          +{challenge.reward}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* All Complete Celebration */}
          <AnimatePresence>
            {celebrating && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-20"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-white text-2xl font-black mb-2">
                    All Challenges Complete! 🎉
                  </h3>
                  <p className="text-white/90 text-lg font-bold">
                    +{maxRewards} Giveaway Entries Earned!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
