import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import StreakCounter from '../components/StreakCounter';
import TodaysCard from '../components/TodaysCard';
import AchievementBadge from '../components/AchievementBadge';
import CommunityHighlight from '../components/CommunityHighlight';
import AIRecommendations from '../components/ai/AIRecommendations';
import CommunityChallenges from '../components/community/CommunityChallenges';
import DailyCardAssignment from '../components/DailyCardAssignment';
import OnboardingSetup from '../components/onboarding/OnboardingSetup';
import WalletStatus from '../components/wallet/WalletStatus';
import AppTutorial from '../components/onboarding/AppTutorial';
import { Sparkles } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        const profiles = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
        if (profiles.length === 0 || !profiles[0].onboarding_completed) {
          setShowOnboarding(true);
        } else {
          // Check if first visit
          const hasSeenTutorial = localStorage.getItem('hasSeenAppTutorial');
          if (!hasSeenTutorial) {
            setShowTutorial(true);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, [navigate]);

  // Get user profile for streak data
  const { data: userProfiles = [] } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const userProfile = userProfiles[0];

  // Get today's practice
  const { data: todaysPractices = [] } = useQuery({
    queryKey: ['todaysPractice', user?.email],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      return base44.entities.DailyPractice.filter({ 
        created_by: user?.email,
        created_date: { $gte: today }
      });
    },
    enabled: !!user,
  });

  const todaysPractice = todaysPractices[0];

  // Get user preferences
  const { data: userPreferences = [] } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: () => base44.entities.UserPreferences.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const userPrefs = userPreferences[0];
  const enabledCategories = userPrefs?.enabled_categories || ['Love', 'Empathy', 'Community', 'Healing', 'Empowerment'];

  // Get today's assigned daily card
  const today = new Date().toISOString().split('T')[0];
  const { data: dailyCards = [] } = useQuery({
    queryKey: ['dailyCard', user?.email, today],
    queryFn: () => base44.entities.DailyCard.filter({
      user_email: user?.email,
      assigned_date: today
    }),
    enabled: !!user
  });

  const dailyCard = dailyCards[0];

  // Get practice cards
  const { data: practiceCards = [] } = useQuery({
    queryKey: ['practiceCards'],
    queryFn: () => base44.entities.PracticeCard.list('-created_date', 100),
  });

  const todaysCard = dailyCard 
    ? practiceCards.find(card => card.id === dailyCard.practice_card_id)
    : (todaysPractice 
        ? practiceCards.find(card => card.id === todaysPractice.practice_card_id)
        : practiceCards[0]);

  // Get recent achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.email],
    queryFn: () => base44.entities.Achievement.filter(
      { created_by: user?.email },
      '-earned_date',
      3
    ),
    enabled: !!user,
  });

  // Get community highlights
  const { data: communityPosts = [] } = useQuery({
    queryKey: ['communityHighlights'],
    queryFn: () => base44.entities.CommunityPost.list('-hearts_count', 3),
  });

  const handleStartPractice = () => {
    navigate(createPageUrl('Practice'));
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenAppTutorial', 'true');
    setShowTutorial(false);
  };

  if (showOnboarding) {
    return <OnboardingSetup userEmail={user?.email} onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {showTutorial && <AppTutorial onComplete={handleTutorialComplete} />}
      {/* Auto-assign daily card */}
      {user && <DailyCardAssignment userEmail={user.email} enabledCategories={enabledCategories} />}
      
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-2">
          Welcome Back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-body text-lg font-medium">
          Ready to practice today? ✨
        </p>
      </motion.div>

      {/* Wallet Status */}
      {userProfile && (userProfile.base_wallet_address || userProfile.algorand_wallet_address) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
        >
          <WalletStatus userProfile={userProfile} />
        </motion.div>
      )}

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <StreakCounter 
          streak={userProfile?.current_streak || 0}
          longestStreak={userProfile?.longest_streak || 0}
        />
      </motion.div>

      {/* AI Recommendations */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <AIRecommendations userEmail={user.email} />
        </motion.div>
      )}

      {/* Today's Practice Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-purple-400" />
          Today's Practice
        </h2>
        <TodaysCard 
          card={todaysCard}
          onStart={handleStartPractice}
          completed={todaysPractice?.completed}
        />
      </motion.div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Community Challenges */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <CommunityChallenges userEmail={user.email} />
        </motion.div>
      )}

      {/* Community Highlights */}
      {communityPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-4">Community Highlights</h2>
          <div className="space-y-3">
            {communityPosts.map((post, index) => (
              <CommunityHighlight key={post.id} post={post} index={index} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}