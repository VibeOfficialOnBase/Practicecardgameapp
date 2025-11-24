import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FriendStreakBadge({ userEmail, friendEmail }) {
  const { data: streak } = useQuery({
    queryKey: ['friendStreak', userEmail, friendEmail],
    queryFn: async () => {
      const [email1, email2] = [userEmail, friendEmail].sort();
      const streaks = await base44.entities.FriendStreak.filter({
        user_email_1: email1,
        user_email_2: email2
      });
      return streaks[0];
    },
    enabled: !!userEmail && !!friendEmail
  });

  if (!streak || streak.current_streak === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
    >
      <Flame className="w-4 h-4" />
      {streak.current_streak} Day Streak!
      {streak.longest_streak > 7 && (
        <Trophy className="w-4 h-4" />
      )}
    </motion.div>
  );
}