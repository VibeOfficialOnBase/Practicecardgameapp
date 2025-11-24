import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function GlobalPulseTracker() {
  const [displayedPulses, setDisplayedPulses] = useState([]);

  const { data: pulses = [] } = useQuery({
    queryKey: ['activityPulses'],
    queryFn: () => base44.entities.ActivityPulse.list('-created_date', 20),
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  useEffect(() => {
    if (pulses.length > 0) {
      const latest = pulses.slice(0, 5);
      setDisplayedPulses(latest);
    }
  }, [pulses]);

  if (displayedPulses.length === 0) return null;

  return (
    <div className="card-organic p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h3 className="font-bold ensure-readable-strong">Live Community Pulse</h3>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayedPulses.map((pulse, index) => (
            <motion.div
              key={pulse.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-white/5 rounded-lg p-2 text-sm"
            >
              <span className="text-2xl">{pulse.action_icon || '✨'}</span>
              <div className="flex-1 min-w-0">
                <p className="ensure-readable truncate">
                  <span className="font-semibold">{pulse.user_email?.split('@')[0]}</span>{' '}
                  {pulse.action_description}
                </p>
              </div>
              <span className="text-xs text-label whitespace-nowrap">
                {getTimeAgo(pulse.created_date)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}