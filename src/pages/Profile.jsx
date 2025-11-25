import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/supabase';
import { appApi } from '@/api/supabaseClient';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

import { User, Award, Shield, LogOut, Edit2, Save, Trash2, Heart, Users, Zap, Leaf, Trophy, Sparkles } from 'lucide-react';
import EnhancedStreakDisplay from '../components/EnhancedStreakDisplay';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import UserLevelBadge from '../components/UserLevelBadge';
import ProfileImageUpload from '../components/profile/ProfileImageUpload';
import NotificationSettings from '../components/notifications/NotificationSettings';
import StatsWidget from '../components/profile/StatsWidget';
import { Switch } from '@/components/ui/switch';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteValue, setFavoriteValue] = useState('');
  const [lookingForBuddy, setLookingForBuddy] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => getUserProfile(user?.email || user?.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name || '');
      setBio(userProfile.bio || '');
      setFavoriteValue(userProfile.favorite_leche_value || '');
      setLookingForBuddy(userProfile.looking_for_buddy || false);
    }
  }, [userProfile]);

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.email],
    queryFn: () => appApi.entities.Achievement.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['badges', user?.email],
    queryFn: () => appApi.entities.Badge.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const { data: userLevels = [] } = useQuery({
    queryKey: ['userLevel', user?.email],
    queryFn: () => appApi.entities.UserLevel.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const userLevel = userLevels[0] || { level: 1, experience_points: 0 };

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      if (userProfile?.id) {
        return appApi.entities.UserProfile.update(userProfile.id, data);
      } else {
        return appApi.entities.UserProfile.create({ ...data, created_by: user.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEditing(false);
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      display_name: displayName,
      bio: bio,
      favorite_leche_value: favoriteValue,
      looking_for_buddy: lookingForBuddy
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  const lecheValues = [
    { value: 'Love', icon: Heart, color: 'text-pink-500' },
    { value: 'Empathy', icon: Users, color: 'text-blue-500' },
    { value: 'Community', icon: Users, color: 'text-indigo-500' },
    { value: 'Healing', icon: Leaf, color: 'text-green-500' },
    { value: 'Empowerment', icon: Zap, color: 'text-amber-500' }
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="My Profile"
        subtitle="Your journey of growth"
        rightAction={
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-full bg-[var(--bg-secondary)] hover:bg-black/5 transition-colors"
          >
            <Edit2 className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        }
      />

      {/* Main Profile Card */}
      <Card className="p-6 relative overflow-hidden glass-card">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-soft)]/20" />

        <div className="relative flex flex-col items-center">
          <div className="mb-4 -mt-2">
             <ProfileImageUpload
                currentImageUrl={userProfile?.profile_image_url}
                userProfile={userProfile}
             />
          </div>

          <h2 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">
            {displayName || user?.user_metadata?.full_name || 'Traveler'}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-4">{user?.email}</p>

          <div className="flex items-center gap-3 mb-6">
            <UserLevelBadge level={userLevel.level} compact />
            {favoriteValue && (
                <span className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-xs font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {favoriteValue}
                </span>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="w-full max-w-xs mb-6">
             <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                <span>XP</span>
                <span>{userLevel.experience_points} / {userLevel.points_to_next_level + userLevel.experience_points}</span>
             </div>
             <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-[var(--accent-primary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(userLevel.experience_points / (userLevel.points_to_next_level + userLevel.experience_points)) * 100}%` }}
                />
             </div>
          </div>
        </div>
      </Card>

      {/* Streak Details */}
      <Section title="Consistency">
        <EnhancedStreakDisplay 
          currentStreak={userProfile?.current_streak || 0}
          longestStreak={userProfile?.longest_streak || 0}
        />
      </Section>

      {/* Stats Dashboard */}
      <Section title="Stats">
        <StatsWidget
            userProfile={userProfile}
            achievements={achievements}
            level={userLevel.level}
        />
      </Section>

      {/* Badges */}
      {badges.length > 0 && (
        <Section title="Collection">
          <Card className="p-4">
            <BadgeDisplay badges={badges} />
          </Card>
        </Section>
      )}

      {/* Settings & Danger Zone */}
      <Section title="Account">
         <Card className="divide-y divide-black/5 dark:divide-white/5">
            {userProfile && <NotificationSettings userProfile={userProfile} />}

            <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
            >
                <div className="flex items-center gap-3 text-red-500">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </div>
            </button>
         </Card>
      </Section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
      >
        <div className="space-y-6">
            <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Display Name</label>
                <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="input-base"
                    placeholder="Enter your name"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Bio</label>
                <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="input-base min-h-[100px]"
                    placeholder="Share your journey..."
                />
            </div>

            <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Core Value</label>
                <div className="grid grid-cols-2 gap-2">
                    {lecheValues.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => setFavoriteValue(item.value)}
                            className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                                favoriteValue === item.value
                                ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                                : 'border-black/5 dark:border-white/5 hover:bg-[var(--bg-secondary)]'
                            }`}
                        >
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            <span className={`text-sm font-medium ${favoriteValue === item.value ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                {item.value}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl">
                <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">Find a Buddy</p>
                    <p className="text-xs text-[var(--text-secondary)]">Show profile in buddy search</p>
                </div>
                <Switch checked={lookingForBuddy} onCheckedChange={setLookingForBuddy} />
            </div>

            <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending} variant="primary" className="w-full">
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </Modal>

    </div>
  );
}
