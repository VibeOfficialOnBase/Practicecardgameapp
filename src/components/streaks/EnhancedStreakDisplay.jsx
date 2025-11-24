import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, TrendingUp, Shield, Heart, Zap } from 'lucide-react';

export default function EnhancedStreakDisplay({ profile, onUseFreeze, onUseRevival }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyProgress = profile?.monthly_streak || 0;
  const yearlyProgress = profile?.yearly_streak || 0;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInYear = 365;

  const milestones = [
    { days: 7, icon: Flame, label: 'Week Warrior', color: 'text-orange-400' },
    { days: 30, icon: Calendar, label: 'Month Master', color: 'text-amber-400' },
    { days: 100, icon: TrendingUp, label: 'Century Club', color: 'text-purple-400' },
    { days: 365, icon: Zap, label: 'Year Legend', color: 'text-pink-400' }
  ];

  const currentMilestone = [...milestones].reverse().find(m => (profile?.current_streak || 0) >= m.days) || milestones[0];
  const nextMilestone = milestones.find(m => m.days > (profile?.current_streak || 0));

  return (
    <div className="space-y-4">
      {/* Current Streak - Large Display */}
      <div className="card-organic p-8 text-center relative overflow-hidden">
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        />

        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <currentMilestone.icon className={`w-16 h-16 ${currentMilestone.color} mx-auto mb-4`} />
          </motion.div>
          
          <motion.div
            key={profile?.current_streak}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent mb-2"
          >
            {profile?.current_streak || 0}
          </motion.div>
          
          <p className="text-white text-xl font-semibold mb-1">Day Streak</p>
          <p className="text-slate-400 text-sm">{currentMilestone.label}</p>
        </div>
      </div>

      {/* Monthly & Yearly Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-organic p-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-semibold">This Month</h4>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">{monthlyProgress} days</span>
              <span className="text-blue-400 font-semibold">{Math.round((monthlyProgress / daysInMonth) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(monthlyProgress / daysInMonth) * 100}%` }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">{daysInMonth - monthlyProgress} days remaining</p>
        </div>

        <div className="card-organic p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-semibold">This Year</h4>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">{yearlyProgress} days</span>
              <span className="text-purple-400 font-semibold">{Math.round((yearlyProgress / daysInYear) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(yearlyProgress / daysInYear) * 100}%` }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">{daysInYear - yearlyProgress} days remaining</p>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="card-organic p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <nextMilestone.icon className={`w-8 h-8 ${nextMilestone.color}`} />
              <div>
                <p className="text-white font-semibold">{nextMilestone.label}</p>
                <p className="text-sm text-slate-400">
                  {nextMilestone.days - (profile?.current_streak || 0)} days to go
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">{nextMilestone.days}</p>
              <p className="text-xs text-slate-400">day goal</p>
            </div>
          </div>
        </div>
      )}

      {/* Streak Protection */}
      <div className="card-organic p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h4 className="text-white font-semibold">Streak Protection</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">Freezes</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{profile?.streak_freezes_available || 0}</p>
            {(profile?.streak_freezes_available || 0) > 0 && (
              <button
                onClick={onUseFreeze}
                className="mt-2 w-full py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs transition-all"
              >
                Activate
              </button>
            )}
          </div>

          <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-slate-300">Revivals</span>
            </div>
            <p className="text-2xl font-bold text-pink-400">{profile?.streak_revivals_available || 0}</p>
            {(profile?.streak_revivals_available || 0) > 0 && (profile?.current_streak || 0) === 0 && (
              <button
                onClick={onUseRevival}
                className="mt-2 w-full py-1 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg text-xs transition-all"
              >
                Use Revival
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 text-center">
          Earn protections by reaching milestones
        </p>
      </div>
    </div>
  );
}