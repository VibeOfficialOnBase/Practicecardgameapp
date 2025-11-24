import React from 'react';
import { motion } from 'framer-motion';

const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy', color: 'from-yellow-400 to-orange-400' },
  { emoji: '😌', label: 'Calm', value: 'calm', color: 'from-blue-400 to-indigo-400' },
  { emoji: '😔', label: 'Sad', value: 'sad', color: 'from-gray-400 to-slate-500' },
  { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'from-red-400 to-pink-500' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: 'from-orange-500 to-red-500' },
  { emoji: '🤔', label: 'Reflective', value: 'reflective', color: 'from-purple-400 to-violet-500' },
  { emoji: '😴', label: 'Tired', value: 'tired', color: 'from-indigo-400 to-purple-600' },
  { emoji: '✨', label: 'Inspired', value: 'inspired', color: 'from-pink-400 to-purple-500' }
];

export default function MoodTracker({ onMoodSelect, selectedMood, label = "How are you feeling right now?" }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold ensure-readable-strong text-center">{label}</p>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {moods.map(mood => (
          <motion.button
            key={mood.value}
            onClick={() => onMoodSelect(mood.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 sm:p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px] ${
              selectedMood === mood.value
                ? 'border-purple-500 bg-gradient-to-br ' + mood.color
                : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-0.5 sm:mb-1">{mood.emoji}</div>
            <div className={`text-[10px] sm:text-xs font-medium leading-tight text-center ${
              selectedMood === mood.value ? 'text-white' : 'text-label'
            }`}>
              {mood.label}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}