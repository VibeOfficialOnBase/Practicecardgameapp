import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import EmptyState from './EmptyState';

const CampfireIllustration = () => (
  <motion.svg
    width="140"
    height="120"
    viewBox="0 0 140 120"
    className="drop-shadow-lg"
  >
    {/* Logs */}
    <motion.rect
      x="40"
      y="85"
      width="60"
      height="10"
      rx="5"
      fill="#8B7355"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    />
    <motion.rect
      x="50"
      y="75"
      width="40"
      height="8"
      rx="4"
      fill="#6B5D4F"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    />
    
    {/* Waiting flame outline */}
    <motion.path
      d="M 70 75 Q 60 55 65 40 Q 68 30 70 25 Q 72 30 75 40 Q 80 55 70 75 Z"
      fill="none"
      stroke="#E8B563"
      strokeWidth="2"
      strokeDasharray="4,4"
      opacity="0.4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.6, duration: 1 }}
    />
    
    {/* Sparkles waiting to ignite */}
    {[
      { x: 55, y: 35, delay: 0.8 },
      { x: 85, y: 40, delay: 1.0 },
      { x: 70, y: 20, delay: 1.2 }
    ].map((spark, i) => (
      <motion.circle
        key={i}
        cx={spark.x}
        cy={spark.y}
        r="2"
        fill="#E8B563"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.6, 0],
          scale: [0, 1, 0]
        }}
        transition={{
          delay: spark.delay,
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
    ))}
  </motion.svg>
);

export default function NoCommunityPosts({ onShare }) {
  return (
    <EmptyState
      illustration={<CampfireIllustration />}
      title="Be the First Light"
      message="Share your practice to inspire and connect with the community. Every journey shared lights the way for others."
      actionButton={
        onShare && (
          <motion.button
            onClick={onShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Share Your Practice
          </motion.button>
        )
      }
    />
  );
}