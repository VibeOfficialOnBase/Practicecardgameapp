import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users, Leaf, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const lecheIcons = {
  Love: Heart,
  Empathy: Users,
  Community: Users,
  Healing: Leaf,
  Empowerment: Zap
};

export default function TodaysCard({ card, onStart, completed = false }) {
  if (!card) {
    return (
      <div className="rounded-3xl bg-white/80 backdrop-blur p-8 shadow-lg border border-amber-100">
        <div className="text-center text-stone-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No practice card available</p>
          <p className="text-sm mt-2">Check back soon for your daily practice</p>
        </div>
      </div>
    );
  }

  const Icon = lecheIcons[card.leche_value] || Heart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-gradient-to-br from-white to-amber-50/50 backdrop-blur p-8 shadow-xl border border-amber-200/50"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {card.leche_value}
            </span>
            <p className="text-xs text-stone-500 mt-0.5">{card.estimated_time || '10-15 min'}</p>
          </div>
        </div>
        
        {completed && (
          <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            ✓ Completed
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-stone-800 mb-3">{card.title}</h3>
      <p className="text-stone-600 leading-relaxed mb-6">{card.description}</p>

      {!completed && (
        <Button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Today's Practice
        </Button>
      )}
    </motion.div>
  );
}