import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';

export default function CompletionFeedback({ show, message = "Your practice has been saved!" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="card-organic p-8 max-w-md mx-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold mb-2"
              style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            >
              Success!
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg mb-4"
              style={{ color: '#E8E8E8', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
            >
              {message}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl p-4 border border-purple-500/30"
            >
              <p className="text-sm mb-2" style={{ color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                ✨ Your progress is now live!
              </p>
              <p className="text-xs" style={{ color: '#D8D8D8', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                Visit the <strong className="text-purple-300">Community</strong> tab to see your practice reflected in the global tracker pulse
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm" style={{ color: '#C7B1FF' }}>
                Keep up the great work!
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}