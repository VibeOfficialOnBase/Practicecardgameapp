import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Flame, Users } from 'lucide-react';
import UserLevelBadge from '../UserLevelBadge';

export default function BuddyLeaderboard({ userEmail }) {
  const { data: connections = [] } = useQuery({
    queryKey: ['buddyConnections', userEmail],
    queryFn: () => base44.entities.BuddyConnection.filter({
      $or: [
        { user_email: userEmail, status: 'accepted' },
        { buddy_email: userEmail, status: 'accepted' }
      ]
    }),
    enabled: !!userEmail
  });

  const buddyEmails = connections.map(conn => 
    conn.user_email === userEmail ? conn.buddy_email : conn.user_email
  );

  const { data: allProfiles = [] } = useQuery({
    queryKey: ['buddyProfiles', buddyEmails],
    queryFn: async () => {
      if (buddyEmails.length === 0) return [];
      const profiles = await base44.entities.UserProfile.list('-current_streak', 50);
      return profiles.filter(p => buddyEmails.includes(p.created_by));
    },
    enabled: buddyEmails.length > 0
  });

  const { data: userLevels = [] } = useQuery({
    queryKey: ['buddyLevels'],
    queryFn: () => base44.entities.UserLevel.list('-level', 50),
  });

  if (allProfiles.length === 0) {
    return (
      <div className="card-organic p-6 text-center">
        <Users className="w-12 h-12 text-purple-300 mx-auto mb-3" />
        <p className="text-body">Connect with buddies to see your shared leaderboard</p>
      </div>
    );
  }

  return (
    <div className="card-organic p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-bold">Buddy Leaderboard</h3>
      </div>

      <div className="space-y-3">
        {allProfiles.map((profile, index) => {
          const userLevel = userLevels.find(ul => ul.user_email === profile.created_by);
          const isCurrentUser = profile.created_by === userEmail;
          
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCurrentUser
                  ? 'bg-purple-100 border-2 border-purple-500'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center text-lg font-bold text-purple-600">
                #{index + 1}
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                {profile.created_by?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-contrast">
                    {profile.display_name || profile.created_by?.split('@')[0] || 'Anonymous'}
                  </p>
                  {userLevel && <UserLevelBadge level={userLevel.level} compact />}
                </div>
                {isCurrentUser && (
                  <span className="text-xs text-purple-600 font-medium">You!</span>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-5 h-5" />
                  <span className="text-xl font-bold">{profile.current_streak || 0}</span>
                </div>
                <p className="text-xs text-label">day streak</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}