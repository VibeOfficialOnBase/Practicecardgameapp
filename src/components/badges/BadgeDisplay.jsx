import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Heart, Sparkles, Users, Flame, Shield } from 'lucide-react';

const badgeIcons = {
  '100_day_streak': Flame,
  '365_day_streak': Trophy,
  'master_collaborator': Users,
  'token_holder': Star,
  'early_adopter': Sparkles,
  'community_builder': Heart,
  'wisdom_keeper': Shield,
  'practice_champion': Award,
  'buddy_mentor': Users,
  'reflection_master': Sparkles
};

const tierColors = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600'
};

const tierGlows = {
  bronze: 'shadow-[0_0_20px_rgba(217,119,6,0.5)]',
  silver: 'shadow-[0_0_20px_rgba(148,163,184,0.5)]',
  gold: 'shadow-[0_0_30px_rgba(250,204,21,0.7)]',
  platinum: 'shadow-[0_0_40px_rgba(168,85,247,0.8)]'
};

export default function BadgeDisplay({ badges, compact = false }) {
  if (!badges || badges.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 5).map((badge, idx) => {
          const Icon = badgeIcons[badge.badge_type] || Award;
          const tierColor = tierColors[badge.tier] || tierColors.bronze;
          const tierGlow = tierGlows[badge.tier] || tierGlows.bronze;
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${tierColor} flex items-center justify-center ${tierGlow}`}
              title={badge.badge_title}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
          );
        })}
        {badges.length > 5 && (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
            +{badges.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge, idx) => {
        const Icon = badgeIcons[badge.badge_type] || Award;
        const tierColor = tierColors[badge.tier] || tierColors.bronze;
        const tierGlow = tierGlows[badge.tier] || tierGlows.bronze;
        
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`card-organic p-4 text-center ${tierGlow}`}
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tierColor} flex items-center justify-center mx-auto mb-3`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{badge.badge_title}</h3>
            <p className="text-xs text-slate-600">{badge.badge_description}</p>
            <p className="text-xs text-slate-400 mt-2 capitalize">{badge.tier} Tier</p>
          </motion.div>
        );
      })}
    </div>
  );
}