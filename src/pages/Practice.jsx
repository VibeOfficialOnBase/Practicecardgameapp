import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import CardDeck from '../components/CardDeck';
import PulledCard from '../components/PulledCard';
import CardMessage from '../components/CardMessage';
import ReflectionJournal from '../components/ReflectionJournal';
import ShareCard from '../components/ShareCard';
import ShareToFeed from '../components/ShareToFeed';
import AICardInsights from '../components/AICardInsights';
import DailyChallenge from '../components/DailyChallenge';
import LevelProgress from '../components/LevelProgress';
import Celebration from '../components/Celebration';
import AchievementUnlock from '../components/AchievementUnlock';
import CompletionFeedback from '../components/CompletionFeedback';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import { CheckCircle } from 'lucide-react';
import { achievements as allAchievements } from '../components/achievements';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { FALLBACK_AFFIRMATIONS } from '../utils/affirmations';

const calculateStreak = (lastDate, currentDate) => {
  if (!lastDate) return 0;
  
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  
  const diffTime = current - last;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const getMilestone = (streak) => {
  if (streak === 365) return 'yearly';
  if (streak === 100) return 'century';
  if (streak === 30) return 'monthly';
  if (streak === 7) return 'weekly';
  if (streak >= 1) return 'daily';
  return null;
};

const getTodayKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export default function Practice() {
  const [user, setUser] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pulledCard, setPulledCard] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCompletionFeedback, setShowCompletionFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { play } = useSound();
  const { trigger } = useHaptic();
  const navigate = useNavigate();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('practice_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

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

    const todayKey = getTodayKey();
    const savedCard = localStorage.getItem(`practice_card_${todayKey}`);
    if (savedCard && !todaysPractice?.completed) {
      try {
        setPulledCard(JSON.parse(savedCard));
        setShowJournal(true);
      } catch (e) {
        console.error('Error loading saved card:', e);
      }
    }
  }, []);

  const { data: practiceCards = [] } = useQuery({
    queryKey: ['practiceCards'],
    queryFn: async () => {
      try {
        const cards = await base44.entities.PracticeCard.list('-created_date', 50);
        if (cards && cards.length > 0) return cards;
        // Fallback to local 365 list if DB is empty or fails
        return FALLBACK_AFFIRMATIONS.map((a, i) => ({
             id: `local-card-${i}`,
             title: a.category + " Practice",
             affirmation: a.text,
             leche_value: a.category,
             message: "Reflect on this today."
        }));
      } catch (e) {
         return FALLBACK_AFFIRMATIONS.map((a, i) => ({
             id: `local-card-${i}`,
             title: a.category + " Practice",
             affirmation: a.text,
             leche_value: a.category,
             message: "Reflect on this today."
        }));
      }
    },
  });

  const { data: userPreferences = [] } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: () => base44.entities.UserPreferences.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const userPrefs = userPreferences[0];
  const enabledCategories = userPrefs?.enabled_categories || ['Love', 'Empathy', 'Community', 'Healing', 'Empowerment'];
  
  const filteredCards = practiceCards.filter(card => 
    enabledCategories.includes(card.leche_value)
  );

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

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user,
  });

  const completePracticeMutation = useMutation({
    mutationFn: async ({ cardId, reflection, rating, beforeMood, afterMood }) => {
      setIsSubmitting(true);
      
      const practiceData = {
        practice_card_id: cardId,
        completed: true,
        completion_date: new Date().toISOString(),
        reflection,
        rating,
        before_mood: beforeMood,
        after_mood: afterMood,
        xp_earned: 100
      };

      // Log activity pulse
      await base44.entities.ActivityPulse.create({
        user_email: user.email,
        action_type: 'card_pull',
        action_description: 'completed daily practice',
        action_icon: '🌟'
      });

      let practice;
      if (todaysPractice) {
        practice = await base44.entities.DailyPractice.update(todaysPractice.id, practiceData);
      } else {
        practice = await base44.entities.DailyPractice.create(practiceData);
      }

      const today = getTodayKey();
      let newStreak = 1;
      
      if (userProfile) {
        const daysSinceLastPractice = calculateStreak(userProfile.last_practice_date, today);
        
        if (daysSinceLastPractice === 1) {
          newStreak = (userProfile.current_streak || 0) + 1;
        } else if (daysSinceLastPractice === 0) {
          newStreak = userProfile.current_streak || 1;
        }

        const updatedProfile = {
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userProfile.longest_streak || 0),
          last_practice_date: today,
          total_practices_completed: (userProfile.total_practices_completed || 0) + 1
        };

        await base44.entities.UserProfile.update(userProfile.id, updatedProfile);
      } else {
        await base44.entities.UserProfile.create({
          current_streak: 1,
          longest_streak: 1,
          last_practice_date: today,
          total_practices_completed: 1
        });
      }

      // Award XP for completing practice (100 XP)
      const userLevelsData = await base44.entities.UserLevel.filter({ user_email: user.email });
      if (userLevelsData[0]) {
        const currentXP = userLevelsData[0].experience_points + 100;
        const newLevel = Math.floor(currentXP / 100) + 1;
        await base44.entities.UserLevel.update(userLevelsData[0].id, {
          experience_points: currentXP,
          level: newLevel,
          points_to_next_level: (newLevel * 100) - currentXP
        });
      } else {
        await base44.entities.UserLevel.create({
          user_email: user.email,
          level: 1,
          experience_points: 100,
          points_to_next_level: 0
        });
      }

      return { practice, streak: newStreak };
    },
    onSuccess: async (data) => {
      // Show immediate feedback
      setShowCompletionFeedback(true);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Refetch data
      await queryClient.invalidateQueries({ queryKey: ['todaysPractice'] });
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      await queryClient.invalidateQueries({ queryKey: ['achievements'] });
      await queryClient.invalidateQueries({ queryKey: ['userLevel'] });
      
      setShowCompletionFeedback(false);
      setShowJournal(false);
      setIsSubmitting(false);
      
      // Check for achievements
      const userAchievements = await base44.entities.Achievement.filter({ created_by: user?.email });
      const unlockedIds = userAchievements.map(a => a.title.toLowerCase().replace(/\s+/g, '_'));
      
      for (const achievement of allAchievements) {
        if (!unlockedIds.includes(achievement.id)) {
          let shouldUnlock = false;
          
          if (achievement.id === 'new_member' && data.streak >= 1) shouldUnlock = true;
          if (achievement.id === 'regular' && data.streak >= 7) shouldUnlock = true;
          if (achievement.id === 'pillar' && data.streak >= 30) shouldUnlock = true;
          if (achievement.id === 'transformation' && data.streak >= 60) shouldUnlock = true;
          if (achievement.id === 'centurion' && data.streak >= 100) shouldUnlock = true;
          if (achievement.id === 'year_of_practice' && data.streak >= 365) shouldUnlock = true;
          
          if (shouldUnlock) {
            await base44.entities.Achievement.create({
              title: achievement.title,
              description: achievement.description,
              badge_icon: achievement.icon,
              earned_date: new Date().toISOString(),
              leche_value: achievement.category
            });
            setUnlockedAchievement(achievement);
            return;
          }
        }
      }
      
      const milestone = getMilestone(data.streak);
      if (milestone) {
        setCelebration(milestone);
      }
    },
    onError: () => {
      setIsSubmitting(false);
      setShowCompletionFeedback(false);
    }
  });

  const handlePullCard = () => {
    if (filteredCards.length === 0) return;
    
    const todayKey = getTodayKey();
    const existingCard = localStorage.getItem(`practice_card_${todayKey}`);
    
    if (existingCard && !todaysPractice?.completed) {
      try {
        setPulledCard(JSON.parse(existingCard));
        setShowJournal(true);
        return;
      } catch (e) {
        console.error('Error loading existing card:', e);
      }
    }
    
    setIsPulling(true);
    
    setTimeout(() => {
      const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];
      setPulledCard(randomCard);
      localStorage.setItem(`practice_card_${todayKey}`, JSON.stringify(randomCard));
      setIsPulling(false);
      
      setTimeout(() => {
        if (!todaysPractice?.completed) {
          setShowJournal(true);
        }
      }, 2000);
    }, 600);
  };

  const handleCompleteJournal = ({ reflection, rating, beforeMood, afterMood }) => {
    if (pulledCard && !isSubmitting) {
      play('practice-complete');
      trigger('success');
      completePracticeMutation.mutate({
        cardId: pulledCard.id,
        reflection,
        rating,
        beforeMood,
        afterMood
      });
    }
  };



  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  if (unlockedAchievement) {
    return <AchievementUnlock 
      achievement={unlockedAchievement} 
      onClose={() => {
        setUnlockedAchievement(null);
        const milestone = getMilestone(userProfile?.current_streak || 1);
        if (milestone) {
          setCelebration(milestone);
        } else {
          setPulledCard(null);
          setShowJournal(false);
        }
      }} 
    />;
  }

  if (celebration) {
    return <Celebration milestone={celebration} onComplete={() => {
      navigate(createPageUrl('Achievements'));
    }} />;
  }

  if (todaysPractice?.completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="card-organic gradient-healing p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-emerald-700 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold font-heading text-emerald-900 mb-4">
            PRACTICE Complete! ✨
          </h1>
          <p className="text-emerald-800 text-lg mb-4 font-medium">
            You've nourished your growth today.
          </p>
          <p className="text-emerald-700">
            {userProfile?.current_streak > 0 
              ? `${userProfile.current_streak} day streak! Return tomorrow to continue your journey.`
              : 'Return tomorrow for a new practice.'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold font-heading mb-3">Daily Card Pull</h1>
        <motion.p 
          className="text-4xl font-bold font-heading tracking-[0.3em] mb-1 relative"
          style={{
            background: 'linear-gradient(135deg, #8A4BFF 0%, #B366FF 50%, #A855F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(138,75,255,0.8)) drop-shadow(0 0 15px rgba(179,102,255,0.6))'
          }}
          animate={{
            filter: [
              'drop-shadow(0 0 30px rgba(138,75,255,0.8)) drop-shadow(0 0 15px rgba(179,102,255,0.6))',
              'drop-shadow(0 0 40px rgba(138,75,255,1)) drop-shadow(0 0 20px rgba(179,102,255,0.8))',
              'drop-shadow(0 0 30px rgba(138,75,255,0.8)) drop-shadow(0 0 15px rgba(179,102,255,0.6))'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          PRACTICE
        </motion.p>
        <p className="text-sm tracking-[0.2em] mb-3 font-light" style={{ color: '#C7B1FF' }}>Patiently Repeating Altruistic Challenges To Inspire Core Excellence</p>
        <p className="text-contrast text-lg font-medium">Pull your card to discover today's PRACTICE</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!pulledCard ? (
          <motion.div
            key="deck"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardDeck onPull={handlePullCard} isPulling={isPulling} />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <PulledCard card={pulledCard} userEmail={user?.email} />

            <LevelProgress userEmail={user?.email} />

            <DailyChallenge card={pulledCard} userEmail={user?.email} />

            <AICardInsights card={pulledCard} userEmail={user?.email} />

            <ShareToFeed card={pulledCard} userEmail={user?.email} cardType="daily" />

            <ShareCard card={pulledCard} />
            
            {pulledCard.message && (
              <CardMessage message={pulledCard.message} />
            )}
            
            {showJournal && (
              <ReflectionJournal
                card={pulledCard}
                onComplete={handleCompleteJournal}
                isSubmitting={isSubmitting}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CompletionFeedback 
        show={showCompletionFeedback}
        message="Your practice has been saved! 🌟"
      />

      <div className="text-center mt-12 pt-8 border-t border-amber-200">
        <p className="text-sm text-stone-500 mb-2">Powered by</p>
        <p className="text-xl font-bold text-amber-600 tracking-widest">LECHE</p>
        <p className="text-xs text-stone-400 mt-1">Love • Empathy • Community • Healing • Empowerment</p>
      </div>
    </div>
  );
}