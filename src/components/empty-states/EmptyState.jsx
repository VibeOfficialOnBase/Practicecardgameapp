import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  actionButton,
  illustration 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {illustration ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          {illustration}
        </motion.div>
      ) : Icon ? (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-warm-amber/20 rounded-full blur-2xl"></div>
          <div className="relative p-6 rounded-full bg-gradient-to-br from-warm-amber via-orange-300 to-terracotta/40">
            <Icon className="w-16 h-16 text-amber-700" strokeWidth={1.5} />
          </div>
        </motion.div>
      ) : null}

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold font-heading text-stone-800 mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-stone-600 text-base max-w-md mb-8 leading-relaxed"
      >
        {message}
      </motion.p>

      {actionButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        >
          {actionButton}
        </motion.div>
      )}
    </motion.div>
  );
}