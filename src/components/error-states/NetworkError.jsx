import React from 'react';
import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';
import ErrorState from './ErrorState';

const BrokenConnectionIllustration = () => (
  <motion.svg
    width="140"
    height="100"
    viewBox="0 0 140 100"
    className="drop-shadow-lg"
  >
    {/* Left connection point */}
    <motion.circle
      cx="20"
      cy="50"
      r="8"
      fill="#D4A574"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
    />
    
    {/* Right connection point */}
    <motion.circle
      cx="120"
      cy="50"
      r="8"
      fill="#D4A574"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
    />
    
    {/* Broken line - left part */}
    <motion.line
      x1="28"
      y1="50"
      x2="55"
      y2="50"
      stroke="#8B7355"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    />
    
    {/* Broken line - right part */}
    <motion.line
      x1="85"
      y1="50"
      x2="112"
      y2="50"
      stroke="#8B7355"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    />
    
    {/* Golden thread mending */}
    <motion.path
      d="M 55 50 Q 70 35 85 50"
      stroke="#E8B563"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    />
    
    {/* Sparkles on golden thread */}
    {[62, 70, 78].map((x, i) => (
      <motion.circle
        key={i}
        cx={x}
        cy={50 - Math.abs(70 - x) * 0.5}
        r="2"
        fill="#E8B563"
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.2, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          delay: 1.2 + i * 0.2,
          duration: 1,
          repeat: Infinity,
          repeatDelay: 2
        }}
      />
    ))}
  </motion.svg>
);

export default function NetworkError({ onRetry }) {
  return (
    <ErrorState
      illustration={<BrokenConnectionIllustration />}
      title="Connection Lost"
      message="We're having trouble reaching our servers. Your practice data is safe and will sync when you reconnect."
      onRetry={onRetry}
    />
  );
}