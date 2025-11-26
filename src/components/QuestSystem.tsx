import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Swords, Trophy, Star, Zap, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  tasks: {
    id: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
  }[];
  rewards: {
    xp: number;
    entries: number;
    special?: string;
  };
  completedAt?: number;
  expiresAt: number;
}

interface QuestSystemProps {
  username: string;
  onQuestComplete?: (quest: Quest) => void;
}

const QUEST_KEY_PREFIX = 'practice_quests_';

// Generate daily quests (reset at midnight)
const generateDailyQuests = (): Quest[] => {
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);

  return [
    {
      id: 'daily_pull',
      title: 'Daily Pull',
      description: 'Pull your daily card',
      type: 'daily',
      tasks: [
        { id: 'pull', description: 'Pull card', progress: 0, target: 1, completed: false }
      ],
      rewards: { xp: 10, entries: 1 },
      expiresAt: tomorrow.getTime()
    },
    {
      id: 'daily_journal',
      title: 'Reflect & Journal',
      description: 'Write a journal entry about your card',
      type: 'daily',
      tasks: [
        { id: 'journal', description: 'Write journal entry', progress: 0, target: 1, completed: false }
      ],
      rewards: { xp: 15, entries: 1 },
      expiresAt: tomorrow.getTime()
    },
    {
      id: 'daily_share',
      title: 'Spread Positivity',
      description: 'Share your card with the community',
      type: 'daily',
      tasks: [
        { id: 'share', description: 'Share card', progress: 0, target: 1, completed: false }
      ],
      rewards: { xp: 10, entries: 1 },
      expiresAt: tomorrow.getTime()
    }
  ];
};

// Generate weekly quests (reset on Monday)
const generateWeeklyQuests = (): Quest[] => {
  const nextMonday = new Date();
  const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7;
  nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  return [
    {
      id: 'weekly_streak',
      title: 'Week Warrior',
      description: 'Maintain your streak for 7 days',
      type: 'weekly',
      tasks: [
        { id: 'streak', description: 'Pull cards 7 days in a row', progress: 0, target: 7, completed: false }
      ],
      rewards: { xp: 100, entries: 5, special: 'Week Warrior Badge' },
      expiresAt: nextMonday.getTime()
    },
    {
      id: 'weekly_collection',
      title: 'Card Collector',
      description: 'Collect 7 different cards this week',
      type: 'weekly',
      tasks: [
        { id: 'collect', description: 'Pull 7 unique cards', progress: 0, target: 7, completed: false }
      ],
      rewards: { xp: 75, entries: 3 },
      expiresAt: nextMonday.getTime()
    },
    {
      id: 'weekly_meditation',
      title: 'Mindful Master',
      description: 'Complete 3 meditation or breathwork sessions',
      type: 'weekly',
      tasks: [
        { id: 'meditate', description: 'Complete meditation sessions', progress: 0, target: 3, completed: false }
      ],
      rewards: { xp: 80, entries: 4 },
      expiresAt: nextMonday.getTime()
    }
  ];
};

