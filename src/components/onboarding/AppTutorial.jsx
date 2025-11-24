import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Zap, Users, Trophy, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tutorialSteps = [
  {
    icon: Sparkles,
    title: 'Welcome to PRACTICE',
    description: 'Your daily companion for mindfulness, growth, and connection. Let\'s explore what makes this journey special.',
    highlight: 'practice-card'
  },
  {
    icon: Heart,
    title: 'Daily Practice Cards',
    description: 'Pull a new card each day with affirmations, missions, and LECHE values to guide your practice. Reflect in your journal to complete.',
    highlight: 'daily-pull'
  },
  {
    icon: Zap,
    title: 'Spiritual Games',
    description: 'Transform challenges into playful practice with Chakra Blaster, Challenge Bubbles, and Memory Match. Earn XP and unlock upgrades!',
    highlight: 'games'
  },
  {
    icon: Trophy,
    title: 'Progress & Mastery',
    description: 'Track your growth with streaks, XP levels, and game-specific mastery. Complete weekly challenges for bonus rewards.',
    highlight: 'progress'
  },
  {
    icon: Users,
    title: 'Community Connection',
    description: 'Share achievements, join groups, send gifts, and watch the live pulse tracker for community activity. You\'re never alone!',
    highlight: 'community'
  },
  {
    icon: '🌟',
    title: 'VibeAGotchi',
    description: 'Nurture your spirit companion! Feed, play, and watch it evolve through 6 stages as you practice. Check stats daily!',
    highlight: 'vibeagotchi'
  }
];

export default function AppTutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];
  const Icon = typeof step.icon === 'string' ? null : step.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        key={currentStep}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="card-organic max-w-lg w-full p-8 relative"
      >
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-label hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          {Icon ? (
            <Icon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          ) : (
            <span className="text-6xl block mb-4">{step.icon}</span>
          )}
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{step.title}</h2>
          <p className="text-lg leading-relaxed" style={{ color: '#E8E8E8', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>{step.description}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-purple-500'
                  : index < currentStep
                  ? 'w-2 bg-green-500'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs text-label hover:text-white transition-colors mt-4 text-center w-full"
        >
          Skip Tutorial
        </button>
      </motion.div>
    </motion.div>
  );
}