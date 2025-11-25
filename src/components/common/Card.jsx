import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Card({ children, className, onClick, hover = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' } : undefined}
      className={cn('card-base p-6', className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
