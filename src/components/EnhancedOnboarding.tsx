import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Heart, 
  Users, 
  Flame, 
  Award,
  ArrowRight,
  CheckCircle2,
  Target,
  Clock
} from 'lucide-react';

import confetti from 'canvas-confetti';
import { allCards } from '@/data/cardsWithRarity';
import { PreviewModeCard } from '@/components/PreviewModeCard';

interface EnhancedOnboardingProps {
  onComplete: (userData: { username: string; goals: string[]; preferredTime: string }) => void;
}

export function EnhancedOnboarding({ onComplete }: EnhancedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [username, setUsername] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState('morning');
  const [previewCard, setPreviewCard] = useState<typeof allCards[0] | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem('practice_onboarding_v2_complete');
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
    } else {
      // Generate preview card
      generatePreviewCard();
    }
  }, []);

  const generatePreviewCard = () => {
    const randomIndex = Math.floor(Math.random() * Math.min(allCards.length, 50));
    setPreviewCard(allCards[randomIndex]);
  };

  const goals = [
    { id: 'mindfulness', label: 'Build Mindfulness', icon: '🧘' },
    { id: 'consistency', label: 'Build Consistency', icon: '📅' },
    { id: 'growth', label: 'Personal Growth', icon: '🌱' },
    { id: 'community', label: 'Connect with Others', icon: '👥' },
    { id: 'achievement', label: 'Unlock Achievements', icon: '🏆' },
    { id: 'streak', label: 'Build Long Streaks', icon: '🔥' },
  ];

  const timePreferences = [
    { id: 'morning', label: 'Morning Person', time: '6:00-12:00', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon Vibes', time: '12:00-18:00', icon: '☀️' },
    { id: 'evening', label: 'Evening Ritual', time: '18:00-24:00', icon: '🌙' },
  ];

  const steps = [
    {
      title: "Welcome to PRACTICE! ✨",
      description: "Let's take a quick tour to personalize your journey",
    },
    {
      title: "Try a Free Preview",
      description: "Pull your first card to see what PRACTICE is all about",
    },
    {
      title: "What Brings You Here?",
      description: "Select your goals so we can personalize your experience",
    },
    {
      title: "When Do You Practice?",
      description: "Choose your preferred time for daily reminders",
    },
    {
      title: "Create Your Identity",
      description: "Choose a username to join the community",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#A78BFA', '#EC4899', '#34D399'],
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!username.trim()) {
      return;
    }

    // Save onboarding completion with personalization data
    localStorage.setItem('practice_onboarding_v2_complete', 'true');
    localStorage.setItem('practice_onboarding_data', JSON.stringify({
      goals: selectedGoals,
      preferredTime,
    }));
    
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#34D399'],
      startVelocity: 50,
    });
    
    setTimeout(() => {
      setShowOnboarding(false);
      onComplete({ username, goals: selectedGoals, preferredTime });
    }, 500);
  };

  const handleSkip = () => {
    localStorage.setItem('practice_onboarding_v2_complete', 'true');
    setShowOnboarding(false);
    onComplete({ username: 'User', goals: [], preferredTime: 'morning' });
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  if (!showOnboarding) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20`}
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl"
      >
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/95 to-white/98 backdrop-blur-xl shadow-2xl">
          {/* Logo header */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <img
              src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
              alt="PRACTICE"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-bold text-purple-600">PRACTICE</span>
          </div>

          {/* Progress dots */}
          <div className="absolute top-4 right-4 flex gap-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-purple-600 w-6' 
                    : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="p-8 pt-16 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 0: Welcome */}
                {currentStep === 0 && (
                  <div className="text-center space-y-6">
                    <Sparkles className="w-16 h-16 text-purple-600 mx-auto animate-bounce" />
                    <h2 className="text-3xl font-black text-gray-900">{step.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="p-4 rounded-lg bg-purple-100">
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-sm font-semibold text-purple-900">Daily Cards</p>
                      </div>
                      <div className="p-4 rounded-lg bg-pink-100">
                        <div className="text-3xl mb-2">🔥</div>
                        <p className="text-sm font-semibold text-pink-900">Build Streaks</p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-100">
                        <div className="text-3xl mb-2">🏆</div>
                        <p className="text-sm font-semibold text-blue-900">Achievements</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-100">
                        <div className="text-3xl mb-2">👥</div>
                        <p className="text-sm font-semibold text-green-900">Community</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Preview Card */}
                {currentStep === 1 && previewCard && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Target className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
                      <h2 className="text-3xl font-black text-gray-900 mb-2">{step.title}</h2>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className="max-w-sm mx-auto">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
                        <p className="text-purple-900 font-bold mb-3">{previewCard.affirmation}</p>
                        <p className="text-purple-700 text-sm mb-2">{previewCard.mission}</p>
                        <p className="text-purple-600 text-xs italic">{previewCard.inspiration}</p>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      This is just a preview - connect to start your real journey!
                    </p>
                  </div>
                )}

                {/* Step 2: Goals */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Heart className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-black text-gray-900 mb-2">{step.title}</h2>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {goals.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedGoals.includes(goal.id)
                              ? 'border-purple-600 bg-purple-100'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{goal.icon}</div>
                          <p className="text-sm font-semibold text-gray-900">{goal.label}</p>
                          {selectedGoals.includes(goal.id) && (
                            <CheckCircle2 className="w-5 h-5 text-purple-600 mx-auto mt-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Time Preference */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-black text-gray-900 mb-2">{step.title}</h2>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className="space-y-3">
                      {timePreferences.map((pref) => (
                        <button
                          key={pref.id}
                          onClick={() => setPreferredTime(pref.id)}
                          className={`w-full p-4 rounded-lg border-2 transition-all ${
                            preferredTime === pref.id
                              ? 'border-blue-600 bg-blue-100'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">{pref.icon}</div>
                            <div className="text-left flex-1">
                              <p className="font-semibold text-gray-900">{pref.label}</p>
                              <p className="text-sm text-gray-600">{pref.time}</p>
                            </div>
                            {preferredTime === pref.id && (
                              <CheckCircle2 className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Username */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-black text-gray-900 mb-2">{step.title}</h2>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username" className="text-gray-900 font-semibold">
                          Choose Your Username
                        </Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username..."
                          className="mt-2"
                        />
                      </div>
                      {username && (
                        <div className="p-4 bg-green-100 rounded-lg text-center">
                          <p className="text-green-900 font-semibold">
                            Welcome, {username}! 🎉
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 space-y-3">
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 2 && selectedGoals.length === 0) ||
                (currentStep === 4 && !username.trim())
              }
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold shadow-lg"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Start PRACTICE! ✨
                </>
              )}
            </Button>

            {currentStep === 0 && (
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="sm"
                className="w-full text-gray-500 hover:text-gray-700"
              >
                Skip tour
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
