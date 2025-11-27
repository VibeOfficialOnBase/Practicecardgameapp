import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/supabase';
import { appApi } from '@/api/supabaseClient';
import AchievementGrid from '../components/AchievementGrid';
import { achievements as allAchievements } from '../components/achievements';
import { Award, Heart, Users, Leaf, Zap, Star, Trophy, Target, Flame, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Section from '../components/common/Section';

export default function Wins() {
  const { user } = useAuth();

  const { data: userAchievements = [], isLoading } = useQuery({
    queryKey: ['achievements', user?.email],
    queryFn: () => appApi.entities.Achievement.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => getUserProfile(user?.email || user?.id),
    enabled: !!user,
  });

  const { data: practices = [] } = useQuery({
    queryKey: ['practices', user?.email],
    queryFn: () => appApi.entities.DailyPractice.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const unlockedIds = userAchievements.map(a => a.title?.toLowerCase().replace(/\s+/g, '_') || '');
  
  const progress = {
    first_connection: practices.length > 0 ? 1 : 0,
    new_member: practices.length > 0 ? 1 : 0,
    regular: userProfile?.current_streak || 0,
    pillar: userProfile?.current_streak || 0,
    daily_presence: userProfile?.total_practices_completed || 0,
    growth_mindset: practices.filter(p => p.reflection).length,
    transformation: userProfile?.current_streak || 0,
    centurion: userProfile?.current_streak || 0,
    year_of_practice: userProfile?.current_streak || 0,
    reflection_master: practices.filter(p => p.reflection).length,
    five_star: practices.filter(p => p.rating === 5).length,
  };

  // Stats for summary section
  const stats = [
    {
      icon: Trophy,
      label: 'Achievements',
      value: unlockedIds.length,
      max: allAchievements.length,
      color: 'text-amber-400'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: userProfile?.current_streak || 0,
      suffix: 'days',
      color: 'text-orange-400'
    },
    {
      icon: Target,
      label: 'Practices',
      value: practices.length,
      color: 'text-purple-400'
    },
    {
      icon: Star,
      label: 'Perfect Days',
      value: practices.filter(p => p.rating === 5).length,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Your Wins"
        subtitle="Celebrating your growth and dedication"
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                  {stat.max && <span className="text-sm text-[var(--text-secondary)]">/{stat.max}</span>}
                  {stat.suffix && <span className="text-sm text-[var(--text-secondary)] ml-1">{stat.suffix}</span>}
                </div>
                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-[var(--text-primary)]">Achievement Progress</span>
          <span className="text-sm text-[var(--accent-primary)]">
            {unlockedIds.length} / {allAchievements.length}
          </span>
        </div>
        <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedIds.length / allAchievements.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-2 text-center">
          {allAchievements.length - unlockedIds.length} achievements left to unlock!
        </p>
      </Card>

      {/* Achievement Grid */}
      <Section title="All Achievements">
        <AchievementGrid 
          achievements={allAchievements}
          unlockedAchievements={unlockedIds}
          progress={progress}
        />
      </Section>

      {/* Recently Unlocked */}
      {userAchievements.length > 0 && (
        <Section title="Recently Unlocked">
          <div className="space-y-2">
            {userAchievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-3 flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--text-primary)] truncate">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {achievement.earned_date && format(new Date(achievement.earned_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
