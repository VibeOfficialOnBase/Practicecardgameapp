import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Users, Calendar, ArrowRight } from 'lucide-react';

const OnboardingScreen = ({ children, onNext, onSkip, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ type: "spring", stiffness: 200, damping: 30 }}
    className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
  >
    {children}
    
    <div className="flex gap-4 mt-8">
      {onSkip && !isLast && (
        <button
          onClick={onSkip}
          className="px-6 py-2 text-stone-600 hover:text-stone-800 transition-colors font-medium"
        >
          Skip
        </button>
      )}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-primary flex items-center gap-2"
      >
        {isLast ? 'Begin Your Journey' : 'Next'}
        {!isLast && <ArrowRight className="w-5 h-5" />}
      </motion.button>
    </div>
  </motion.div>
);

const RisingSunIllustration = () => (
  <motion.svg width="200" height="150" viewBox="0 0 200 150" className="mb-8">
    {/* Horizon line */}
    <motion.line
      x1="0" y1="100" x2="200" y2="100"
      stroke="#D4A574"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
    
    {/* Rising sun */}
    <motion.circle
      cx="100" cy="100" r="30"
      fill="url(#sunGradient)"
      initial={{ cy: 130, opacity: 0 }}
      animate={{ cy: 100, opacity: 1 }}
      transition={{ duration: 1.5, type: "spring" }}
    />
    
    {/* Sun rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.line
        key={i}
        x1="100" y1="100"
        x2={100 + Math.cos((angle * Math.PI) / 180) * 50}
        y2={100 + Math.sin((angle * Math.PI) / 180) * 50}
        stroke="#E8B563"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 1 + i * 0.1, repeat: Infinity }}
      />
    ))}
    
    <defs>
      <linearGradient id="sunGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8B563" />
        <stop offset="100%" stopColor="#D4A574" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const JourneyPathIllustration = () => (
  <motion.svg width="220" height="160" viewBox="0 0 220 160" className="mb-8">
    {/* Winding path */}
    <motion.path
      d="M 20 140 Q 60 120 80 100 Q 100 80 120 80 Q 140 80 160 60 Q 180 40 200 30"
      stroke="#D4A574"
      strokeWidth="3"
      fill="none"
      strokeDasharray="5,5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2 }}
    />
    
    {/* Card icon */}
    <motion.rect
      x="70" y="90" width="20" height="28" rx="3"
      fill="#E8B563"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
    />
    
    {/* Reflection icon */}
    <motion.circle
      cx="130" cy="75" r="15"
      fill="none"
      stroke="#A8B5A0"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
    />
    <motion.path
      d="M 125 75 L 130 80 L 140 70"
      stroke="#A8B5A0"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.2 }}
    />
    
    {/* Community icon */}
    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring" }}>
      <circle cx="180" cy="45" r="8" fill="#D4A5A5" />
      <circle cx="195" cy="45" r="8" fill="#D4A5A5" />
      <circle cx="187.5" cy="55" r="8" fill="#D4A5A5" />
    </motion.g>
  </motion.svg>
);

const CommunityCircleIllustration = () => (
  <motion.svg width="180" height="180" viewBox="0 0 180 180" className="mb-8">
    {/* Connecting lines */}
    {[[90, 40, 90, 90], [90, 90, 50, 120], [90, 90, 130, 120]].map((line, i) => (
      <motion.line
        key={i}
        x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]}
        stroke="#E8B563"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
      />
    ))}
    
    {/* People circles */}
    {[
      { x: 90, y: 40, color: '#D4A574' },
      { x: 90, y: 90, color: '#A8B5A0' },
      { x: 50, y: 120, color: '#D4A5A5' },
      { x: 130, y: 120, color: '#E8B563' }
    ].map((person, i) => (
      <motion.circle
        key={i}
        cx={person.x} cy={person.y} r="20"
        fill={person.color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
      />
    ))}
    
    {/* Shared glow */}
    <motion.circle
      cx="90" cy="80" r="60"
      fill="#E8B563"
      opacity="0.15"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

export default function OnboardingFlow({ onComplete }) {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      illustration: <RisingSunIllustration />,
      title: "Welcome to PRACTICE",
      description: "A warm space for daily growth, reflection, and community connection. Each day brings a new practice to nurture your journey."
    },
    {
      illustration: <JourneyPathIllustration />,
      title: "Your Daily Practice",
      description: "Pull a card each day to receive a mindful practice. Complete it at your own pace, reflect on your experience, and watch your growth unfold."
    },
    {
      illustration: <CommunityCircleIllustration />,
      title: "Grow Together",
      description: "Share your reflections, celebrate milestones, and connect with a supportive community on the same journey of growth."
    }
  ];

  const handleNext = () => {
    if (currentScreen === screens.length - 1) {
      localStorage.setItem('practice_onboarding_complete', 'true');
      onComplete();
    } else {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('practice_onboarding_complete', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 texture-paper overflow-auto">
      <AnimatePresence mode="wait">
        <OnboardingScreen
          key={currentScreen}
          onNext={handleNext}
          onSkip={currentScreen < screens.length - 1 ? handleSkip : null}
          isLast={currentScreen === screens.length - 1}
        >
          {screens[currentScreen].illustration}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold font-heading text-stone-800 mb-4 text-center"
          >
            {screens[currentScreen].title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-stone-600 text-lg text-center max-w-md leading-relaxed"
          >
            {screens[currentScreen].description}
          </motion.p>
          
          <div className="flex gap-2 mt-8">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentScreen
                    ? 'w-8 bg-amber-600'
                    : 'w-2 bg-amber-300'
                }`}
              />
            ))}
          </div>
        </OnboardingScreen>
      </AnimatePresence>
    </div>
  );
}