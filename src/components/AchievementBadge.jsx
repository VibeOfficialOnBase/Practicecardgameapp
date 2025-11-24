import React from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Users, Leaf, Zap, Star } from 'lucide-react';

const iconMap = {
  award: Award,
  heart: Heart,
  users: Users,
  leaf: Leaf,
  zap: Zap,
  star: Star
};

export default function AchievementBadge({ achievement, index = 0 }) {
  const Icon = iconMap[achievement.badge_icon] || Star;
  
  const colors = {
    Love: 'from-dusty-rose via-rose-400 to-pink-500',
    Empathy: 'from-soft-lavender via-purple-400 to-indigo-500',
    Community: 'from-warm-amber via-orange-400 to-terracotta',
    Healing: 'from-sage-green via-emerald-400 to-green-500',
    Empowerment: 'from-warm-amber via-orange-500 to-amber-600',
    All: 'from-pink-400 via-amber-400 to-orange-500'
  };

  const glowColors = {
    Love: 'glow-rose',
    Empathy: 'shadow-lg',
    Community: 'glow-warm',
    Healing: 'glow-sage',
    Empowerment: 'glow-warm',
    All: 'glow-warm'
  };

  const gradient = colors[achievement.leche_value] || colors.All;
  const glow = glowColors[achievement.leche_value] || 'shadow-lg';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
      className="card-organic flex items-center gap-4 p-5 cursor-pointer"
    >
      <motion.div 
        className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} ${glow}`}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-stone-800 truncate">{achievement.title}</h4>
        <p className="text-sm text-stone-500 truncate">{achievement.description}</p>
      </div>
    </motion.div>
  );
}