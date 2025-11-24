import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Heart, CheckCircle2, X, MessageCircle, Trophy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DirectMessage from '../messaging/DirectMessage';
import EndorseUser from '../endorsements/EndorseUser';
import BuddyLeaderboard from './BuddyLeaderboard';

export default function BuddySystem({ userEmail }) {
  const queryClient = useQueryClient();
  const [showFinder, setShowFinder] = React.useState(false);

  const { data: myConnections = [] } = useQuery({
    queryKey: ['buddyConnections', userEmail],
    queryFn: async () => {
      const sent = await base44.entities.BuddyConnection.filter({ user_email: userEmail });
      const received = await base44.entities.BuddyConnection.filter({ buddy_email: userEmail });
      return [...sent, ...received];
    },
  });

  const { data: potentialBuddies = [] } = useQuery({
    queryKey: ['potentialBuddies', userEmail],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ looking_for_buddy: true });
      const users = await base44.entities.User.list();
      
      return profiles
        .filter(p => p.created_by !== userEmail)
        .map(p => {
          const user = users.find(u => u.email === p.created_by);
          return { ...p, user };
        })
        .slice(0, 10);
    },
    enabled: showFinder,
  });

  const sendRequest = useMutation({
    mutationFn: async ({ buddyEmail, focus }) => {
      await base44.entities.BuddyConnection.create({
        user_email: userEmail,
        buddy_email: buddyEmail,
        shared_focus: focus,
        connection_date: new Date().toISOString(),
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buddyConnections'] });
      queryClient.invalidateQueries({ queryKey: ['potentialBuddies'] });
    }
  });

  const respondToRequest = useMutation({
    mutationFn: async ({ connectionId, accept }) => {
      await base44.entities.BuddyConnection.update(connectionId, {
        status: accept ? 'accepted' : 'declined'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buddyConnections'] });
    }
  });

  const acceptedBuddies = myConnections.filter(c => c.status === 'accepted');
  const pendingRequests = myConnections.filter(c => c.buddy_email === userEmail && c.status === 'pending');

  return (
    <div className="card-organic p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">PRACTICE Buddies</h3>
        </div>
        <button
          onClick={() => setShowFinder(!showFinder)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          Find Buddies
        </button>
      </div>

      {pendingRequests.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Pending Requests</h4>
          {pendingRequests.map(req => (
            <div key={req.id} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white font-medium">{req.user_email}</p>
                <p className="text-sm text-slate-400 mb-2">Wants to connect on: {req.shared_focus}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondToRequest.mutate({ connectionId: req.id, accept: true })}
                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToRequest.mutate({ connectionId: req.id, accept: false })}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {acceptedBuddies.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
          {acceptedBuddies.map(buddy => {
            const buddyEmail = buddy.user_email === userEmail ? buddy.buddy_email : buddy.user_email;
            return (
              <motion.div
                key={buddy.id}
                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{buddyEmail}</p>
                    <p className="text-sm text-slate-400 mb-3">{buddy.shared_focus}</p>
                    <div className="flex gap-2">
                      <DirectMessage buddyEmail={buddyEmail} userEmail={userEmail} />
                      <EndorseUser endorsedEmail={buddyEmail} userEmail={userEmail} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <Users className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
          <p className="text-slate-300">No buddies yet</p>
          <p className="text-sm text-slate-400">Connect with others on similar PRACTICE journeys</p>
        </div>
      )}

      {showFinder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-3">People Looking for Buddies</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {potentialBuddies.map(profile => (
              <div key={profile.id} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{profile.display_name || 'Anonymous PRACTITIONER'}</p>
                  {profile.buddy_focus_areas && profile.buddy_focus_areas.length > 0 && (
                    <p className="text-sm text-slate-400">Focus: {profile.buddy_focus_areas.join(', ')}</p>
                  )}
                </div>
                <button
                  onClick={() => sendRequest.mutate({ 
                    buddyEmail: profile.created_by,
                    focus: profile.buddy_focus_areas?.[0] || 'General PRACTICE'
                  })}
                  className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-all"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Buddy Leaderboard */}
      {acceptedBuddies.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <BuddyLeaderboard userEmail={userEmail} />
        </div>
      )}
    </div>
  );
}