export function QuestSystem({ username, onQuestComplete }: QuestSystemProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');

  // Load and initialize quests
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(`${QUEST_KEY_PREFIX}${username}`);
      const now = Date.now();

      if (stored) {
        const loadedQuests: Quest[] = JSON.parse(stored);
        
        // Filter out expired quests
        const activeQuests = loadedQuests.filter(q => q.expiresAt > now);
        
        // Check if we need to generate new daily quests
        const hasTodaysDaily = activeQuests.some(q => q.type === 'daily');
        if (!hasTodaysDaily) {
          activeQuests.push(...generateDailyQuests());
        }
        
        // Check if we need to generate new weekly quests
        const hasThisWeeksQuests = activeQuests.some(q => q.type === 'weekly');
        if (!hasThisWeeksQuests) {
          activeQuests.push(...generateWeeklyQuests());
        }
        
        setQuests(activeQuests);
        localStorage.setItem(`${QUEST_KEY_PREFIX}${username}`, JSON.stringify(activeQuests));
      } else {
        // First time - generate initial quests
        const initialQuests = [...generateDailyQuests(), ...generateWeeklyQuests()];
        setQuests(initialQuests);
        localStorage.setItem(`${QUEST_KEY_PREFIX}${username}`, JSON.stringify(initialQuests));
      }
    } catch (error) {
      console.error('Error loading quests:', error);
    }
  }, [username]);

  // Update quest progress
  const updateQuestProgress = (questId: string, taskId: string, progress: number) => {
    const updatedQuests = quests.map(quest => {
      if (quest.id === questId) {
        const updatedTasks = quest.tasks.map(task => {
          if (task.id === taskId) {
            const newProgress = Math.min(progress, task.target);
            return {
              ...task,
              progress: newProgress,
              completed: newProgress >= task.target
            };
          }
          return task;
        });

        // Check if all tasks completed
        const allCompleted = updatedTasks.every(t => t.completed);
        const updated = {
          ...quest,
          tasks: updatedTasks,
          completedAt: allCompleted && !quest.completedAt ? Date.now() : quest.completedAt
        };

        // Celebrate completion
        if (allCompleted && !quest.completedAt) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
          });

          if (onQuestComplete) {
            onQuestComplete(updated);
          }
        }

        return updated;
      }
      return quest;
    });

    setQuests(updatedQuests);
    
    try {
      localStorage.setItem(`${QUEST_KEY_PREFIX}${username}`, JSON.stringify(updatedQuests));
    } catch (error) {
      console.error('Error saving quests:', error);
    }
  };

  // Filter quests
  const filteredQuests = quests.filter(q => {
    if (filter === 'all') return true;
    return q.type === filter;
  });

  // Calculate stats
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.completedAt).length;
  const dailyCompleted = quests.filter(q => q.type === 'daily' && q.completedAt).length;
  const weeklyCompleted = quests.filter(q => q.type === 'weekly' && q.completedAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-purple-400" />
            Quest Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{totalQuests}</p>
              <p className="text-sm text-white/60">Active</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{completedQuests}</p>
              <p className="text-sm text-white/60">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{totalQuests - completedQuests}</p>
              <p className="text-sm text-white/60">Remaining</p>
            </div>
          </div>

          {/* Daily/Weekly Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 rounded-lg">
              <p className="text-white/60 text-xs mb-1">Daily Quests</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <p className="text-white font-bold">{dailyCompleted}/3 Complete</p>
              </div>
            </div>
            <div className="glass-card p-3 rounded-lg">
              <p className="text-white/60 text-xs mb-1">Weekly Quests</p>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <p className="text-white font-bold">{weeklyCompleted}/3 Complete</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-white text-purple-900'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          All Quests
        </button>
        <button
          onClick={() => setFilter('daily')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            filter === 'daily'
              ? 'bg-white text-purple-900'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          📅 Daily
        </button>
        <button
          onClick={() => setFilter('weekly')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            filter === 'weekly'
              ? 'bg-white text-purple-900'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          🏆 Weekly
        </button>
        <button
          onClick={() => setFilter('special')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            filter === 'special'
              ? 'bg-white text-purple-900'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          ⭐ Special
        </button>
      </div>

      {/* Quests List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredQuests.map((quest) => {
            const totalProgress = quest.tasks.reduce((sum, t) => sum + t.progress, 0);
            const totalTarget = quest.tasks.reduce((sum, t) => sum + t.target, 0);
            const overallProgress = (totalProgress / totalTarget) * 100;
            const isCompleted = !!quest.completedAt;
            const timeLeft = quest.expiresAt - Date.now();
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`glass-card ${isCompleted ? 'opacity-75 border-2 border-green-500/50' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {quest.type === 'daily' && <Calendar className="w-5 h-5 text-blue-400" />}
                          {quest.type === 'weekly' && <Trophy className="w-5 h-5 text-purple-400" />}
                          {quest.type === 'special' && <Star className="w-5 h-5 text-yellow-400" />}
                          <h3 className={`text-white font-bold ${isCompleted ? 'line-through' : ''}`}>
                            {quest.title}
                          </h3>
                        </div>
                        <p className="text-white/60 text-sm">{quest.description}</p>
                      </div>
                      {isCompleted && (
                        <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full">
                          <Zap className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-xs font-bold">Complete!</span>
                        </div>
                      )}
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3 mb-4">
                      {quest.tasks.map((task) => (
                        <div key={task.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className={`text-white/80 ${task.completed ? 'line-through' : ''}`}>
                              {task.completed && '✓ '}
                              {task.description}
                            </span>
                            <span className="text-white font-bold">
                              {task.progress}/{task.target}
                            </span>
                          </div>
                          <Progress 
                            value={(task.progress / task.target) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Rewards */}
                    <div className="bg-white/5 rounded-lg p-3 mb-3">
                      <p className="text-white/60 text-xs mb-2 font-semibold">Rewards:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
                          +{quest.rewards.xp} XP
                        </span>
                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                          +{quest.rewards.entries} Entries
                        </span>
                        {quest.rewards.special && (
                          <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-xs font-bold">
                            {quest.rewards.special}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Time Left */}
                    {!isCompleted && (
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${
                          hoursLeft < 6 ? 'text-red-400' : 
                          hoursLeft < 24 ? 'text-yellow-400' : 
                          'text-white/60'
                        }`}>
                          ⏰ {hoursLeft < 1 ? 'Less than 1 hour' : 
                               hoursLeft < 24 ? `${hoursLeft} hours left` :
                               `${Math.floor(hoursLeft / 24)} days left`}
                        </p>
                        <div className="text-white/60 text-xs">
                          {overallProgress.toFixed(0)}% Complete
                        </div>
                      </div>
                    )}

                    {/* Completed At */}
                    {isCompleted && quest.completedAt && (
                      <div className="text-xs text-green-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Completed {new Date(quest.completedAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Test Button (for demo) */}
                    {!isCompleted && quest.tasks.some(t => !t.completed) && (
                      <Button
                        onClick={() => {
                          const incompleteTask = quest.tasks.find(t => !t.completed);
                          if (incompleteTask) {
                            updateQuestProgress(quest.id, incompleteTask.id, incompleteTask.progress + 1);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 glass-card text-white hover:glass-card-hover"
                      >
                        +1 Progress (Test)
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredQuests.length === 0 && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Swords className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No quests available in this category.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
