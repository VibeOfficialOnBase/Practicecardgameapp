import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, savePracticeEntry } from '../lib/supabase';
import { appApi } from '@/api/supabaseClient';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Section from '../components/common/Section';
import CardDeck from '../components/CardDeck';
import PulledCard from '../components/PulledCard';
import ReflectionJournal from '../components/ReflectionJournal';
import CompletionFeedback from '../components/CompletionFeedback';
import StreakCounter from '../components/StreakCounter';
import GlobalPulseTracker from '../components/GlobalPulseTracker';
import { CheckCircle, Sparkles } from 'lucide-react';
import { FALLBACK_AFFIRMATIONS } from '../utils/affirmations';
import { toast } from 'sonner'; // or useToast

export default function Practice() {
  const { user } = useAuth();
  const [isPulling, setIsPulling] = useState(false);
  const [pulledCard, setPulledCard] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [showCompletionFeedback, setShowCompletionFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => getUserProfile(user?.email || user?.id),
    enabled: !!user,
  });

  const { data: todaysPractices = [] } = useQuery({
    queryKey: ['todaysPractice', user?.email],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      return appApi.entities.DailyPractice.filter({
        created_by: user?.email,
        created_date: { $gte: today }
      });
    },
    enabled: !!user,
  });

  const todaysPractice = todaysPractices[0];

  const { data: practiceCards = [] } = useQuery({
    queryKey: ['practiceCards'],
    queryFn: async () => {
      try {
        const cards = await appApi.entities.PracticeCard.list('-created_date', 50);
        return cards.length > 0 ? cards : FALLBACK_AFFIRMATIONS.map((a, i) => ({
             id: `local-card-${i}`,
             title: a.category + " Practice",
             affirmation: a.text,
             leche_value: a.category,
             mission: "Reflect on this today."
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

  useEffect(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    const savedCard = localStorage.getItem(`practice_card_${todayKey}`);
    if (savedCard && !todaysPractice?.completed) {
      try {
        setPulledCard(JSON.parse(savedCard));
        setShowJournal(true);
      } catch (e) {
        console.error('Error loading saved card:', e);
      }
    }
  }, [todaysPractice]);

  const handlePullCard = () => {
    if (practiceCards.length === 0) return;
    setIsPulling(true);
    setTimeout(() => {
      const randomCard = practiceCards[Math.floor(Math.random() * practiceCards.length)];
      setPulledCard(randomCard);
      const todayKey = new Date().toISOString().split('T')[0];
      localStorage.setItem(`practice_card_${todayKey}`, JSON.stringify(randomCard));
      setIsPulling(false);
      setTimeout(() => {
        if (!todaysPractice?.completed) {
          setShowJournal(true);
        }
      }, 1500);
    }, 1000);
  };

  const completePracticeMutation = useMutation({
    mutationFn: async ({ reflection, rating, beforeMood, afterMood }) => {
      setIsSubmitting(true);
      const practiceData = {
        practice_card_id: pulledCard.id,
        completed: true,
        reflection,
        rating,
        before_mood: beforeMood,
        after_mood: afterMood,
        xp_earned: 100
      };
      await savePracticeEntry(user.email, practiceData);
      return { success: true };
    },
    onSuccess: async () => {
      // Optimistic UI update handled by state change mostly, but we trigger feedback immediately
      setShowCompletionFeedback(true);
      // Also show toast for robustness
      try { toast.success("Practice saved successfully!"); } catch(e) {}

      // Sync in background
      await queryClient.invalidateQueries({ queryKey: ['todaysPractice'] });
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });

      setTimeout(() => {
          setShowCompletionFeedback(false);
          setShowJournal(false);
          setIsSubmitting(false);
      }, 2000);
    },
    onError: () => {
        setIsSubmitting(false);
        try { toast.error("Failed to save. Please try again."); } catch(e) {}
    }
  });

  const handleCompleteJournal = (data) => {
    completePracticeMutation.mutate(data);
  };

  if (todaysPractice?.completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">Practice Complete! ✨</h1>
          <p className="text-[var(--text-secondary)]">You've nourished your mind today.</p>
        </div>

        <Card className="p-6 max-w-sm w-full mx-auto glass-card">
          <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Current Streak</div>
          <div className="text-4xl font-bold text-[var(--accent-primary)] drop-shadow-sm">{userProfile?.current_streak || 1} Days</div>
        </Card>

        <p className="text-sm text-[var(--text-secondary)]">Come back tomorrow for a new insight.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      <PageHeader
        title={`Welcome, ${user?.user_metadata?.full_name?.split(' ')[0] || 'Friend'}`}
        subtitle="Your daily practice awaits"
        rightAction={userProfile && <StreakCounter streak={userProfile.current_streak || 0} />}
      />

      <AnimatePresence mode="wait">
        {!pulledCard ? (
          <motion.div
            key="deck"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-4"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 animate-pulse">
                Today's Intention
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xs mx-auto text-sm">
                Tap the deck to reveal your daily guidance card.
              </p>
            </div>

            <CardDeck onPull={handlePullCard} isPulling={isPulling} />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <PulledCard card={pulledCard} userEmail={user?.email} />
            
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
        message="Practice Saved! See you tomorrow. 🌟"
      />

      <Section title="Community">
        <GlobalPulseTracker />
      </Section>
    </div>
  );
}
