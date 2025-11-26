import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Smile, Frown, Meh, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note: string;
  timestamp: number;
}

interface MoodTrackerProps {
  username: string;
  onMoodLog?: (mood: number) => void;
}

const MOOD_KEY_PREFIX = 'practice_mood_';

const MOODS = [
  { value: 1, emoji: '😢', label: 'Struggling', color: 'from-red-500 to-rose-500' },
  { value: 2, emoji: '😕', label: 'Not Great', color: 'from-orange-500 to-amber-500' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'from-yellow-500 to-amber-500' },
  { value: 4, emoji: '😊', label: 'Good', color: 'from-green-500 to-emerald-500' },
  { value: 5, emoji: '😄', label: 'Amazing', color: 'from-cyan-500 to-blue-500' },
];

export function MoodTracker({ username, onMoodLog }: MoodTrackerProps) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [showInsights, setShowInsights] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Load moods
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(`${MOOD_KEY_PREFIX}${username}`);
      if (stored) {
        const loadedMoods: MoodEntry[] = JSON.parse(stored);
        setMoods(loadedMoods);
        
        // Check if mood logged today
        const todayEntry = loadedMoods.find(m => m.date === today);
        if (todayEntry) {
          setTodayMood(todayEntry.mood);
          setNote(todayEntry.note);
        }
      }
    } catch (error) {
      console.error('Error loading moods:', error);
    }
  }, [username, today]);

  // Save mood
  const handleSaveMood = (moodValue: number) => {
    const entry: MoodEntry = {
      date: today,
      mood: moodValue as MoodEntry['mood'],
      note: note,
      timestamp: Date.now()
    };

    const updatedMoods = moods.filter(m => m.date !== today);
    updatedMoods.push(entry);
    
    try {
      localStorage.setItem(`${MOOD_KEY_PREFIX}${username}`, JSON.stringify(updatedMoods));
      setMoods(updatedMoods);
      setTodayMood(moodValue);
      
      if (onMoodLog) {
        onMoodLog(moodValue);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  // Calculate insights
  const calculateInsights = () => {
    if (moods.length === 0) return null;

    const last7Days = moods.slice(-7);
    const last30Days = moods.slice(-30);
    
    const avgLast7 = last7Days.reduce((sum, m) => sum + m.mood, 0) / last7Days.length;
    const avgLast30 = last30Days.reduce((sum, m) => sum + m.mood, 0) / last30Days.length;
    
    const bestDay = [...moods].sort((a, b) => b.mood - a.mood)[0];
    const mostCommonMood = moods.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const mostFrequent = Object.entries(mostCommonMood).sort((a, b) => b[1] - a[1])[0];

    return {
      avgLast7,
      avgLast30,
      trend: avgLast7 > avgLast30 ? 'improving' : avgLast7 < avgLast30 ? 'declining' : 'stable',
      bestDay,
      mostCommon: mostFrequent ? parseInt(mostFrequent[0]) : 3,
      totalEntries: moods.length
    };
  };

  const insights = calculateInsights();

  return (
    <div className="space-y-6">
      {/* Today's Mood */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Smile className="w-6 h-6 text-yellow-400" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selector */}
          <div className="grid grid-cols-5 gap-3">
            {MOODS.map((mood) => (
              <motion.button
                key={mood.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSaveMood(mood.value)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  todayMood === mood.value
                    ? `border-white bg-gradient-to-br ${mood.color} shadow-lg`
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <p className="text-white text-xs font-semibold">{mood.label}</p>
                {todayMood === mood.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  >
                    <span className="text-green-600 text-sm">✓</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Note */}
          {todayMood !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="text-white text-sm font-semibold">
                What's on your mind? (Optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reflect on your mood..."
                className="glass-card text-white border-white/20 resize-none"
                rows={3}
              />
              <Button
                onClick={() => handleSaveMood(todayMood)}
                variant="outline"
                size="sm"
                className="glass-card text-white hover:glass-card-hover"
              >
                Update Note
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      {insights && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                Mood Insights
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInsights(!showInsights)}
                className="text-white/60 hover:text-white"
              >
                {showInsights ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showInsights && (
            <CardContent className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-lg">
                  <p className="text-white/60 text-xs mb-1">7-Day Average</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{MOODS.find(m => m.value === Math.round(insights.avgLast7))?.emoji}</span>
                    <p className="text-white text-2xl font-bold">{insights.avgLast7.toFixed(1)}</p>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <p className="text-white/60 text-xs mb-1">30-Day Average</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{MOODS.find(m => m.value === Math.round(insights.avgLast30))?.emoji}</span>
                    <p className="text-white text-2xl font-bold">{insights.avgLast30.toFixed(1)}</p>
                  </div>
                </div>
              </div>

              {/* Trend */}
              <div className={`p-4 rounded-lg ${
                insights.trend === 'improving' ? 'bg-green-500/20' :
                insights.trend === 'declining' ? 'bg-red-500/20' :
                'bg-blue-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {insights.trend === 'improving' && <TrendingUp className="w-5 h-5 text-green-400" />}
                  {insights.trend === 'declining' && <TrendingDown className="w-5 h-5 text-red-400" />}
                  {insights.trend === 'stable' && <Activity className="w-5 h-5 text-blue-400" />}
                  <p className={`font-bold text-sm ${
                    insights.trend === 'improving' ? 'text-green-400' :
                    insights.trend === 'declining' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {insights.trend === 'improving' ? 'Improving Trend! 📈' :
                     insights.trend === 'declining' ? 'Needs Attention 📉' :
                     'Stable Mood 📊'}
                  </p>
                </div>
                <p className="text-white/80 text-xs">
                  {insights.trend === 'improving' && 'Your mood is trending upward! Keep up the great work! 🌟'}
                  {insights.trend === 'declining' && 'Consider self-care activities or talking to someone you trust. 💙'}
                  {insights.trend === 'stable' && 'Your mood has been consistent. Keep maintaining your balance! ⚖️'}
                </p>
              </div>

              {/* Most Common Mood */}
              <div className="glass-card p-4 rounded-lg">
                <p className="text-white/60 text-xs mb-2">Most Common Mood</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{MOODS.find(m => m.value === insights.mostCommon)?.emoji}</span>
                  <div>
                    <p className="text-white font-bold">{MOODS.find(m => m.value === insights.mostCommon)?.label}</p>
                    <p className="text-white/60 text-xs">Appears most frequently</p>
                  </div>
                </div>
              </div>

              {/* Best Day */}
              {insights.bestDay && (
                <div className="glass-card p-4 rounded-lg">
                  <p className="text-white/60 text-xs mb-2">Your Best Day</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{MOODS.find(m => m.value === insights.bestDay.mood)?.emoji}</span>
                    <div>
                      <p className="text-white font-bold">{new Date(insights.bestDay.date).toLocaleDateString()}</p>
                      {insights.bestDay.note && (
                        <p className="text-white/80 text-xs mt-1 italic">"{insights.bestDay.note}"</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Total Entries */}
              <div className="text-center">
                <p className="text-white/60 text-xs">
                  You've logged your mood {insights.totalEntries} times!
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Recent History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          {moods.length === 0 ? (
            <div className="text-center py-8">
              <Meh className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No mood entries yet. Log your first one above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {moods.slice(-7).reverse().map((entry) => {
                const moodData = MOODS.find(m => m.value === entry.mood);
                return (
                  <div
                    key={entry.timestamp}
                    className="glass-card p-4 rounded-lg flex items-start gap-3"
                  >
                    <span className="text-3xl">{moodData?.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-semibold">{moodData?.label}</p>
                        <p className="text-white/60 text-xs">{new Date(entry.date).toLocaleDateString()}</p>
                      </div>
                      {entry.note && (
                        <p className="text-white/80 text-sm italic">"{entry.note}"</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
