import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Sparkles, Lock } from 'lucide-react';
import { allCards } from '@/data/cardsWithRarity';

interface TomorrowPreviewProps {
  username: string;
  currentStreak: number;
}

export function TomorrowPreview({ username, currentStreak }: TomorrowPreviewProps) {
  const [preview, setPreview] = useState<{
    card: typeof allCards[0] | null;
    achievement: string | null;
    bonus: string | null;
  }>({
    card: null,
    achievement: null,
    bonus: null,
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    generatePreview();
  }, [username, currentStreak]);

  const generatePreview = () => {
    // Generate a preview for tomorrow based on patterns
    const tomorrowStreak = currentStreak + 1;
    
    // Predict tomorrow's card (semi-random but deterministic)
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const seed = tomorrowDate.getTime() + username.length;
    const cardIndex = seed % allCards.length;
    const tomorrowCard = allCards[cardIndex];

    // Check for potential achievements
    let achievement = null;
    if (tomorrowStreak === 7) {
      achievement = '🎉 Unlock "Week Warrior" achievement';
    } else if (tomorrowStreak === 30) {
      achievement = '🏆 Unlock "Month Master" achievement';
    } else if (tomorrowStreak === 100) {
      achievement = '👑 Unlock "Century Sage" achievement';
    } else if (tomorrowStreak % 10 === 0) {
      achievement = `✨ Reach ${tomorrowStreak}-day milestone`;
    }

    // Predict bonuses
    const tomorrowHour = new Date(tomorrowDate).getHours();
    let bonus = null;
    if (tomorrowHour >= 5 && tomorrowHour < 12) {
      bonus = '🌅 Morning pull bonus (+25 XP)';
    } else if (tomorrowHour >= 21 || tomorrowHour < 5) {
      bonus = '🌙 Evening pull bonus (+25 XP)';
    }

    const tomorrowDay = tomorrowDate.getDay();
    if (tomorrowDay === 0 || tomorrowDay === 6) {
      bonus = '🎉 Weekend bonus (+30 XP)';
    }

    setPreview({
      card: tomorrowCard,
      achievement,
      bonus,
    });
  };

  return (
    <Card className="glass-card border-2 border-purple-400/30 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Tomorrow's Possibilities
            </h3>
            <p className="text-purple-200 text-sm">
              Here's what awaits you...
            </p>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {showPreview ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Card Preview */}
            {preview.card && (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-purple-300 text-xs uppercase tracking-wider mb-2">Tomorrow's Card</p>
                <p className="text-white font-semibold mb-1">{preview.card.affirmation}</p>
                <p className="text-white/70 text-sm">{preview.card.mission}</p>
              </div>
            )}

            {/* Achievement Preview */}
            {preview.achievement && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-400/30">
                <p className="text-yellow-300 text-sm font-semibold">{preview.achievement}</p>
              </div>
            )}

            {/* Bonus Preview */}
            {preview.bonus && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-400/30">
                <p className="text-blue-300 text-sm font-semibold">{preview.bonus}</p>
              </div>
            )}

            {/* Motivation */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/80 text-sm text-center italic">
                "Every day brings new growth. Don't miss tomorrow's practice!"
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Lock className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-50" />
            <p className="text-white/60 text-sm">
              Click the eye icon to preview tomorrow's opportunities
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
