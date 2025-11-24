import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
      transition={{ delay: 1.5 }}
      className="max-w-2xl mx-auto mt-8"
    >
      <div className="card-organic p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Reflect & Journal</h3>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold ensure-readable-strong">
              Reflection Prompt {currentPromptIndex + 1} of {prompts.length}
            </label>
            {prompts.length > 1 && (
              <div className="flex gap-1.5">
                {prompts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPromptIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentPromptIndex
                        ? 'bg-amber-400 w-8'
                        : 'bg-slate-600 w-1.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {showBeforeMood && !beforeMood ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-purple-500/30 border-2 border-purple-400/50 mb-4"
            >
              <MoodTracker 
                onMoodSelect={(mood) => {
                  setBeforeMood(mood);
                  setShowBeforeMood(false);
                }}
                selectedMood={beforeMood}
                label="How were you feeling before this practice?"
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentPromptIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 rounded-2xl bg-amber-500/30 border-2 border-amber-400/50 mb-4"
            >
              <p className="ensure-readable-strong font-semibold text-lg">
                {prompts[currentPromptIndex]}
              </p>
            </motion.div>
          )}

          {prompts.length > 1 && currentPromptIndex < prompts.length - 1 && (
            <Button
              onClick={() => setCurrentPromptIndex(currentPromptIndex + 1)}
              variant="outline"
              size="sm"
              className="mb-4"
            >
              Next Prompt →
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold ensure-readable-strong">
              Your Thoughts
            </label>
            <span className={`text-xs font-bold ${
              reflection.length >= 20 ? 'text-green-400' : 'ensure-readable'
            }`}>
              {reflection.length}/20 minimum
            </span>
          </div>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Take your time... write whatever comes to mind..."
            className="min-h-40 rounded-2xl bg-white/10 border-2 border-purple-400/50 focus:border-amber-400 ensure-readable-strong text-base placeholder:ensure-readable font-medium"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold ensure-readable-strong mb-3 text-center">
            How are you feeling after this practice?
          </label>
          <MoodTracker 
            onMoodSelect={setAfterMood}
            selectedMood={afterMood}
            label=""
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold ensure-readable-strong mb-3">
            How impactful was this practice for you?
          </label>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Sparkles
                  className={`w-10 h-10 ${
                    star <= rating
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-bold mt-2" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'A gentle start'}
            {rating === 2 && 'Somewhat helpful'}
            {rating === 3 && 'Meaningful practice'}
            {rating === 4 && 'Deeply impactful'}
            {rating === 5 && 'Transformative experience'}
          </p>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isSubmitting || reflection.trim().length < 20 || rating === 0 || !afterMood}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-7 rounded-2xl shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all text-lg relative overflow-hidden"
          style={{ boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)' }}
        >
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
          <CheckCircle className="w-6 h-6 mr-2" />
          {isSubmitting ? 'Saving Your Journey...' : 'Complete Practice'}
        </Button>

        <p className="text-center text-sm ensure-readable-strong font-medium mt-4">
          Track your mood, write 20+ characters, and rate your experience
        </p>
      </div>
    </motion.div>
  );
}