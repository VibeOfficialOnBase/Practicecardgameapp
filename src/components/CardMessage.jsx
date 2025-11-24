import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function CardMessage({ message }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="max-w-2xl mx-auto mt-8"
    >
      <div className="rounded-3xl bg-gradient-to-br from-white to-amber-50/80 backdrop-blur p-8 shadow-xl border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-stone-800 font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              A Message for You
            </h3>
            <p className="text-stone-600 leading-relaxed text-lg">
              {message}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}