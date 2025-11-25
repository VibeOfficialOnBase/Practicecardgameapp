import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Globe, Heart, Activity } from 'lucide-react';
import Card from './common/Card';

export default function GlobalPulseTracker() {
  const [displayedPulses, setDisplayedPulses] = useState([]);

  const { data: pulses = [] } = useQuery({
    queryKey: ['activityPulses'],
    queryFn: () => base44.entities.ActivityPulse.list('-created_date', 20),
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const { data: globalStats } = useQuery({
    queryKey: ['globalStats'],
    queryFn: async () => {
      // Mock stats for "Global Pulse" visualization
      return {
        activeNow: Math.floor(Math.random() * 50) + 120,
        totalPractices: 15420,
        globalMood: 'peaceful'
      };
    },
    refetchInterval: 30000
  });

  useEffect(() => {
    if (pulses.length > 0) {
      const latest = pulses.slice(0, 5);
      setDisplayedPulses(latest);
    }
  }, [pulses]);

  // Calculate a "pulse" percentage for the bar based on active users
  const pulsePercentage = Math.min(100, (globalStats?.activeNow || 0) / 2);

  return (
    <Card className="p-4 relative overflow-hidden">
        {/* Pulse Bar Background */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50" />

        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
                </div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">Global Pulse</h3>
            </div>
            <div className="flex items-center gap-1 text-[var(--text-secondary)] text-xs font-mono">
                <Activity className="w-3 h-3" />
                <span>{globalStats?.activeNow || 0} Active</span>
            </div>
        </div>

        {/* Pulse Visualization Bar */}
        <div className="mb-6 relative h-4 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
             <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--accent-soft)] to-[var(--accent-primary)]"
                initial={{ width: 0 }}
                animate={{ width: `${pulsePercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
             />
             <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-[10px] font-bold text-white drop-shadow-md">COMMUNITY ENERGY</span>
             </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl p-2 text-center border border-black/5 dark:border-white/5">
                <Globe className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-[10px] text-[var(--text-secondary)] uppercase">Global</p>
                <p className="font-bold text-[var(--text-primary)] text-sm">{(globalStats?.totalPractices || 0).toLocaleString()}</p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-xl p-2 text-center border border-black/5 dark:border-white/5">
                <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-[10px] text-[var(--text-secondary)] uppercase">Growth</p>
                <p className="font-bold text-[var(--text-primary)] text-sm">+12%</p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-xl p-2 text-center border border-black/5 dark:border-white/5">
                <Heart className="w-4 h-4 text-pink-400 mx-auto mb-1" />
                <p className="text-[10px] text-[var(--text-secondary)] uppercase">Vibe</p>
                <p className="font-bold text-[var(--text-primary)] text-sm capitalize">{globalStats?.globalMood || 'Calm'}</p>
            </div>
        </div>

        {/* Live Feed */}
        <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Live Activity</p>
            <AnimatePresence mode="popLayout">
            {displayedPulses.length > 0 ? (
                displayedPulses.map((pulse, index) => (
                    <motion.div
                    key={pulse.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="text-lg shrink-0">{pulse.action_icon || '✨'}</span>
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-xs text-[var(--text-primary)]">
                                <span className="font-bold text-[var(--accent-primary)]">{pulse.user_email?.split('@')[0] || 'Someone'}</span>
                                <span className="opacity-80"> {pulse.action_description}</span>
                            </p>
                        </div>
                        <span className="text-[10px] text-[var(--text-secondary)] whitespace-nowrap">
                            {getTimeAgo(pulse.created_date)}
                        </span>
                    </motion.div>
                ))
            ) : (
                <p className="text-center text-xs text-[var(--text-secondary)] py-4">Quiet moments...</p>
            )}
            </AnimatePresence>
        </div>
    </Card>
  );
}

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
