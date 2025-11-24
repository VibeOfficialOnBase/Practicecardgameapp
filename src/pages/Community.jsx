import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Plus, Search, Heart, Sparkles, Trophy, Shield, X, Check, Send, Gift, Target, Zap, MessageCircle, Share2, Image as ImageIcon } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateChallengeModal from '../components/friends/CreateChallengeModal';
import FriendStreakBadge from '../components/friends/FriendStreakBadge';
import CustomChallengeLeaderboard from '../components/leaderboards/CustomChallengeLeaderboard';
import DailyPracticeLeaderboard from '../components/leaderboards/DailyPracticeLeaderboard';
import { format } from 'date-fns';

const groupTypeIcons = {
  practice: Sparkles,
  gaming: Trophy,
  support: Heart,
  general: Users
};

const giftTypes = [
  { value: 'focus_boost', label: 'Focus Boost', icon: Zap, description: 'Increases attack speed' },
  { value: 'resilience_token', label: 'Resilience Token', icon: Shield, description: 'Increases max health' },
  { value: 'clarity_gem', label: 'Clarity Gem', icon: Sparkles, description: 'Boosts score multipliers' }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed');
  const [friendEmail, setFriendEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [giftType, setGiftType] = useState('focus_boost');
  const [giftMessage, setGiftMessage] = useState('');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    group_type: 'general',
    privacy: 'public',
    leche_focus: 'All',
    avatar_emoji: '✨'
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentingOn, setCommentingOn] = useState(null);
  const [commentText, setCommentText] = useState('');

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Friends data
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

  // Groups data
  const { data: allGroups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.Group.filter({ is_active: true })
  });

  const { data: myMemberships = [] } = useQuery({
    queryKey: ['groupMemberships', user?.email],
    queryFn: () => base44.entities.GroupMember.filter({ user_email: user?.email }),
    enabled: !!user
  });

  // Mutations
  const sendFriendRequest = useMutation({
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
    mutationFn: (friendId) => base44.entities.Friend.delete(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    }
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
    }
  });

  const createGroup = useMutation({
    mutationFn: async () => {
      const group = await base44.entities.Group.create({
        ...newGroup,
        creator_email: user.email,
        member_count: 1
      });
      
      await base44.entities.GroupMember.create({
        group_id: group.id,
        user_email: user.email,
        role: 'admin',
        joined_date: new Date().toISOString()
      });

      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupMemberships'] });
      setShowCreateGroupModal(false);
      setNewGroup({
        name: '',
        description: '',
        group_type: 'general',
        privacy: 'public',
        leche_focus: 'All',
        avatar_emoji: '✨'
      });
    }
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId) => {
      await base44.entities.GroupMember.create({
        group_id: groupId,
        user_email: user.email,
        role: 'member',
        joined_date: new Date().toISOString()
      });

      const group = allGroups.find(g => g.id === groupId);
      if (group) {
        await base44.entities.Group.update(groupId, {
          member_count: group.member_count + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupMemberships'] });
    }
  });

  const leaveGroup = useMutation({
    mutationFn: async (groupId) => {
      const membership = myMemberships.find(m => m.group_id === groupId);
      if (membership) {
        await base44.entities.GroupMember.delete(membership.id);

        const group = allGroups.find(g => g.id === groupId);
        if (group) {
          await base44.entities.Group.update(groupId, {
            member_count: Math.max(0, group.member_count - 1)
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupMemberships'] });
    }
  });

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const canSendMoreGifts = dailyGiftsSent.length < 3;

  // Social Feed data
  const { data: posts = [] } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 50)
  });

  const { data: myPostLikes = [] } = useQuery({
    queryKey: ['myPostLikes', user?.email],
    queryFn: () => base44.entities.PostLike.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const { data: postComments = [] } = useQuery({
    queryKey: ['postComments', commentingOn],
    queryFn: () => base44.entities.PostComment.filter({ post_id: commentingOn }),
    enabled: !!commentingOn
  });

  const createPost = useMutation({
    mutationFn: async () => {
      return await base44.entities.SocialPost.create({
        user_email: user.email,
        content: newPostContent,
        post_type: 'update',
        image_url: selectedImage,
        visibility: 'public'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
      setNewPostContent('');
      setSelectedImage(null);
    }
  });

  const likePost = useMutation({
    mutationFn: async (postId) => {
      const existing = myPostLikes.find(l => l.post_id === postId);
      if (existing) {
        await base44.entities.PostLike.delete(existing.id);
        const post = posts.find(p => p.id === postId);
        if (post) {
          await base44.entities.SocialPost.update(postId, {
            likes_count: Math.max(0, post.likes_count - 1)
          });
        }
      } else {
        await base44.entities.PostLike.create({
          post_id: postId,
          user_email: user.email
        });
        const post = posts.find(p => p.id === postId);
        if (post) {
          await base44.entities.SocialPost.update(postId, {
            likes_count: post.likes_count + 1
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPostLikes'] });
    }
  });

  const addComment = useMutation({
    mutationFn: async (postId) => {
      await base44.entities.PostComment.create({
        post_id: postId,
        user_email: user.email,
        comment: commentText
      });
      const post = posts.find(p => p.id === postId);
      if (post) {
        await base44.entities.SocialPost.update(postId, {
          comments_count: post.comments_count + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
      setCommentingOn(null);
      setCommentText('');
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setSelectedImage(file_url);
    }
  };

  const getPostIcon = (type) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'high_score': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'challenge_complete': return <Target className="w-5 h-5 text-green-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const myGroupIds = myMemberships.map(m => m.group_id);
  const filteredGroups = allGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || group.group_type === filterType;
    return matchesSearch && matchesType;
  });

  const myGroups = filteredGroups.filter(g => myGroupIds.includes(g.id));
  const discoverGroups = filteredGroups.filter(g => !myGroupIds.includes(g.id));

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-center ensure-readable-strong">Community</h1>
          <p className="text-center text-lg text-label mb-8">
            Connect, compete, and grow together
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <CustomChallengeLeaderboard />
            <DailyPracticeLeaderboard />
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <motion.div className="card-organic p-6">
              <Textarea
                placeholder="Share your thoughts, achievements, or ask for support..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="mb-4 min-h-24"
              />
              
              {selectedImage && (
                <div className="mb-4 relative">
                  <img src={selectedImage} alt="Upload" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outline" size="sm" className="cursor-pointer" as="span">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                </label>
                <Button
                  onClick={() => createPost.mutate()}
                  disabled={!newPostContent.trim() || createPost.isPending}
                  className="ml-auto bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </motion.div>

            {/* Feed */}
            <div className="space-y-4">
              <AnimatePresence>
                {posts.map((post, index) => {
                  const isLiked = myPostLikes.some(l => l.post_id === post.id);
                  
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-organic p-6"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <UserAvatar userEmail={post.user_email} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold ensure-readable">{post.user_email?.split('@')[0] || 'Anonymous'}</p>
                            {getPostIcon(post.post_type)}
                          </div>
                          <p className="text-xs text-label">{format(new Date(post.created_date), 'MMM d, yyyy • h:mm a')}</p>
                        </div>
                      </div>

                      <p className="ensure-readable mb-4 whitespace-pre-wrap">{post.content}</p>

                      {post.image_url && (
                        <img src={post.image_url} alt="Post" className="w-full rounded-xl mb-4" />
                      )}

                      {post.achievement_data && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                          <p className="text-sm font-semibold ensure-readable">
                            🏆 {post.achievement_data.title}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        <button
                          onClick={() => likePost.mutate(post.id)}
                          className="flex items-center gap-2 hover:text-pink-400 transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
                          <span className="text-sm ensure-readable">{post.likes_count || 0}</span>
                        </button>
                        
                        <button
                          onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm ensure-readable">{post.comments_count || 0}</span>
                        </button>

                        <button className="flex items-center gap-2 hover:text-green-400 transition-colors ml-auto">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {commentingOn === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <div className="space-y-3 mb-4">
                              {postComments.map(comment => (
                                <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs font-semibold ensure-readable mb-1">
                                    {comment.user_email?.split('@')[0]}
                                  </p>
                                  <p className="text-sm ensure-readable">{comment.comment}</p>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-sm ensure-readable"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && commentText.trim()) {
                                    addComment.mutate(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => addComment.mutate(post.id)}
                                disabled={!commentText.trim()}
                              >
                                Send
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="friends" className="space-y-6">
            {/* Add Friends */}
            <motion.div className="card-organic p-8">
              <h2 className="text-2xl font-bold mb-2 ensure-readable-strong flex items-center gap-3">
                <Users className="w-8 h-8" />
                Add Friends
              </h2>
              <p className="ensure-readable mb-6">Connect with others on your journey</p>

              <div className="flex gap-3">
                <Input
                  placeholder="Enter friend's email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => sendFriendRequest.mutate(friendEmail)}
                  disabled={!friendEmail || sendFriendRequest.isPending}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Send
                </Button>
              </div>
            </motion.div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <motion.div className="card-organic p-6">
                <h2 className="text-2xl font-bold mb-4 ensure-readable-strong">
                  Pending Requests ({pendingRequests.length})
                </h2>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                      <span className="ensure-readable font-medium">{request.user_email}</span>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => acceptRequest.mutate(request.id)} className="bg-green-600">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => declineRequest.mutate(request.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Received Gifts */}
            {receivedGifts.length > 0 && (
              <motion.div className="card-organic p-6">
                <h2 className="text-2xl font-bold mb-4 ensure-readable-strong flex items-center gap-2">
                  <Gift className="w-6 h-6 text-amber-400" />
                  Gifts Received
                </h2>
                <div className="space-y-3">
                  {receivedGifts.map((gift) => {
                    const giftInfo = giftTypes.find(t => t.value === gift.gift_type);
                    const Icon = giftInfo?.icon || Gift;
                    return (
                      <div key={gift.id} className="flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 rounded-xl border border-amber-500/30">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-amber-400" />
                          <div>
                            <p className="font-semibold ensure-readable">{giftInfo?.label} from {gift.sender_email.split('@')[0]}</p>
                            {gift.message && <p className="text-sm text-label italic">"{gift.message}"</p>}
                          </div>
                        </div>
                        <Button size="sm" onClick={() => claimGift.mutate(gift.id)} className="bg-gradient-to-r from-amber-600 to-orange-600">
                          Claim
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* My Friends */}
            <motion.div className="card-organic p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold ensure-readable-strong">My Friends ({acceptedFriends.length})</h2>
                <p className="text-sm text-label">Daily Gifts: {dailyGiftsSent.length}/3</p>
              </div>
              
              {acceptedFriends.length === 0 ? (
                <p className="text-center ensure-readable py-8">No friends yet. Send a request to get started!</p>
              ) : (
                <div className="grid gap-4">
                  {acceptedFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                      <div className="flex items-center gap-3 flex-1">
                        <UserAvatar userEmail={friend.friend_email} size="md" />
                        <div className="flex-1">
                          <p className="font-semibold ensure-readable">{friend.friend_email.split('@')[0]}</p>
                          <p className="text-sm text-label">Friends since {new Date(friend.accepted_date).toLocaleDateString()}</p>
                          <FriendStreakBadge userEmail={user?.email} friendEmail={friend.friend_email} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedFriend(friend.friend_email); setShowGiftModal(true); }} disabled={!canSendMoreGifts}>
                          <Gift className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedFriend(friend.friend_email); setShowChallengeModal(true); }}>
                          <Target className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-label" />
                <Input placeholder="Search groups..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowCreateGroupModal(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600">
                <Plus className="w-5 h-5 mr-2" />
                Create
              </Button>
            </div>

            {/* My Groups */}
            {myGroups.length > 0 && (
              <motion.div>
                <h2 className="text-2xl font-bold mb-4 ensure-readable-strong">My Groups</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGroups.map(group => (
                    <GroupCard key={group.id} group={group} isMember={true} onLeave={() => leaveGroup.mutate(group.id)} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Discover Groups */}
            <motion.div>
              <h2 className="text-2xl font-bold mb-4 ensure-readable-strong">Discover Groups</h2>
              {discoverGroups.length === 0 ? (
                <div className="card-organic p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-label" />
                  <p className="text-lg ensure-readable mb-4">No groups found</p>
                  <p className="text-label">Try adjusting your search or create a new group!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {discoverGroups.map(group => (
                    <GroupCard key={group.id} group={group} isMember={false} onJoin={() => joinGroup.mutate(group.id)} />
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Gift Modal */}
        <AnimatePresence>
          {showGiftModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGiftModal(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="card-organic p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4 ensure-readable-strong">Send a Gift</h3>
                <p className="text-label mb-4">To: {selectedFriend?.split('@')[0]}</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Choose Gift Type</label>
                    <Select value={giftType} onValueChange={setGiftType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Message (Optional)</label>
                    <Textarea placeholder="Keep going!" value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} rows={3} />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowGiftModal(false)} className="flex-1">Cancel</Button>
                    <Button onClick={() => sendGift.mutate()} disabled={sendGift.isPending} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenge Modal */}
        {showChallengeModal && (
          <CreateChallengeModal friendEmail={selectedFriend} onClose={() => { setShowChallengeModal(false); setSelectedFriend(null); }} />
        )}

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateGroupModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateGroupModal(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="card-organic p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold ensure-readable-strong">Create New Group</h3>
                  <button onClick={() => setShowCreateGroupModal(false)} className="text-label hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Group Name</label>
                    <Input placeholder="Enter group name..." value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Description</label>
                    <Textarea placeholder="What is this group about?" value={newGroup.description} onChange={(e) => setNewGroup({...newGroup, description: e.target.value})} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold ensure-readable mb-2 block">Type</label>
                      <Select value={newGroup.group_type} onValueChange={(value) => setNewGroup({...newGroup, group_type: value})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold ensure-readable mb-2 block">Privacy</label>
                      <Select value={newGroup.privacy} onValueChange={(value) => setNewGroup({...newGroup, privacy: value})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">LECHE Focus</label>
                    <Select value={newGroup.leche_focus} onValueChange={(value) => setNewGroup({...newGroup, leche_focus: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Values</SelectItem>
                        <SelectItem value="Love">Love</SelectItem>
                        <SelectItem value="Empathy">Empathy</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Healing">Healing</SelectItem>
                        <SelectItem value="Empowerment">Empowerment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Avatar Emoji</label>
                    <Input placeholder="✨" value={newGroup.avatar_emoji} onChange={(e) => setNewGroup({...newGroup, avatar_emoji: e.target.value})} maxLength={2} />
                  </div>
                  <Button onClick={() => createGroup.mutate()} disabled={!newGroup.name || createGroup.isPending} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">
                    Create Group
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GroupCard({ group, isMember, onJoin, onLeave }) {
  const Icon = groupTypeIcons[group.group_type] || Users;

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card-organic p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{group.avatar_emoji}</div>
          <div>
            <h3 className="font-bold ensure-readable-strong">{group.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Icon className="w-4 h-4 text-label" />
              <span className="text-xs text-label capitalize">{group.group_type}</span>
              <span className="text-xs text-label">• {group.member_count} members</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-label mb-4 line-clamp-2">{group.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-label px-3 py-1 bg-purple-500/20 rounded-full">{group.leche_focus}</span>
        {isMember ? (
          <Button size="sm" variant="outline" onClick={onLeave} className="text-red-400 border-red-400/30 hover:bg-red-500/10">Leave</Button>
        ) : (
          <Button size="sm" onClick={onJoin} className="bg-gradient-to-r from-purple-600 to-indigo-600">Join</Button>
        )}
      </div>
    </motion.div>
  );
}