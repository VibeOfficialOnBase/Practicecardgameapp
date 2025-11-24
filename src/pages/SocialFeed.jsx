import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Trophy, Target, Zap, Image as ImageIcon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import UserAvatar from '../components/UserAvatar';

export default function SocialFeed() {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentingOn, setCommentingOn] = useState(null);
  const [commentText, setCommentText] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 50)
  });

  const { data: myLikes = [] } = useQuery({
    queryKey: ['myPostLikes', user?.email],
    queryFn: () => base44.entities.PostLike.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const createPost = useMutation({
    mutationFn: async () => {
      // Moderate content first
      const moderation = await base44.functions.invoke('moderateContent', {
        content: newPostContent,
        context: 'post'
      });

      if (!moderation.data.isAppropriate) {
        throw new Error(moderation.data.reason);
      }

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
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const likePost = useMutation({
    mutationFn: async (postId) => {
      const existing = myLikes.find(l => l.post_id === postId);
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

  const { data: comments = [] } = useQuery({
    queryKey: ['postComments', commentingOn],
    queryFn: () => base44.entities.PostComment.filter({ post_id: commentingOn }),
    enabled: !!commentingOn
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
      default: return <MessageCircle className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-center ensure-readable-strong">Social Feed</h1>
          <p className="text-center text-lg text-label">Share your journey with the community</p>
        </motion.div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-organic p-6 mb-6"
        >
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
              <Button variant="outline" size="sm" className="cursor-pointer">
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
              const isLiked = myLikes.some(l => l.post_id === post.id);
              
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
                          {comments.map(comment => (
                            <div key={comment.id} className="bg-white/5 rounded-lg p-3 flex gap-2">
                              <UserAvatar userEmail={comment.user_email} size="sm" />
                              <div className="flex-1">
                                <p className="text-xs font-semibold ensure-readable mb-1">
                                  {comment.user_email?.split('@')[0]}
                                </p>
                                <p className="text-sm ensure-readable">{comment.comment}</p>
                              </div>
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
      </div>
    </div>
  );
}