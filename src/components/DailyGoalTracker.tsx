import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Check, Flame, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: string;
}

interface DailyGoalTrackerProps {
  username: string;
  streakDay: number;
  hasPulledToday: boolean;
}

export function DailyGoalTracker({ username, streakDay, hasPulledToday }: DailyGoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoals();
  }, [username, hasPulledToday, streakDay]);

  const loadGoals = () => {
    const dailyGoals: Goal[] = [
      {
        id: 'daily_pull',
        title: 'Daily Pull',
        description: 'Pull your daily card',
        progress: hasPulledToday ? 1 : 0,
        target: 1,
        completed: hasPulledToday,
        reward: '+50 XP',
      },
      {
        id: 'streak_maintain',
        title: 'Maintain Streak',
        description: `Keep your ${streakDay}-day streak going`,
        progress: hasPulledToday ? 1 : 0,
        target: 1,
        completed: hasPulledToday,
        reward: '+25 XP',
      },
      {
        id: 'journal_entry',
        title: 'Journal Reflection',
        description: 'Write about today\'s card',
        progress: 0,
        target: 1,
        completed: false,
        reward: '+75 XP',
      },
    ];

    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem(`practice_daily_goals_${username}_${new Date().toISOString().split('T')[0]}`);
    if (savedProgress) {
      try {
        const saved = JSON.parse(savedProgress);
        dailyGoals.forEach(goal => {
          const savedGoal = saved.find((g: Goal) => g.id === goal.id);
          if (savedGoal) {
            goal.progress = savedGoal.progress;
            goal.completed = savedGoal.completed;
          }
        });
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }

    setGoals(dailyGoals);
  };

  const completeGoal = (goalId: string) => {
    setGoals(prev => {
      const updated = prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, progress: goal.target, completed: true }
          : goal
      );
      
      // Save to localStorage
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`practice_daily_goals_${username}_${today}`, JSON.stringify(updated));
      
      return updated;
    });
    
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      toast.success(`🎉 Goal completed! ${goal.reward}`);
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const overallProgress = Math.round((completedCount / totalGoals) * 100);

  return (
    <Card className="glass-card border-2 border-green-400/30 bg-gradient-to-br from-green-950/40 to-emerald-950/40">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-6 h-6 text-green-400" />
            Daily Goals
          </span>
          <span className="text-sm font-normal text-green-300">
            {completedCount}/{totalGoals}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Today's Progress</span>
            <span className="text-white font-bold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                goal.completed
                  ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-400/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {goal.completed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <Check className="w-5 h-5 text-green-400" />
                      </motion.div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/30"></div>
                    )}
                    <p className={`font-semibold ${
                      goal.completed ? 'text-green-300 line-through' : 'text-white'
                    }`}>
                      {goal.title}
                    </p>
                  </div>
                  <p className="text-white/60 text-sm ml-7">{goal.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-yellow-300 text-xs font-semibold">
                    {goal.reward}
                  </span>
                </div>
              </div>
              
              {!goal.completed && (
                <div className="ml-7 mt-2">
                  <Progress 
                    value={(goal.progress / goal.target) * 100} 
                    className="h-1.5"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Completion Bonus */}
        {completedCount === totalGoals && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-lg bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-400/50 text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            </motion.div>
            <p className="text-yellow-200 font-bold mb-1">
              All Goals Complete! 🎉
            </p>
            <p className="text-yellow-100 text-sm">
              Bonus: +100 XP
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
