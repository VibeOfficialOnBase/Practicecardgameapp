import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  TrendingUp, 
  Award, 
  Heart,
  Flame,
  Share2,
  Download
} from 'lucide-react';
import { getUserPulls } from '@/utils/pullTracking';
import { getUserAchievements } from '@/utils/achievementsTracking';
import { getLevelInfo } from '@/utils/xpTracking';
import { toPng } from 'html-to-image';

interface WeeklyDigestProps {
  username: string;
}

export function WeeklyDigest({ username }: WeeklyDigestProps) {
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const digestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateWeeklyDigest();
  }, [username]);

  const generateWeeklyDigest = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const allPulls = getUserPulls(username);
    const weekPulls = allPulls.filter(p => new Date(p.date) >= weekAgo);

    const allAchievements = getUserAchievements(username);
    const weekAchievements = allAchievements.filter(a => {
      const unlockDate = new Date(a.unlockedAt || 0);
      return unlockDate >= weekAgo;
    });

    const levelInfo = getLevelInfo(username);

    // Calculate streak
    let streak = 0;
    if (allPulls.length > 0) {
      streak = 1;
      for (let i = allPulls.length - 1; i > 0; i--) {
        const current = new Date(allPulls[i].date);
        const prev = new Date(allPulls[i - 1].date);
        const diffTime = Math.abs(current.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    // Calculate consistency
    const consistency = Math.round((weekPulls.length / 7) * 100);

    setWeeklyStats({
      pulls: weekPulls.length,
      achievements: weekAchievements.length,
      streak,
      consistency,
      level: levelInfo.level,
      xpGained: levelInfo.currentXP,
      totalPulls: allPulls.length,
    });

    setLoading(false);
  };

  const handleShareDigest = async () => {
    if (!digestRef.current) return;

    try {
      const dataUrl = await toPng(digestRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'weekly-practice-digest.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My PRACTICE Week',
          text: `Check out my PRACTICE progress this week! 🌟`,
        });
      } else {
        // Fallback to download
        const link = document.createElement('a');
        link.download = 'weekly-practice-digest.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Error sharing digest:', error);
    }
  };

  if (loading || !weeklyStats) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Your Week in Review
          </span>
          <Button
            onClick={handleShareDigest}
            size="sm"
            variant="outline"
            className="glass-card text-white border-white/20 hover:bg-white/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={digestRef} className="space-y-6 p-4 rounded-lg bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">PRACTICE</h2>
            <p className="text-purple-200">Your Weekly Journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-lg text-center">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{weeklyStats.streak}</p>
              <p className="text-white/60 text-xs">Day Streak</p>
            </div>

            <div className="glass-card p-4 rounded-lg text-center">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{weeklyStats.pulls}</p>
              <p className="text-white/60 text-xs">Cards Pulled</p>
            </div>

            <div className="glass-card p-4 rounded-lg text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{weeklyStats.achievements}</p>
              <p className="text-white/60 text-xs">Achievements</p>
            </div>

            <div className="glass-card p-4 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl">{weeklyStats.consistency}%</p>
              <p className="text-white/60 text-xs">Consistency</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="glass-card p-4 rounded-lg">
            <p className="text-purple-300 text-sm font-semibold mb-3">This Week's Highlights</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <span>✨</span>
                <span>Maintained {weeklyStats.consistency}% consistency</span>
              </div>
              {weeklyStats.achievements > 0 && (
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>🏆</span>
                  <span>Unlocked {weeklyStats.achievements} new achievement{weeklyStats.achievements !== 1 ? 's' : ''}</span>
                </div>
              )}
              {weeklyStats.streak >= 7 && (
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>🔥</span>
                  <span>Week-long streak! You're on fire!</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white text-sm">
                <span>⭐</span>
                <span>Level {weeklyStats.level} • {weeklyStats.totalPulls} total pulls</span>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-white/80 text-sm italic">
              "Keep up the incredible momentum! 🚀"
            </p>
            <p className="text-purple-300 text-xs mt-2">@{username}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleShareDigest}
            variant="gradient"
            size="sm"
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share on Social
          </Button>
          <Button
            onClick={async () => {
              if (!digestRef.current) return;
              const dataUrl = await toPng(digestRef.current);
              const link = document.createElement('a');
              link.download = 'weekly-practice-digest.png';
              link.href = dataUrl;
              link.click();
            }}
            variant="outline"
            size="sm"
            className="glass-card text-white border-white/20 hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


