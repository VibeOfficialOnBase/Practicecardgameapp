import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CommunityHighlight({ post, index = 0 }) {
  const postTypeColors = {
    reflection: 'border-l-amber-400',
    support: 'border-l-blue-400',
    celebration: 'border-l-green-400',
    question: 'border-l-purple-400'
  };

  const borderColor = postTypeColors[post.post_type] || 'border-l-stone-400';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-5 rounded-2xl bg-white/60 backdrop-blur border-l-4 ${borderColor} hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
          {post.created_by ? post.created_by[0].toUpperCase() : '?'}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-700 mb-1">
            {post.created_by || 'Community Member'}
          </p>
          <p className="text-stone-600 text-sm leading-relaxed mb-3">{post.content}</p>
          
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {post.hearts_count || 0}
            </span>
            <span>
              {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}