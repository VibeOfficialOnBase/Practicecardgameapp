import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Check, X, Edit2, Trash2, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'collection' | 'meditation' | 'journal' | 'custom';
  targetValue: number;
  currentValue: number;
  createdAt: number;
  completedAt?: number;
  deadline?: number;
}

interface GoalTrackerProps {
  username: string;
  onGoalComplete?: (goal: Goal) => void;
}

const GOAL_KEY_PREFIX = 'practice_goals_';

const GOAL_CATEGORIES = [
  { id: 'streak', name: 'Streak Goals', icon: '🔥', color: 'from-orange-500 to-red-500' },
  { id: 'collection', name: 'Collection Goals', icon: '📚', color: 'from-purple-500 to-pink-500' },
  { id: 'meditation', name: 'Meditation Goals', icon: '🧘', color: 'from-cyan-500 to-blue-500' },
  { id: 'journal', name: 'Journal Goals', icon: '✍️', color: 'from-green-500 to-emerald-500' },
  { id: 'custom', name: 'Custom Goals', icon: '⭐', color: 'from-yellow-500 to-amber-500' }
];

const SUGGESTED_GOALS = [
  { title: 'Maintain 7-day streak', category: 'streak' as const, target: 7 },
  { title: 'Collect 50 cards', category: 'collection' as const, target: 50 },
  { title: 'Meditate 10 times', category: 'meditation' as const, target: 10 },
  { title: 'Write 20 journal entries', category: 'journal' as const, target: 20 },
  { title: 'Maintain 30-day streak', category: 'streak' as const, target: 30 },
  { title: 'Collect all LECHE cards', category: 'collection' as const, target: 365 },
];

export function GoalTracker({ username, onGoalComplete }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'custom' as Goal['category'],
    targetValue: 10,
    deadline: ''
  });
  const [filter, setFilter] = useState<string>('all');

  // Load goals
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(`${GOAL_KEY_PREFIX}${username}`);
      if (stored) {
        setGoals(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  }, [username]);

  // Save goals
  const saveGoals = (updatedGoals: Goal[]) => {
    try {
      localStorage.setItem(`${GOAL_KEY_PREFIX}${username}`, JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  // Add new goal
  const handleAddGoal = () => {
    if (!newGoal.title || newGoal.targetValue <= 0) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetValue: newGoal.targetValue,
      currentValue: 0,
      createdAt: Date.now(),
      deadline: newGoal.deadline ? new Date(newGoal.deadline).getTime() : undefined
    };

    saveGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'custom',
      targetValue: 10,
      deadline: ''
    });
    setShowAddGoal(false);
  };

  // Update goal progress
  const updateGoalProgress = (goalId: string, newValue: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updated = { ...goal, currentValue: Math.min(newValue, goal.targetValue) };
        
        // Check if goal is completed
        if (updated.currentValue >= updated.targetValue && !updated.completedAt) {
          updated.completedAt = Date.now();
          
          // Celebrate!
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
          });
          
          if (onGoalComplete) {
            onGoalComplete(updated);
          }
        }
        
        return updated;
      }
      return goal;
    });
    
    saveGoals(updatedGoals);
  };

  // Delete goal
  const deleteGoal = (goalId: string) => {
    saveGoals(goals.filter(g => g.id !== goalId));
  };

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.completedAt;
    if (filter === 'completed') return goal.completedAt;
    return goal.category === filter;
  });

  // Calculate stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completedAt).length;
  const activeGoals = goals.filter(g => !g.completedAt).length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-yellow-400" />
            Your Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{totalGoals}</p>
              <p className="text-sm text-white/60">Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{completedGoals}</p>
              <p className="text-sm text-white/60">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{activeGoals}</p>
              <p className="text-sm text-white/60">Active</p>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Completion Rate</span>
              <span className="text-white font-bold">{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          {/* Add Goal Button */}
          <Button
            onClick={() => setShowAddGoal(!showAddGoal)}
            variant="gradient"
            className="w-full mt-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showAddGoal ? 'Cancel' : 'Add New Goal'}
          </Button>
        </CardContent>
      </Card>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white text-lg">Create New Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Suggested Goals */}
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Quick Start</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {SUGGESTED_GOALS.map((suggested, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewGoal({
                          ...newGoal,
                          title: suggested.title,
                          category: suggested.category,
                          targetValue: suggested.target
                        })}
                        className="glass-card text-white hover:glass-card-hover text-xs"
                      >
                        {suggested.title}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="goal-title" className="text-white">Goal Title</Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Meditate 30 days"
                    className="glass-card text-white border-white/20"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="goal-description" className="text-white">Description (Optional)</Label>
                  <Input
                    id="goal-description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Why is this goal important?"
                    className="glass-card text-white border-white/20"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOAL_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewGoal({ ...newGoal, category: cat.id as Goal['category'] })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newGoal.category === cat.id
                            ? 'border-white bg-white/10'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-xl mb-1">{cat.icon}</p>
                        <p className="text-white text-xs font-semibold">{cat.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Value */}
                <div className="space-y-2">
                  <Label htmlFor="goal-target" className="text-white">Target Value</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    min="1"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) || 1 })}
                    className="glass-card text-white border-white/20"
                  />
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline" className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Deadline (Optional)
                  </Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="glass-card text-white border-white/20"
                  />
                </div>

                {/* Submit */}
                <Button
                  onClick={handleAddGoal}
                  disabled={!newGoal.title}
                  variant="gradient"
                  className="w-full"
                >
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            filter === 'active'
              ? 'bg-white text-purple-900'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            filter === 'completed'
              ? 'bg-white text-purple-900'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Completed
        </button>
        {GOAL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              filter === cat.id
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Target className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-4">No goals yet. Create your first goal!</p>
              <Button
                onClick={() => setShowAddGoal(true)}
                variant="gradient"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => {
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const isCompleted = !!goal.completedAt;
            const category = GOAL_CATEGORIES.find(c => c.id === goal.category);
            const isOverdue = goal.deadline && !isCompleted && Date.now() > goal.deadline;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`glass-card ${isCompleted ? 'opacity-75' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{category?.icon}</span>
                          <h3 className={`text-white font-bold ${isCompleted ? 'line-through' : ''}`}>
                            {goal.title}
                          </h3>
                          {isCompleted && (
                            <span className="text-green-400">
                              <Check className="w-5 h-5" />
                            </span>
                          )}
                        </div>
                        {goal.description && (
                          <p className="text-white/60 text-sm ml-8">{goal.description}</p>
                        )}
                      </div>
                      {!isCompleted && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteGoal(goal.id)}
                          className="text-white/60 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/80">Progress</span>
                        <span className="text-white font-bold">
                          {goal.currentValue} / {goal.targetValue}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Deadline */}
                    {goal.deadline && (
                      <div className={`text-xs flex items-center gap-1 mb-4 ${
                        isOverdue ? 'text-red-400' : 'text-white/60'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </div>
                    )}

                    {/* Manual Update (for custom goals) */}
                    {!isCompleted && goal.category === 'custom' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.currentValue - 1))}
                          className="glass-card text-white hover:glass-card-hover"
                        >
                          -1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateGoalProgress(goal.id, goal.currentValue + 1)}
                          className="glass-card text-white hover:glass-card-hover flex-1"
                        >
                          +1 Progress
                        </Button>
                      </div>
                    )}

                    {/* Completed At */}
                    {isCompleted && goal.completedAt && (
                      <div className="text-xs text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Completed {new Date(goal.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
