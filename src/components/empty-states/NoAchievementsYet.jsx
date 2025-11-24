import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Heart } from 'lucide-react';
import EmptyState from './EmptyState';

const ConstellationIllustration = () => (
  <motion.svg
    width="160"
    height="120"
    viewBox="0 0 160 120"
    className="drop-shadow-lg"
  >
    {/* Connection lines */}
    {[[30, 40, 80, 35], [80, 35, 130, 45], [80, 35, 80, 70], [30, 40, 80, 70], [80, 70, 130, 45]].map((line, i) => (
      <motion.line
        key={i}
        x1={line[0]}
        y1={line[1]}
        x2={line[2]}
        y2={line[3]}
        stroke="#D4A574"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
      />
    ))}
    
    {/* Stars - some lit, some waiting */}
    {[
      { x: 30, y: 40, lit: true, Icon: Heart },
      { x: 80, y: 35, lit: true, Icon: Star },
      { x: 130, y: 45, lit: false, Icon: Award },
      { x: 80, y: 70, lit: false, Icon: Star },
      { x: 50, y: 85, lit: false, Icon: Award }
    ].map((star, i) => {
      const IconComponent = star.Icon;
      return (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
        >
          {star.lit && (
            <circle
              cx={star.x}
              cy={star.y}
              r="12"
              fill="#E8B563"
              opacity="0.2"
            >
              <animate
                attributeName="r"
                values="12;16;12"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.4;0.2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          )}
          <foreignObject x={star.x - 10} y={star.y - 10} width="20" height="20">
            <IconComponent 
              className={`w-5 h-5 ${star.lit ? 'text-warm-amber' : 'text-stone-300'}`}
              fill={star.lit ? 'currentColor' : 'none'}
            />
          </foreignObject>
        </motion.g>
      );
    })}
  </motion.svg>
);

export default function NoAchievementsYet() {
  return (
    <EmptyState
      illustration={<ConstellationIllustration />}
      title="Your Achievements Await"
      message="Each practice brings you closer to unlocking meaningful milestones. Your constellation of growth is waiting to shine."
    />
  );
}