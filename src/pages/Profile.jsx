import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Flame, Award, LogOut, Edit2, Save, Shield, Gift, Wallet, CheckCircle, XCircle, Sparkles, Trash2, Zap } from 'lucide-react';
import EnhancedStreakDisplay from '../components/EnhancedStreakDisplay';
import { Switch } from '@/components/ui/switch';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import UserLevelBadge from '../components/UserLevelBadge';
import LevelProgress from '../components/LevelProgress';
import PulledCard from '../components/PulledCard';
import ShareToFeed from '../components/ShareToFeed';
import AICardInsights from '../components/AICardInsights';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';
import { walletConnector } from '../components/wallet/WalletConnector';
import ProfileImageUpload from '../components/profile/ProfileImageUpload';
import NotificationSettings from '../components/notifications/NotificationSettings';
import ProgressDashboard from '../components/progress/ProgressDashboard';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteValue, setFavoriteValue] = useState('');
  const [lookingForBuddy, setLookingForBuddy] = useState(false);
  const [buddyFocusAreas, setBuddyFocusAreas] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [pulledCard, setPulledCard] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();
  const { play } = useSound();
  const { trigger } = useHaptic();

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

  const { data: userProfiles = [] } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const userProfile = userProfiles[0];

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name || '');
      setBio(userProfile.bio || '');
      setFavoriteValue(userProfile.favorite_leche_value || '');
      setLookingForBuddy(userProfile.looking_for_buddy || false);
      setBuddyFocusAreas(userProfile.buddy_focus_areas || []);
      setWalletAddress(userProfile.wallet_address || '');
    }
  }, [userProfile]);

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.email],
    queryFn: () => base44.entities.Achievement.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['badges', user?.email],
    queryFn: () => base44.entities.Badge.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const { data: userLevels = [] } = useQuery({
    queryKey: ['userLevel', user?.email],
    queryFn: () => base44.entities.UserLevel.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const userLevel = userLevels[0] || { level: 1, experience_points: 0 };

  const { data: practiceCards = [] } = useQuery({
    queryKey: ['practiceCards'],
    queryFn: () => base44.entities.PracticeCard.list('-created_date', 100),
  });

  const today = new Date().toISOString().split('T')[0];
  const { data: todaysBonusPulls = [] } = useQuery({
    queryKey: ['bonusPulls', user?.email, today],
    queryFn: () => base44.entities.BonusPull.filter({
      user_email: user?.email,
      pulled_date: today
    }),
    enabled: !!user
  });

  const hasPulledToday = todaysBonusPulls.length > 0;

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      if (userProfile) {
        return base44.entities.UserProfile.update(userProfile.id, data);
      } else {
        return base44.entities.UserProfile.create(data);
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
      looking_for_buddy: lookingForBuddy,
      buddy_focus_areas: buddyFocusAreas
    });
  };

  const deleteAllData = useMutation({
    mutationFn: async () => {
      const entities = [
        'UserProfile', 'DailyPractice', 'Achievement', 'Badge',
        'FavoriteCard', 'BonusPull', 'CommunityPost', 'PostLike',
        'BuddyConnection', 'Message', 'Endorsement', 'CardInsight',
        'DailyChallenge', 'UserLevel', 'StreakProtection',
        'ChallengeParticipant', 'PersonalizedRecommendation'
      ];

      for (const entity of entities) {
        try {
          const records = await base44.entities[entity].filter({ created_by: user.email });
          for (const record of records) {
            await base44.entities[entity].delete(record.id);
          }
        } catch (e) {
          console.log(`Could not delete ${entity}:`, e.message);
        }
      }
      
      base44.auth.logout();
    }
  });

  const useStreakFreeze = useMutation({
    mutationFn: async () => {
      await base44.entities.StreakProtection.create({
        user_email: user.email,
        protection_type: 'freeze',
        is_active: true,
        used_date: new Date().toISOString()
      });
      if (userProfile) {
        await base44.entities.UserProfile.update(userProfile.id, {
          streak_freezes_available: (userProfile.streak_freezes_available || 0) - 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  });

  const useStreakRevival = useMutation({
    mutationFn: async () => {
      if (userProfile) {
        await base44.entities.UserProfile.update(userProfile.id, {
          current_streak: userProfile.longest_streak,
          streak_revivals_available: (userProfile.streak_revivals_available || 0) - 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  });

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Connect using our wallet connector utility
      const result = await walletConnector.connect();
      
      setWalletAddress(result.address);

      // Listen for account changes
      walletConnector.onAccountsChanged((newAddress) => {
        if (newAddress) {
          setWalletAddress(newAddress);
        } else {
          setWalletAddress('');
        }
      });

      // Listen for chain changes
      walletConnector.onChainChanged(async (chainId) => {
        if (chainId !== 8453) {
          alert('Please switch back to Base network to continue using the app.');
        }
      });

      // Save wallet address to profile
      if (userProfile) {
        await base44.entities.UserProfile.update(userProfile.id, {
          wallet_address: result.address
        });
      } else {
        await base44.entities.UserProfile.create({
          wallet_address: result.address
        });
      }

      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      play('success');
      trigger('light');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert(error.message || 'Failed to connect wallet. Please try again.');
    }
    setIsConnecting(false);
  };

  const verifyAndPull = useMutation({
    mutationFn: async () => {
      setVerificationStatus('verifying');
      
      const response = await base44.functions.invoke('verifyTokenBalance', {
        walletAddress
      });

      if (!response.data.verified) {
        setVerificationStatus('failed');
        throw new Error('Insufficient token balance. You need at least 1000 $VibeOfficial tokens.');
      }

      setVerificationStatus('verified');
      
      const randomCard = practiceCards[Math.floor(Math.random() * practiceCards.length)];
      
      await base44.entities.BonusPull.create({
        user_email: user?.email,
        practice_card_id: randomCard.id,
        pulled_date: today,
        wallet_verified: true
      });

      return randomCard;
    },
    onSuccess: (card) => {
      setPulledCard(card);
      queryClient.invalidateQueries({ queryKey: ['bonusPulls'] });
      play('card-flip');
      trigger('strong');
    },
    onError: (error) => {
      alert(error.message);
      setVerificationStatus(null);
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    base44.auth.logout('/Login');
  };

  if (pulledCard) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
            <Gift className="w-12 h-12 text-amber-500" />
            Bonus Card!
          </h1>
          <p className="text-slate-600 text-lg">Your exclusive holder reward</p>
        </motion.div>

        <PulledCard card={pulledCard} userEmail={user?.email} />

        <AICardInsights card={pulledCard} userEmail={user?.email} />
        
        <ShareToFeed card={pulledCard} userEmail={user?.email} cardType="bonus" />

        <Button
          onClick={() => setPulledCard(null)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl py-6"
        >
          Back to Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">Profile</h1>
        <p className="text-body font-medium">Your PRACTICE journey</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-organic p-8"
      >
        <div className="mb-6">
          <ProfileImageUpload 
            currentImageUrl={userProfile?.profile_image_url} 
            userProfile={userProfile}
          />
        </div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold ensure-readable-strong">
              {displayName || user?.full_name || 'Anonymous'}
            </h2>
            <p className="text-label text-sm">{user?.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <UserLevelBadge level={userLevel.level} compact />
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            size="icon"
            className="rounded-xl"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Display Name
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Favorite LECHE Value
              </label>
              <Select value={favoriteValue} onValueChange={setFavoriteValue}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Love">💗 Love</SelectItem>
                  <SelectItem value="Empathy">🤝 Empathy</SelectItem>
                  <SelectItem value="Community">👥 Community</SelectItem>
                  <SelectItem value="Healing">🌿 Healing</SelectItem>
                  <SelectItem value="Empowerment">⚡ Empowerment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div>
                <label className="text-sm font-semibold text-slate-900">Looking for PRACTICE Buddy</label>
                <p className="text-xs text-slate-600">Connect with others on similar journeys</p>
              </div>
              <Switch checked={lookingForBuddy} onCheckedChange={setLookingForBuddy} />
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              className="w-full bg-amber-600 hover:bg-amber-700 rounded-xl py-6"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            {bio && (
              <p className="ensure-readable leading-relaxed">{bio}</p>
            )}
            {favoriteValue && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-sm font-semibold ensure-readable">
                Favorite Value: {favoriteValue}
              </div>
            )}
            {lookingForBuddy && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-sm font-semibold ensure-readable ml-2">
                🤝 Open to Buddies
              </div>
            )}
          </div>
        )}
      </motion.div>



      {/* Enhanced Streak Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EnhancedStreakDisplay 
          currentStreak={userProfile?.current_streak || 0}
          longestStreak={userProfile?.longest_streak || 0}
        />
      </motion.div>

      {/* Progress Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ProgressDashboard userEmail={user?.email} />
      </motion.div>

      {/* Notification Settings */}
      {userProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <NotificationSettings userProfile={userProfile} />
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 p-4 sm:p-6 text-center text-white shadow-lg"
        >
          <Award className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-bold">{achievements.length}</p>
          <p className="text-xs sm:text-sm opacity-90">Badges</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 p-4 sm:p-6 text-center text-white shadow-lg"
        >
          <User className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-bold">{userProfile?.total_practices_completed || 0}</p>
          <p className="text-xs sm:text-sm opacity-90">Practices</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 p-4 sm:p-6 text-center text-white shadow-lg col-span-2 sm:col-span-1"
        >
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
          <p className="text-2xl sm:text-3xl font-bold">{(userProfile?.streak_freezes_available || 0) + (userProfile?.streak_revivals_available || 0)}</p>
          <p className="text-xs sm:text-sm opacity-90">Protections</p>
        </motion.div>
      </div>

      {/* Badges Section */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-organic p-6"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Badges</h2>
          <BadgeDisplay badges={badges} />
        </motion.div>
      )}

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full rounded-xl py-6 border-slate-300 text-slate-700 hover:bg-slate-50"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Logout
      </Button>

      {/* Delete Data Section */}
      <div className="card-organic p-6 border-2 border-red-200">
        <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-600 mb-4">
          Permanently delete all your data. This action cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All My Data
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-700">Are you absolutely sure?</p>
            <div className="flex gap-2">
              <Button
                onClick={() => deleteAllData.mutate()}
                disabled={deleteAllData.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                {deleteAllData.isPending ? 'Deleting...' : 'Yes, Delete Everything'}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}