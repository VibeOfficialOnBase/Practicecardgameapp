import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Globe, Heart } from 'lucide-react';

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

  if (displayedPulses.length === 0) return null;

  return (
    <div className="space-y-4">
        {/* Global Stats Viz */}
        <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
                <Globe className="w-5 h-5 text-blue-400 mx-auto mb-1 animate-pulse" />
                <p className="text-xs text-gray-400">Active</p>
                <p className="font-bold text-white">{globalStats?.activeNow || '...'}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Practices</p>
                <p className="font-bold text-white">{(globalStats?.totalPractices + displayedPulses.length).toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center backdrop-blur-sm">
                <Heart className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Vibe</p>
                <p className="font-bold text-white capitalize">{globalStats?.globalMood || '...'}</p>
            </div>
        </div>

        <div className="card-organic p-4">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <h3 className="font-bold ensure-readable-strong text-sm">Live Community Pulse</h3>
        </div>

        <div className="space-y-2">
            <AnimatePresence mode="popLayout">
            {displayedPulses.map((pulse, index) => (
                <motion.div
                key={pulse.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 bg-white/5 rounded-lg p-2 text-sm border border-white/5"
                >
                <span className="text-xl">{pulse.action_icon || '✨'}</span>
                <div className="flex-1 min-w-0">
                    <p className="ensure-readable truncate text-xs sm:text-sm">
                    <span className="font-semibold text-purple-200">{pulse.user_email?.split('@')[0]}</span>{' '}
                    <span className="text-white/80">{pulse.action_description}</span>
                    </p>
                </div>
                <span className="text-[10px] text-white/50 whitespace-nowrap">
                    {getTimeAgo(pulse.created_date)}
                </span>
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
        </div>
    </div>
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
