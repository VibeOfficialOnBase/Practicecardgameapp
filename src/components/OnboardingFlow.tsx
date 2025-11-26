import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Heart, 
  Users, 
  Flame, 
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

import confetti from 'canvas-confetti';

interface OnboardingFlowProps {
  onComplete: () => void;
  username: string;
}

export function OnboardingFlow({ onComplete, username }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem('practice_onboarding_complete');
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
      onComplete();
    }
  }, [onComplete]);

  const steps = [
    {
      icon: <Sparkles className="w-16 h-16 text-purple-400" />,
      title: "Welcome to PRACTICE!",
      description: "Your daily journey to self-empowerment starts here. Pull one magical card each day for affirmations, missions, and inspiration.",
      emoji: "🌟",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Flame className="w-16 h-16 text-orange-400" />,
      title: "Build Your Streak",
      description: "Pull a card every day to build your streak. The longer your streak, the more powerful your multiplier and the cooler your badge!",
      emoji: "🔥",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Heart className="w-16 h-16 text-pink-400" />,
      title: "Practice LECHE",
      description: "Love, Empathy, Community, Healing, Empowerment. Every card embodies these values to help you grow.",
      emoji: "🥛",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Users className="w-16 h-16 text-blue-400" />,
      title: "Join the Community",
      description: "Share your cards, compete on leaderboards, and support others on their PRACTICE journey.",
      emoji: "👥",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Award className="w-16 h-16 text-yellow-400" />,
      title: "Unlock Achievements",
      description: "Complete challenges, maintain streaks, and unlock exclusive badges as you level up your practice!",
      emoji: "🏆",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Small confetti for progression
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
    // Save onboarding completion
    localStorage.setItem('practice_onboarding_complete', 'true');
    
    // Big celebration confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#34D399'],
      startVelocity: 50,
    });
    
    setTimeout(() => {
      setShowOnboarding(false);
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    localStorage.setItem('practice_onboarding_complete', 'true');
    setShowOnboarding(false);
    onComplete();
  };

  if (!showOnboarding) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20`}
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md"
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
                className="text-center"
              >
                {/* Icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="mb-6 inline-block"
                >
                  {step.icon}
                </motion.div>

                {/* Emoji */}
                <motion.div
                  animate={{ 
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-5xl mb-4"
                >
                  {step.emoji}
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  {step.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Special welcome for first step */}
                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-4"
                  >
                    <p className="text-sm font-semibold text-purple-900">
                      Welcome, <span className="text-pink-600">{username}</span>! ✨
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      Let's take a quick tour...
                    </p>
                  </motion.div>
                )}

                {/* Completion celebration on last step */}
                {currentStep === steps.length - 1 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-900">
                      You're ready to start your journey!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 space-y-3">
            <Button
              onClick={handleNext}
              size="lg"
              className={`w-full bg-gradient-to-r ${step.color} hover:opacity-90 text-white font-bold shadow-lg`}
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
