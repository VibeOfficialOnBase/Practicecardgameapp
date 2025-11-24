import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, UserPlus, Check, X, Send, Trophy, Gift, Zap, Shield, Sparkles, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import CreateChallengeModal from '../components/friends/CreateChallengeModal';
import FriendStreakBadge from '../components/friends/FriendStreakBadge';
import CustomChallengeLeaderboard from '../components/leaderboards/CustomChallengeLeaderboard';
import DailyPracticeLeaderboard from '../components/leaderboards/DailyPracticeLeaderboard';

export default function Friends() {
  const [friendEmail, setFriendEmail] = useState('');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [giftType, setGiftType] = useState('focus_boost');
  const [giftMessage, setGiftMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends', user?.email],
    queryFn: () => base44.entities.Friend.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests', user?.email],
    queryFn: () => base44.entities.Friend.filter({ 
      friend_email: user?.email, 
      status: 'pending' 
    }),
    enabled: !!user
  });

  const sendRequest = useMutation({
    mutationFn: async (email) => {
      return await base44.entities.Friend.create({
        user_email: user.email,
        friend_email: email,
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      setFriendEmail('');
    }
  });

  const acceptRequest = useMutation({
    mutationFn: async (friendId) => {
      await base44.entities.Friend.update(friendId, { 
        status: 'accepted',
        accepted_date: new Date().toISOString()
      });
      // Create reciprocal friendship
      await base44.entities.Friend.create({
        user_email: user.email,
        friend_email: pendingRequests.find(f => f.id === friendId).user_email,
        status: 'accepted',
        accepted_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    }
  });

  const declineRequest = useMutation({
    mutationFn: async (friendId) => {
      await base44.entities.Friend.delete(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    }
  });

  const { data: receivedGifts = [] } = useQuery({
    queryKey: ['receivedGifts', user?.email],
    queryFn: () => base44.entities.FriendGift.filter({ 
      receiver_email: user?.email,
      claimed: false
    }),
    enabled: !!user
  });

  const { data: dailyGiftsSent = [] } = useQuery({
    queryKey: ['dailyGiftsSent', user?.email],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const gifts = await base44.entities.FriendGift.list();
      return gifts.filter(g => 
        g.sender_email === user?.email && 
        g.created_date?.startsWith(today)
      );
    },
    enabled: !!user
  });

  const sendGift = useMutation({
    mutationFn: async () => {
      return await base44.entities.FriendGift.create({
        sender_email: user.email,
        receiver_email: selectedFriend,
        gift_type: giftType,
        amount: 1,
        message: giftMessage
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyGiftsSent'] });
      setShowGiftModal(false);
      setGiftMessage('');
    }
  });

  const claimGift = useMutation({
    mutationFn: async (giftId) => {
      const gift = receivedGifts.find(g => g.id === giftId);
      await base44.entities.FriendGift.update(giftId, { claimed: true });
      
      // Update user's global upgrades
      const progression = await base44.entities.GlobalProgression.filter({ user_email: user.email });
      if (progression.length > 0) {
        const current = progression[0];
        const upgrades = current.global_upgrades || { focus_boost: 0, resilience: 0, clarity: 0 };
        
        if (gift.gift_type === 'focus_boost') upgrades.focus_boost += gift.amount;
        if (gift.gift_type === 'resilience_token') upgrades.resilience += gift.amount;
        if (gift.gift_type === 'clarity_gem') upgrades.clarity += gift.amount;
        
        await base44.entities.GlobalProgression.update(current.id, { global_upgrades: upgrades });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivedGifts'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const canSendMoreGifts = dailyGiftsSent.length < 3;

  const giftTypes = [
    { value: 'focus_boost', label: 'Focus Boost', icon: Zap, description: 'Increases attack speed across all games' },
    { value: 'resilience_token', label: 'Resilience Token', icon: Shield, description: 'Increases max health' },
    { value: 'clarity_gem', label: 'Clarity Gem', icon: Sparkles, description: 'Boosts score multipliers' }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold mb-4 text-center ensure-readable-strong">Friends & Community</h1>
          <p className="text-center mb-10 text-lg text-purple-200 ensure-readable">
            Connect, support, and grow together on your journey.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <CustomChallengeLeaderboard />
            <DailyPracticeLeaderboard />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-organic p-8 mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 ensure-readable-strong flex items-center gap-3">
            <Users className="w-8 h-8" />
            Add Friends
          </h2>
          <p className="ensure-readable mb-6">Connect with others on your spiritual journey</p>

          <div className="flex gap-3">
            <Input
              placeholder="Enter friend's email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => sendRequest.mutate(friendEmail)}
              disabled={!friendEmail || sendRequest.isPending}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Send Request
            </Button>
          </div>
        </motion.div>

        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-organic p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 ensure-readable-strong">
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-xl"
                >
                  <span className="ensure-readable font-medium">
                    {request.user_email}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptRequest.mutate(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => declineRequest.mutate(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {receivedGifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-organic p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 ensure-readable-strong flex items-center gap-2">
              <Gift className="w-6 h-6 text-amber-400" />
              Gifts Received ({receivedGifts.length})
            </h2>
            <div className="space-y-3">
              {receivedGifts.map((gift) => {
                const giftInfo = giftTypes.find(t => t.value === gift.gift_type);
                const Icon = giftInfo?.icon || Gift;
                return (
                  <div
                    key={gift.id}
                    className="flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 rounded-xl border border-amber-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-amber-400" />
                      <div>
                        <p className="font-semibold ensure-readable">
                          {giftInfo?.label} from {gift.sender_email.split('@')[0]}
                        </p>
                        {gift.message && (
                          <p className="text-sm text-label italic">"{gift.message}"</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => claimGift.mutate(gift.id)}
                      className="bg-gradient-to-r from-amber-600 to-orange-600"
                    >
                      Claim
                    </Button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-organic p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold ensure-readable-strong">
              My Friends ({acceptedFriends.length})
            </h2>
            <p className="text-sm text-label">
              Daily Gifts: {dailyGiftsSent.length}/3
            </p>
          </div>
          
          {acceptedFriends.length === 0 ? (
            <p className="text-center ensure-readable py-8">
              No friends yet. Send a request to get started!
            </p>
          ) : (
            <div className="grid gap-4">
              {acceptedFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold ensure-readable">
                        {friend.friend_email.split('@')[0]}
                      </p>
                      <p className="text-sm text-label">
                        Friends since {new Date(friend.accepted_date).toLocaleDateString()}
                      </p>
                      <FriendStreakBadge 
                        userEmail={user?.email} 
                        friendEmail={friend.friend_email} 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFriend(friend.friend_email);
                        setShowGiftModal(true);
                      }}
                      disabled={!canSendMoreGifts}
                      className="flex items-center gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      Gift
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFriend(friend.friend_email);
                        setShowChallengeModal(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Challenge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {showGiftModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowGiftModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="card-organic p-6 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold mb-4 ensure-readable-strong">
                  Send a Gift
                </h3>
                <p className="text-label mb-4">
                  To: {selectedFriend?.split('@')[0]}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">
                      Choose Gift Type
                    </label>
                    <Select value={giftType} onValueChange={setGiftType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {giftTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <div>
                                  <p className="font-semibold">{type.label}</p>
                                  <p className="text-xs text-muted-foreground">{type.description}</p>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">
                      Add a Message (Optional)
                    </label>
                    <Textarea
                      placeholder="Keep going, you've got this!"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowGiftModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => sendGift.mutate()}
                      disabled={sendGift.isPending}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Gift
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showChallengeModal && (
          <CreateChallengeModal
            friendEmail={selectedFriend}
            onClose={() => {
              setShowChallengeModal(false);
              setSelectedFriend(null);
            }}
          />
        )}
      </div>
    </div>
  );
}