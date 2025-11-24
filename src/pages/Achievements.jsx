import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AchievementGrid from '../components/AchievementGrid';
import { achievements as allAchievements } from '../components/achievements';
import { Award, Heart, Users, Leaf, Zap, Star, Trophy } from 'lucide-react';
import { format } from 'date-fns';

const iconMap = {
  award: Award,
  heart: Heart,
  users: Users,
  leaf: Leaf,
  zap: Zap,
  star: Star,
  trophy: Trophy
};

export default function Achievements() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const { data: userAchievements = [], isLoading } = useQuery({
    queryKey: ['achievements', user?.email],
    queryFn: () => base44.entities.Achievement.filter(
      { created_by: user?.email },
      '-earned_date'
    ),
    enabled: !!user,
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user,
  });

  const { data: practices = [] } = useQuery({
    queryKey: ['practices', user?.email],
    queryFn: () => base44.entities.DailyPractice.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const unlockedIds = userAchievements.map(a => a.title.toLowerCase().replace(/\s+/g, '_'));
  
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

  const colors = {
    Love: { bg: 'from-rose-400 to-pink-500', text: 'text-rose-700' },
    Empathy: { bg: 'from-blue-400 to-indigo-500', text: 'text-blue-700' },
    Community: { bg: 'from-purple-400 to-violet-500', text: 'text-purple-700' },
    Healing: { bg: 'from-emerald-400 to-green-500', text: 'text-green-700' },
    Empowerment: { bg: 'from-amber-400 to-orange-500', text: 'text-amber-700' },
    All: { bg: 'from-pink-400 via-purple-400 to-amber-400', text: 'text-stone-700' }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-600" />
        <h1 className="text-4xl font-bold text-stone-800 mb-2">Achievements</h1>
        <p className="text-stone-600 text-lg">Celebrating your growth and dedication</p>
        <div className="mt-4 flex justify-center gap-4">
          <div className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-medium">
            {unlockedIds.length} / {allAchievements.length} Unlocked
          </div>
        </div>
      </div>

      <AchievementGrid 
        achievements={allAchievements}
        unlockedAchievements={unlockedIds}
        progress={progress}
      />
    </div>
  );
}