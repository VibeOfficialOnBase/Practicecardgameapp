import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Smile, Swords, Wind } from 'lucide-react';
import { MeditationPlayer } from './MeditationPlayer';
import { GoalTracker } from './GoalTracker';
import { MoodTracker } from './MoodTracker';
import { QuestSystem } from './QuestSystem';

interface WellnessPageProps {
  username: string;
}

type WellnessTab = 'overview' | 'meditation' | 'goals' | 'mood' | 'quests';

export function WellnessPage({ username }: WellnessPageProps) {
  const [activeTab, setActiveTab] = useState<WellnessTab>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Wellness Center
        </h1>
        <p className="text-white/80 text-sm">
          Your complete self-empowerment toolkit
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Heart className="w-5 h-5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('meditation')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'meditation'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Wind className="w-5 h-5" />
          Breathwork & Meditation
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'goals'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Target className="w-5 h-5" />
          Goals
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'mood'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Smile className="w-5 h-5" />
          Mood
        </button>
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'quests'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Swords className="w-5 h-5" />
          Quests
        </button>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🌟</div>
                  <h2 className="text-2xl font-bold text-white">
                    Welcome to Your Wellness Journey
                  </h2>
                  <p className="text-white/80">
                    Track your meditation, set meaningful goals, monitor your mood, and complete quests. 
                    Everything you need for holistic self-empowerment in one place.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <Wind className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-white/60">Meditations</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-white/60">Goals Set</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <Smile className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-white/60">Mood Logs</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <Swords className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-white/60">Quests Done</p>
                </CardContent>
              </Card>
            </div>

            {/* Features Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="glass-card cursor-pointer hover:glass-card-hover" onClick={() => setActiveTab('meditation')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wind className="w-6 h-6 text-cyan-400" />
                    Breathwork & Meditation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm mb-3">
                    Guided breathwork patterns and meditation sessions to calm your mind and center your energy.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>• Box Breathing</li>
                    <li>• 4-7-8 Method</li>
                    <li>• Wim Hof Technique</li>
                    <li>• 3-5 minute meditations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card cursor-pointer hover:glass-card-hover" onClick={() => setActiveTab('goals')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-yellow-400" />
                    Personal Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm mb-3">
                    Set and track meaningful goals across all areas of your PRACTICE journey.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>• Streak goals</li>
                    <li>• Collection goals</li>
                    <li>• Meditation goals</li>
                    <li>• Custom goals</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card cursor-pointer hover:glass-card-hover" onClick={() => setActiveTab('mood')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Smile className="w-6 h-6 text-green-400" />
                    Mood Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm mb-3">
                    Monitor your emotional wellbeing and identify patterns in your mood over time.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>• Daily mood check-ins</li>
                    <li>• Trend analysis</li>
                    <li>• Journal notes</li>
                    <li>• Insights & recommendations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card cursor-pointer hover:glass-card-hover" onClick={() => setActiveTab('quests')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Swords className="w-6 h-6 text-purple-400" />
                    Quest System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm mb-3">
                    Complete daily and weekly quests to earn XP, entries, and special rewards.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>• Daily quests (reset daily)</li>
                    <li>• Weekly challenges</li>
                    <li>• Special events</li>
                    <li>• Bonus rewards</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'meditation' && (
          <MeditationPlayer 
            onComplete={(duration, type) => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Completed ${type} for ${duration}s`);
              }
            }}
          />
        )}

        {activeTab === 'goals' && (
          <GoalTracker 
            username={username}
            onGoalComplete={(goal) => {
              if (process.env.NODE_ENV === 'development') {
                console.log('Goal completed:', goal);
              }
            }}
          />
        )}

        {activeTab === 'mood' && (
          <MoodTracker 
            username={username}
            onMoodLog={(mood) => {
              if (process.env.NODE_ENV === 'development') {
                console.log('Mood logged:', mood);
              }
            }}
          />
        )}

        {activeTab === 'quests' && (
          <QuestSystem 
            username={username}
            onQuestComplete={(quest) => {
              if (process.env.NODE_ENV === 'development') {
                console.log('Quest completed:', quest);
              }
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
