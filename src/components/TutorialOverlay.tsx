import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Star, BookOpen, Share2, Sparkles, Heart, Users, Sprout, Zap, Trophy, Gift, TrendingUp } from 'lucide-react';

const TUTORIAL_STORAGE_KEY = 'practice_tutorial_completed';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  spotlight?: {
    top?: string;
    left?: string;
    width?: string;
    height?: string;
  };
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to PRACTICE! 🎯',
    description: 'A daily ritual of growth and reflection, one card at a time. Designed by Eddie Pabon — Author, Breathwork Coach, and Creator of the $VibeOfficial Token on Base. Each day, pull a card and engage with actions that deepen your connection to the LECHE principles.',
    icon: <Sparkles className="w-12 h-12 text-yellow-400" />,
  },
  {
    title: 'The LECHE Way 🥛',
    description: 'PRACTICE is built on five core principles: ❤️ Love (Compassion for self & others) • 🤝 Empathy (Understanding & connection) • 👥 Community (Building together) • 🌱 Healing (Growth & restoration) • 💪 Empowerment (Strength to create change)',
    icon: <div className="text-5xl">🥛</div>,
  },
  {
    title: 'Getting Started ⚡',
    description: 'PRACTICE is powered by $VibeOfficial tokens on the Base blockchain. Everyone can use the app for free! Holders of $VibeOfficial get exclusive perks like giveaways and special achievements. Base offers lightning-fast transactions and minimal fees.',
    icon: <Zap className="w-12 h-12 text-yellow-400" />,
  },
  {
    title: 'Your Daily Practice 🎴',
    description: 'Every day, pull one card and engage: 🎴 Pull your card • ❤️ Favorite cards that resonate (+10 XP) • 📝 Journal your reflections (+50 XP) • 🔗 Share inspiration (+5 XP) • 🔥 Build your daily streak!',
    icon: <div className="text-5xl">🎴</div>,
  },
  {
    title: 'Achievements & Community 🏆',
    description: '🏆 Unlock achievements like "First Pull" and "7-Day Streak" • 📊 Climb the leaderboard with XP and streaks • 👥 See real-time community stats • 🎁 Enter giveaways based on your activity',
    icon: <Trophy className="w-12 h-12 text-yellow-400" />,
  },
  {
    title: "You're Ready! 🚀",
    description: 'This is about progress, not perfection. Show up each day, engage with your cards, and watch yourself grow. PRACTICE leads to LECHE — Love, Empathy, Community, Healing, Empowerment. Pull your first card and begin! 🎴',
    icon: <div className="text-5xl">🎉</div>,
  },
];

export function TutorialOverlay() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    // Check if tutorial has been completed
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (!completed) {
        // Show tutorial after a brief delay
        setTimeout(() => setIsVisible(true), 500);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    }
    setIsVisible(false);
  };

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Dim overlay with flexbox centering */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={handleNext}
          >
            {/* Tutorial modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto z-[101]"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 border-2 border-purple-400/50 rounded-2xl p-4 sm:p-8 shadow-2xl relative">
              {/* Skip button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-2 sm:mb-3">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {currentStepData.icon}
                </motion.div>
              </div>

              {/* Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center space-y-1 sm:space-y-2"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentStepData.title}
                </h2>
                <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
                  {currentStepData.description}
                </p>
              </motion.div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-2 sm:mt-3 mb-1 sm:mb-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-8 bg-purple-400'
                        : index < currentStep
                        ? 'w-2 bg-purple-400/50'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/10 rounded-full h-2 mb-2 sm:mb-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:gap-3">
                {currentStep > 0 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="outline"
                    className="flex-1 border-white/30 text-white hover:bg-white/10 text-sm sm:text-base"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm sm:text-base"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Let's Go! 🚀" : 'Next'}
                </Button>
              </div>

              {/* Tap anywhere hint */}
              <p className="text-center text-white/40 text-xs mt-1 sm:mt-2">
                Tap anywhere to continue
              </p>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
