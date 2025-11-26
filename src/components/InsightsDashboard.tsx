import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  Calendar,
  Sparkles,
  Target,
  Brain,
  Sun,
  Moon,
  Flame
} from 'lucide-react';
import { getUserPulls } from '@/utils/pullTracking';
import { allCards } from '@/data/cardsWithRarity';

interface InsightsDashboardProps {
  username: string;
}

export function InsightsDashboard({ username }: InsightsDashboardProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeUserBehavior();
  }, [username]);

  const analyzeUserBehavior = () => {
    const pulls = getUserPulls(username);
    
    if (pulls.length === 0) {
      setLoading(false);
      return;
    }

    // Analyze pull times
    const pullTimes = pulls.map(p => new Date(p.date).getHours());
    const timeFrequency: Record<number, number> = {};
    pullTimes.forEach(hour => {
      timeFrequency[hour] = (timeFrequency[hour] || 0) + 1;
    });

    const optimalTime = Object.entries(timeFrequency)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    // Analyze day patterns
    const dayPatterns = pulls.map(p => new Date(p.date).getDay());
    const dayFrequency: Record<number, number> = {};
    dayPatterns.forEach(day => {
      dayFrequency[day] = (dayFrequency[day] || 0) + 1;
    });

    const mostActiveDays = Object.entries(dayFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([day]) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(day)]);

    // Calculate engagement trends
    const last7Days = pulls.slice(-7);
    const last30Days = pulls.slice(-30);
    const trend = last7Days.length > 3 ? 'improving' : 'stable';

    // Most pulled cards
    const cardFrequency: Record<number, number> = {};
    pulls.forEach(p => {
      cardFrequency[p.cardId] = (cardFrequency[p.cardId] || 0) + 1;
    });

    const favoriteCards = Object.entries(cardFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => allCards.find(c => c.id === parseInt(id)))
      .filter(Boolean);

    // AI-powered suggestions
    const suggestions = generateSuggestions(pulls, trend, optimalTime);

    setInsights({
      optimalTime: parseInt(optimalTime || '9'),
      mostActiveDays,
      trend,
      favoriteCards,
      suggestions,
      totalPulls: pulls.length,
      last7DaysPulls: last7Days.length,
      last30DaysPulls: last30Days.length,
    });

    setLoading(false);
  };

  const generateSuggestions = (pulls: any[], trend: string, optimalTime: string | undefined) => {
    const suggestions = [];

    if (optimalTime) {
      const hour = parseInt(optimalTime);
      if (hour >= 5 && hour < 12) {
        suggestions.push({
          icon: <Sun className="w-5 h-5 text-yellow-400" />,
          text: `You're most consistent in the morning (${hour}:00). Keep this routine!`,
        });
      } else if (hour >= 21 || hour < 5) {
        suggestions.push({
          icon: <Moon className="w-5 h-5 text-blue-400" />,
          text: `Evening pulls (${hour}:00) work best for you. Set a reminder!`,
        });
      }
    }

    if (trend === 'improving') {
      suggestions.push({
        icon: <TrendingUp className="w-5 h-5 text-green-400" />,
        text: "Your engagement is trending up! You're building great momentum.",
      });
    }

    if (pulls.length >= 7) {
      suggestions.push({
        icon: <Flame className="w-5 h-5 text-orange-400" />,
        text: "You're on fire! Maintain your streak for exclusive rewards.",
      });
    }

    suggestions.push({
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      text: "Try pulling at different times to discover new patterns in your practice.",
    });

    return suggestions;
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-3 border-purple-400 mb-3"></div>
          <p className="text-white">Analyzing your practice patterns...</p>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <p className="text-white">Start pulling cards to unlock personalized insights!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">🧠 Your Practice Insights</h2>
        <p className="text-gray-300">
          AI-powered analysis of your journey
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-white/60 text-xs mb-1">7 Days</p>
            <p className="text-white font-bold text-2xl">{insights.last7DaysPulls}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-white/60 text-xs mb-1">30 Days</p>
            <p className="text-white font-bold text-2xl">{insights.last30DaysPulls}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-white/60 text-xs mb-1">Total</p>
            <p className="text-white font-bold text-2xl">{insights.totalPulls}</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            AI-Powered Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.suggestions.map((suggestion: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              {suggestion.icon}
              <p className="text-white text-sm">{suggestion.text}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Optimal Times */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            Your Best Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-900/20">
            <div>
              <p className="text-white font-semibold">Optimal Pull Time</p>
              <p className="text-blue-300 text-sm">Based on your history</p>
            </div>
            <p className="text-3xl font-bold text-white">{insights.optimalTime}:00</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20">
            <div>
              <p className="text-white font-semibold">Most Active Days</p>
              <p className="text-purple-300 text-sm">When you practice most</p>
            </div>
            <p className="text-lg font-bold text-white">{insights.mostActiveDays.join(', ')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Cards */}
      {insights.favoriteCards.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-pink-400" />
              Your Resonating Cards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.favoriteCards.map((card: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-400/30"
              >
                <p className="text-white font-semibold mb-1">{card.affirmation}</p>
                <p className="text-pink-300 text-sm">{card.mission}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trend */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            {insights.trend === 'improving' ? (
              <TrendingUp className="w-10 h-10 text-green-400" />
            ) : (
              <Calendar className="w-10 h-10 text-blue-400" />
            )}
            <div className="flex-1">
              <p className="text-white font-bold text-lg">
                {insights.trend === 'improving' ? 'Growing Strong! 📈' : 'Steady Practice 📊'}
              </p>
              <p className="text-white/70 text-sm">
                {insights.trend === 'improving' 
                  ? 'Your consistency is improving. Keep building momentum!'
                  : 'You are maintaining a stable practice. Try challenging yourself with new goals!'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
