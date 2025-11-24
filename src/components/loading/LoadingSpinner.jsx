import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.div
        className={`${sizes[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* Growing plant/sunrise loader */}
        <svg viewBox="0 0 50 50" className="w-full h-full">
          {/* Sun rising */}
          <motion.circle
            cx="25"
            cy="25"
            r="8"
            fill="#E8B563"
            initial={{ r: 6, opacity: 0.6 }}
            animate={{ r: 10, opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Rays */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.line
              key={i}
              x1="25"
              y1="25"
              x2="25"
              y2="15"
              stroke="#D4A574"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${angle} 25 25)`}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </svg>
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-stone-600 text-sm font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}