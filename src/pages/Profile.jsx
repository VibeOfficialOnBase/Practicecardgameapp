import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { getUserProfile } from '../lib/supabase';
import { appApi } from '@/api/supabaseClient';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConnectWalletButton from '../components/wallet/ConnectWalletButton';

import { LogOut, Edit2, Heart, Users, Zap, Leaf, Sparkles, Gift, ExternalLink } from 'lucide-react';
import EnhancedStreakDisplay from '../components/EnhancedStreakDisplay';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import UserLevelBadge from '../components/UserLevelBadge';
import ProfileImageUpload from '../components/profile/ProfileImageUpload';
import NotificationSettings from '../components/notifications/NotificationSettings';
import StatsWidget from '../components/profile/StatsWidget';
import DailyPracticeLeaderboard from '../components/leaderboards/DailyPracticeLeaderboard';
import { Switch } from '@/components/ui/switch';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { 
    algoAddress, 
    evmAddress, 
    isAlgoConnected, 
    isEvmConnected,
    formatAlgoAddress,
    formatEVMAddress,
    disconnectAlgorand,
    disconnectEVM,
    getBaseExplorerUrl,
  } = useWallet();
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteValue, setFavoriteValue] = useState('');
  const [lookingForBuddy, setLookingForBuddy] = useState(false);

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

      {/* Leaderboard Section */}
      <Section title="Leaderboard">
        <DailyPracticeLeaderboard />
      </Section>

      {/* Badges */}
      {badges.length > 0 && (
        <Section title="Collection">
          <Card className="p-4">
            <BadgeDisplay badges={badges} />
          </Card>
        </Section>
      )}

      {/* Web3 Wallet Section */}
      <Section title="Web3 Wallets">
        {/* Algorand Wallet */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <span className="text-lg">🟡</span>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Algorand Wallet</p>
                {isAlgoConnected ? (
                  <p className="text-sm text-green-500">Connected: {formatAlgoAddress(algoAddress)}</p>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">Pera Wallet</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAlgoConnected && (
                <>
                  <a
                    href={`https://allo.info/account/${algoAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
                  </a>
                  <button
                    onClick={disconnectAlgorand}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              )}
              {!isAlgoConnected && <ConnectWalletButton />}
            </div>
          </div>
        </Card>

        {/* Base Wallet */}
        <Card className="p-4 relative overflow-hidden">
             {/* Bonus Pack Indicator */}
             {isEvmConnected && (
                 <div className="absolute top-0 right-0 p-2">
                    <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase border border-amber-500/30 flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        Bonus Active
                    </span>
                 </div>
             )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                        <img src="/assets/vibe-logo.png" className="w-full h-full object-cover opacity-90" alt="Base" />
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--text-primary)]">Base Wallet</p>
                         {isEvmConnected ? (
                            <p className="text-sm text-green-500">Connected: {formatEVMAddress(evmAddress)}</p>
                        ) : (
                            <p className="text-sm text-[var(--text-secondary)]">Connect for Holder Bonus</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEvmConnected && (
                    <>
                      <a
                        href={getBaseExplorerUrl(evmAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
                      </a>
                      <button
                        onClick={disconnectEVM}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  )}
                  {!isEvmConnected && <ConnectWalletButton />}
                </div>
            </div>

             {/* Holders Bonus Message */}
             {isEvmConnected && (
                 <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                     <div className="flex items-start gap-2">
                         <Sparkles className="w-4 h-4 text-amber-400 mt-0.5" />
                         <div>
                             <p className="text-sm font-bold text-[var(--text-primary)]">$VibeOfficial Holder Pack</p>
                             <p className="text-xs text-[var(--text-secondary)]">
                                 Because you hold $Vibe, you&apos;ve unlocked exclusive card backs and daily bonus XP!
                             </p>
                         </div>
                     </div>
                 </div>
             )}
        </Card>
      </Section>

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
