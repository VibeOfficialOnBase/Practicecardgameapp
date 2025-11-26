import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Sparkles, BookOpen } from 'lucide-react';
import type { PracticeCard } from '@/data/cardsWithRarity';
import { saveJournalEntry, calculateWordCount, type JournalEntry } from '@/utils/journalTracking';

interface GoDeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: PracticeCard;
  username: string;
  onJournalSave?: (wordCount: number) => void;
}

export function GoDeeperModal({ isOpen, onClose, card, username, onJournalSave }: GoDeeperModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({
    question1: '',
    question2: '',
    question3: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Generate deeper reflection questions based on the card
  const deeperQuestions = [
    {
      icon: '🌟',
      title: 'Embodiment Reflection',
      question: `How would your life transform if you fully embodied this affirmation: "${card.affirmation}"? Describe specific changes in your thoughts, actions, and relationships.`
    },
    {
      icon: '💎',
      title: 'Mission Integration',
      question: `Your mission is: "${card.mission}". What resistance or blocks might you encounter? How can you overcome them? What support do you need?`
    },
    {
      icon: '✨',
      title: 'Wisdom Application',
      question: `The wisdom shared is: "${card.inspiration}". How does this resonate with your current life situation? What action will you take today to honor this insight?`
    }
  ];

  const currentQuestion = deeperQuestions[currentQuestionIndex];
  const currentResponse = responses[`question${currentQuestionIndex + 1}` as keyof typeof responses];
  const wordCount = calculateWordCount(currentResponse);
  const totalWordCount = calculateWordCount(
    `${responses.question1} ${responses.question2} ${responses.question3}`
  );

  const handleNext = () => {
    if (currentQuestionIndex < 2) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [`question${currentQuestionIndex + 1}`]: value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);

    // Save as journal entry (reusing existing journal structure)
    const entry: JournalEntry = {
      id: `${username}_${card.id}_deeper_${Date.now()}`,
      cardId: card.id,
      userId: username,
      date: Date.now(),
      responses: {
        prompt1: responses.question1,
        prompt2: responses.question2,
        prompt3: responses.question3
      },
      wordCount: totalWordCount,
      completed: true
    };

    const success = saveJournalEntry(entry);

    if (success && onJournalSave) {
      onJournalSave(totalWordCount);
    }

    setIsSaving(false);
    onClose();
    
    // Reset state
    setCurrentQuestionIndex(0);
    setResponses({ question1: '', question2: '', question3: '' });
  };

  const progress = ((currentQuestionIndex + 1) / 3) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-yellow-900/95 via-orange-900/95 to-purple-900/95 text-white border-2 border-yellow-500/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                💡 Go Deeper
              </DialogTitle>
              <p className="text-xs text-yellow-200 mt-1">Exclusive holder reflection prompts</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-yellow-200">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Question {currentQuestionIndex + 1} of 3
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Card Context - Compact */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-xs text-yellow-300 mb-1">Today's Card:</p>
            <p className="text-sm font-semibold text-white">{card.affirmation}</p>
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border-2 border-yellow-500/40">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl">{currentQuestion.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">{currentQuestion.title}</h3>
                  <p className="text-base leading-relaxed text-white">{currentQuestion.question}</p>
                </div>
              </div>
            </div>

            {/* Response Textarea */}
            <Textarea
              value={currentResponse}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Pour your heart out... this is your sacred space for deep reflection"
              className="min-h-[250px] bg-black/30 border-2 border-yellow-500/30 text-white placeholder:text-yellow-200/40 resize-none text-base focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/30"
            />

            {/* Word Count */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-yellow-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {wordCount} words
              </span>
              {wordCount >= 100 && (
                <span className="text-green-300 flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                  ✓ Bonus XP eligible!
                </span>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex-1 bg-black/30 border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/20 disabled:opacity-30"
            >
              ← Previous
            </Button>

            {currentQuestionIndex < 2 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
              >
                Next Question →
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
              >
                {isSaving ? 'Saving...' : '💾 Save Deep Reflection'}
              </Button>
            )}
          </div>

          {/* Total Progress Info */}
          <div className="text-center space-y-1 pt-4 border-t border-yellow-500/20">
            <p className="text-xs text-yellow-200">
              Total: {totalWordCount} words across all reflections
            </p>
            <p className="text-xs text-orange-300 flex items-center justify-center gap-2">
              <span>👑</span>
              <span>Holder-exclusive deeper work = Greater LECHE</span>
              <span>🥛</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
