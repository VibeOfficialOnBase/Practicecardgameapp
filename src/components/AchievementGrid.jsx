import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Leaf, Zap, Trophy, Award, Star, Flame, Sparkles, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  Heart, Users, Leaf, Zap, Trophy, Award, Star, Flame, Sparkles
};

const categoryColors = {
  Love: 'from-rose-400 to-pink-500',
  Empathy: 'from-blue-400 to-indigo-500',
  Community: 'from-purple-400 to-violet-500',
  Healing: 'from-emerald-400 to-green-500',
  Empowerment: 'from-amber-400 to-orange-500'
};

const tierColors = {
  bronze: 'bg-amber-600',
  silver: 'bg-slate-400',
  gold: 'bg-yellow-500'
};

export default function AchievementGrid({ achievements, unlockedAchievements = [], progress = {} }) {
  const [filter, setFilter] = useState('all');

  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.category === filter);

  const isUnlocked = (achievementId) => unlockedAchievements.includes(achievementId);
  const getProgress = (achievementId) => progress[achievementId] || 0;

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-stone-600 hover:bg-amber-50'
          }`}
        >
          All
        </button>
        {['Love', 'Empathy', 'Community', 'Healing', 'Empowerment'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === cat
                ? 'bg-amber-600 text-white'
                : 'bg-white text-stone-600 hover:bg-amber-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => {
          const Icon = iconMap[achievement.icon] || Star;
          const unlocked = isUnlocked(achievement.id);
          const currentProgress = getProgress(achievement.id);
          const progressPercent = Math.min(100, (currentProgress / achievement.requirement) * 100);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-2xl p-6 shadow-lg border-2 transition-all ${
                unlocked
                  ? `bg-gradient-to-br ${categoryColors[achievement.category]} border-transparent`
                  : 'bg-white border-stone-200 opacity-60'
              }`}
            >
              {!unlocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-stone-400" />
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${unlocked ? 'bg-white/20' : 'bg-stone-100'}`}>
                  <Icon className={`w-8 h-8 ${unlocked ? 'text-white' : 'text-stone-400'}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${unlocked ? 'text-white' : 'text-stone-800'}`}>
                    {achievement.title}
                  </h3>
                  <Badge className={`${tierColors[achievement.tier]} text-white text-xs`}>
                    {achievement.tier.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <p className={`text-sm mb-4 ${unlocked ? 'text-white/90' : 'text-stone-600'}`}>
                {achievement.description}
              </p>

              {!unlocked && (
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-stone-600">Progress</span>
                    <span className="font-medium text-stone-800">
                      {currentProgress} / {achievement.requirement}
                    </span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {unlocked && (
                <p className="text-white/90 text-xs italic mt-4">
                  ✨ {achievement.unlockedMessage}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}