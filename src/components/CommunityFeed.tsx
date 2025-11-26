import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Share2, TrendingUp, Users } from 'lucide-react';
import { practiceCards } from '@/data/cardsExport';
import { getUserPulls } from '@/utils/pullTracking';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export interface CommunityPost {
  id: string;
  username: string;
  cardId: number;
  message: string;
  timestamp: number;
  likes: string[];
  comments: { username: string; text: string; timestamp: number }[];
  avatarColor: string;
}

interface CommunityFeedProps {
  currentUser: string;
}

const COMMUNITY_FEED_KEY = 'practice_community_feed';

export default function CommunityFeed({ currentUser }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostMessage, setNewPostMessage] = useState('');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'trending'>('all');
  const [pulledCards, setPulledCards] = useState<number[]>([]);

  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load user's pulled cards
    const pulls = getUserPulls(currentUser);
    const cardIds = pulls.map(pull => pull.cardId);
    setPulledCards(cardIds);
  }, [currentUser]);

  const loadPosts = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const data = localStorage.getItem(COMMUNITY_FEED_KEY);
      if (data) {
        const allPosts: CommunityPost[] = JSON.parse(data);
        // Sort by timestamp (newest first)
        const sorted = allPosts.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(sorted);
      }
    } catch (error) {
      console.error('Error loading community feed:', error);
    }
  };

  const savePosts = (updatedPosts: CommunityPost[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(COMMUNITY_FEED_KEY, JSON.stringify(updatedPosts));
      setPosts(updatedPosts.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const createPost = () => {
    if (!newPostMessage.trim() || !selectedCard) return;

    const newPost: CommunityPost = {
      id: `${Date.now()}_${currentUser}`,
      username: currentUser,
      cardId: selectedCard,
      message: newPostMessage,
      timestamp: Date.now(),
      likes: [],
      comments: [],
      avatarColor: getAvatarColor(currentUser)
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    
    setNewPostMessage('');
    setSelectedCard(null);
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const toggleLike = (postId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const likes = post.likes.includes(currentUser)
          ? post.likes.filter((u) => u !== currentUser)
          : [...post.likes, currentUser];
        return { ...post, likes };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const addComment = (postId: string) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { username: currentUser, text: commentText, timestamp: Date.now() }
          ]
        };
      }
      return post;
    });
    
    savePosts(updatedPosts);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const getAvatarColor = (username: string): string => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-yellow-500 to-amber-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500'
    ];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const trendingPosts = posts
    .filter((p) => p.likes.length + p.comments.length >= 3)
    .sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));

  const displayPosts = filter === 'trending' ? trendingPosts : posts;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Users className="w-8 h-8" />
          Community Feed
        </h2>
        <p className="text-indigo-200 text-sm">
          Share your PRACTICE journey with the community
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' 
            ? 'bg-purple-600 text-white' 
            : 'bg-white/10 text-gray-300 border-purple-500/30 hover:bg-white/20'
          }
        >
          All Posts
        </Button>
        <Button
          onClick={() => setFilter('trending')}
          variant={filter === 'trending' ? 'default' : 'outline'}
          className={filter === 'trending'
            ? 'bg-purple-600 text-white'
            : 'bg-white/10 text-gray-300 border-purple-500/30 hover:bg-white/20'
          }
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Trending
        </Button>
      </div>

      {/* Create Post */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Share Your Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="How did today's card inspire you?"
            value={newPostMessage}
            onChange={(e) => setNewPostMessage(e.target.value)}
            className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
            rows={3}
          />
          
          <div className="flex items-center justify-between gap-3">
            <Select
              value={selectedCard?.toString() || ""}
              onValueChange={(value) => setSelectedCard(parseInt(value))}
            >
              <SelectTrigger className="flex-1 bg-white/10 border-purple-500/30 text-white">
                <SelectValue placeholder="Select a card you've pulled" />
              </SelectTrigger>
              <SelectContent className="bg-purple-900/95 border-purple-500/50 text-white max-h-[300px]">
                {pulledCards.length === 0 ? (
                  <div className="px-2 py-6 text-center text-gray-400 text-sm">
                    No cards pulled yet. Pull your first card to share!
                  </div>
                ) : (
                  pulledCards.map((cardId) => {
                    const card = practiceCards.find(c => c.id === cardId);
                    if (!card) return null;
                    return (
                      <SelectItem key={cardId} value={cardId.toString()} className="text-white hover:bg-purple-700/50 focus:bg-purple-700/50">
                        Card #{cardId} - {card.affirmation.substring(0, 40)}...
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={createPost}
              disabled={!newPostMessage.trim() || !selectedCard || pulledCards.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-shrink-0"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <ScrollArea className="h-[600px] rounded-lg">
        <div className="space-y-4">
          <AnimatePresence>
            {displayPosts.length === 0 ? (
              <Card className="backdrop-blur-lg bg-white/10 border-white/20">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-400">
                    {filter === 'trending' 
                      ? 'No trending posts yet. Be the first to share!'
                      : 'No posts yet. Start the conversation!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              displayPosts.map((post, index) => {
                const card = practiceCards.find((c) => c.id === post.cardId);
                if (!card) return null;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="backdrop-blur-lg bg-white/10 border-white/20 hover:border-purple-400/40 transition-all">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <Avatar className={`w-10 h-10 ${post.avatarColor} flex items-center justify-center text-white font-bold`}>
                            {post.username[0].toUpperCase()}
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-semibold">{post.username}</p>
                                <p className="text-gray-400 text-xs">{formatTimeAgo(post.timestamp)}</p>
                              </div>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                                Card #{post.cardId}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Card Preview */}
                        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-lg p-4">
                          <p className="text-white text-sm italic mb-2">"{card.affirmation}"</p>
                          <p className="text-gray-300 text-xs">Mission: {card.mission}</p>
                        </div>

                        {/* Post Message */}
                        <p className="text-white">{post.message}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(post.id)}
                            className={`${
                              post.likes.includes(currentUser)
                                ? 'text-pink-400 hover:text-pink-300'
                                : 'text-gray-400 hover:text-white'
                            } hover:bg-white/10`}
                          >
                            <Heart 
                              className={`w-4 h-4 mr-1 ${post.likes.includes(currentUser) ? 'fill-current' : ''}`}
                            />
                            {post.likes.length}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments.length}
                          </Button>
                        </div>

                        {/* Comments */}
                        {post.comments.length > 0 && (
                          <div className="space-y-2 bg-black/20 rounded-lg p-3">
                            {post.comments.map((comment, idx) => (
                              <div key={idx} className="flex gap-2">
                                <Avatar className={`w-6 h-6 ${getAvatarColor(comment.username)} flex items-center justify-center text-white text-xs font-bold`}>
                                  {comment.username[0].toUpperCase()}
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-white text-sm">
                                    <span className="font-semibold">{comment.username}</span>{' '}
                                    {comment.text}
                                  </p>
                                  <p className="text-gray-500 text-xs">{formatTimeAgo(comment.timestamp)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                            }
                            className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addComment(post.id);
                              }
                            }}
                          />
                          <Button
                            onClick={() => addComment(post.id)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Post
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
