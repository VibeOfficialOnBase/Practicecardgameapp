import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import EmptyState from './EmptyState';

const SeedIllustration = () => (
  <motion.svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    className="drop-shadow-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {/* Soil */}
    <motion.ellipse
      cx="60"
      cy="90"
      rx="40"
      ry="8"
      fill="#8B7355"
      opacity="0.3"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    />
    
    {/* Seed */}
    <motion.ellipse
      cx="60"
      cy="75"
      rx="12"
      ry="16"
      fill="#D4A574"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
    />
    <motion.path
      d="M 60 60 Q 65 75 60 90"
      stroke="#8B7355"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
    />
    
    {/* Sunlight rays */}
    {[0, 1, 2].map((i) => (
      <motion.line
        key={i}
        x1="60"
        y1="20"
        x2="60"
        y2="35"
        stroke="#E8B563"
        strokeWidth="2"
        strokeLinecap="round"
        transform={`rotate(${i * 30 - 30} 60 20)`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 0.6, 0], y: 0 }}
        transition={{ 
          delay: 0.8 + i * 0.2, 
          duration: 2, 
          repeat: Infinity,
          repeatDelay: 1 
        }}
      />
    ))}
  </motion.svg>
);

export default function NoPracticesYet({ onPullCard }) {
  return (
    <EmptyState
      illustration={<SeedIllustration />}
      title="Your Practice Journey Begins"
      message="Pull your first card to start building your daily practice. Each card offers a gentle invitation to grow."
      actionButton={
        <motion.button
          onClick={onPullCard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Pull Today's Card
        </motion.button>
      }
    />
  );
}