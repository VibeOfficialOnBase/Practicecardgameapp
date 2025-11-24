import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

const KintsugiIllustration = () => (
  <motion.svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    className="drop-shadow-lg"
  >
    {/* Bowl/vessel */}
    <motion.path
      d="M 30 60 Q 30 80 60 80 Q 90 80 90 60 L 85 50 Q 85 45 60 45 Q 35 45 35 50 Z"
      fill="#F5E6D3"
      stroke="#8B7355"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
    
    {/* Crack being mended with gold */}
    <motion.path
      d="M 60 45 L 55 65 L 60 80"
      stroke="none"
      strokeWidth="0"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    />
    <motion.path
      d="M 60 45 L 55 65 L 60 80"
      stroke="#E8B563"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    />
    
    {/* Sparkles on the gold */}
    {[
      { x: 60, y: 50, delay: 1.2 },
      { x: 56, y: 65, delay: 1.4 },
      { x: 60, y: 75, delay: 1.6 }
    ].map((spark, i) => (
      <motion.circle
        key={i}
        cx={spark.x}
        cy={spark.y}
        r="2"
        fill="#E8B563"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          delay: spark.delay,
          duration: 1,
          repeat: Infinity,
          repeatDelay: 2
        }}
      />
    ))}
  </motion.svg>
);

export default function ErrorState({ 
  title = "Something Went Wrong",
  message = "Don't worry, we're here to help you reconnect.",
  onRetry,
  illustration = <KintsugiIllustration />
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        {illustration}
      </motion.div>

      <h3 className="text-xl font-bold font-heading text-stone-800 mb-3">
        {title}
      </h3>

      <p className="text-stone-600 text-base max-w-md mb-8 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}