import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './common/Button';
import Card from './common/Card';
import { Textarea } from '@/components/ui/textarea'; // Assuming shadcn or similar is still available, or I should replace with standard html
import { BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import MoodTracker from './practice/MoodTracker';

export default function ReflectionJournal({ card, onComplete, isSubmitting }) {
  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [beforeMood, setBeforeMood] = useState('');
  const [afterMood, setAfterMood] = useState('');
  const [showBeforeMood, setShowBeforeMood] = useState(true);

  const prompts = (card.reflection_prompts && card.reflection_prompts.length > 0) 
    ? card.reflection_prompts 
    : [
      "How did this practice make you feel?",
      "What insights emerged for you?",
      "How will you carry this forward?"
    ];

  const handleComplete = () => {
    if (reflection.trim().length < 20 || !afterMood) {
      return;
    }
    onComplete({ reflection, rating, beforeMood, afterMood });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 md:p-8 bg-[var(--bg-secondary)]/50 border-none shadow-inner">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Reflection Journal</h3>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Prompt {currentPromptIndex + 1}/{prompts.length}
            </label>
            {prompts.length > 1 && (
              <div className="flex gap-1.5">
                {prompts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPromptIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentPromptIndex
                        ? 'bg-[var(--accent-primary)] w-6'
                        : 'bg-[var(--text-secondary)]/30 w-1.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {showBeforeMood && !beforeMood ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-white/50 dark:bg-black/20 border border-[var(--accent-primary)]/20 mb-6"
            >
              <MoodTracker 
                onMoodSelect={(mood) => {
                  setBeforeMood(mood);
                  setShowBeforeMood(false);
                }}
                selectedMood={beforeMood}
                label="How are you feeling right now?"
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentPromptIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <h4 className="text-lg font-serif italic text-[var(--text-primary)] leading-relaxed">
                "{prompts[currentPromptIndex]}"
              </h4>
            </motion.div>
          )}

          {prompts.length > 1 && currentPromptIndex < prompts.length - 1 && !showBeforeMood && (
            <Button
              onClick={() => setCurrentPromptIndex(currentPromptIndex + 1)}
              variant="secondary"
              size="sm"
              className="mb-6"
            >
              Next Prompt
            </Button>
          )}
        </div>

        <div className="mb-8 relative">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full min-h-[160px] p-4 rounded-xl bg-[var(--bg-primary)] border-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 resize-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 shadow-sm transition-all"
          />
          <div className={`absolute bottom-3 right-3 text-xs font-bold transition-colors ${
            reflection.length >= 20 ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'
          }`}>
            {reflection.length}/20
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 text-center">
            Mood After Practice
          </label>
          <MoodTracker 
            onMoodSelect={setAfterMood}
            selectedMood={afterMood}
            label=""
          />
        </div>

        <div className="mb-8 text-center">
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            Rate this Practice
          </label>
          <div className="flex gap-4 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="group transition-transform active:scale-95"
              >
                <Sparkles
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? 'text-[var(--accent-primary)] fill-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)]/30 group-hover:text-[var(--accent-primary)]/50'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isSubmitting || reflection.trim().length < 20 || rating === 0 || !afterMood}
          variant="primary"
          className="w-full py-4 text-lg shadow-xl shadow-purple-900/10"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Complete Practice
            </span>
          )}
        </Button>
      </Card>
    </motion.div>
  );
}
