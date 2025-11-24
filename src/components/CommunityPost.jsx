import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const postTypeColors = {
  reflection: 'border-l-purple-400 bg-gradient-to-r from-purple-50/50 to-transparent',
  support: 'border-l-blue-400 bg-gradient-to-r from-blue-50/50 to-transparent',
  celebration: 'border-l-amber-400 bg-gradient-to-r from-amber-50/50 to-transparent',
  question: 'border-l-green-400 bg-gradient-to-r from-green-50/50 to-transparent'
};

const postTypeLabels = {
  reflection: '💭 Reflection',
  support: '🤝 Support',
  celebration: '✨ Celebration',
  question: '❓ Question'
};

export default function CommunityPost({ post, onLike, currentUserId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const authorName = post.created_by?.split('@')[0] || 'Anonymous';
  const isLongContent = post.content?.length > 200;
  const displayContent = isExpanded || !isLongContent 
    ? post.content 
    : post.content?.substring(0, 200) + '...';

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(post);
    setIsLiking(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`card-organic border-l-4 ${postTypeColors[post.post_type] || 'border-l-stone-300'} p-6`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-warm-amber via-orange-400 to-terracotta flex items-center justify-center text-white font-bold shadow-md">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-sm"></div>
            <span className="relative font-heading text-lg">{authorName[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="font-semibold text-stone-800">{authorName}</p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        
        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 font-medium border border-amber-200">
          {postTypeLabels[post.post_type] || post.post_type}
        </span>
      </div>

      <p className="text-stone-700 leading-relaxed mb-4 whitespace-pre-wrap">
        {displayContent}
      </p>

      {isLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-700 text-sm font-medium hover:text-amber-800 mb-4 transition-colors"
        >
          {isExpanded ? '← Show less' : 'Read more →'}
        </button>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-amber-100/50">
        <motion.button
          onClick={handleLike}
          disabled={isLiking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-stone-600 hover:text-rose-500 transition-colors disabled:opacity-50 rounded-full px-3 py-1.5 hover:bg-rose-50"
        >
          <Heart className="w-5 h-5" fill={post.likes_count > 0 ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">{post.likes_count || 0}</span>
        </motion.button>

        {post.hearts_count > 0 && (
          <div className="flex items-center gap-2 text-amber-600">
            <span className="text-lg">💛</span>
            <span className="text-sm font-medium">{post.hearts_count}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}