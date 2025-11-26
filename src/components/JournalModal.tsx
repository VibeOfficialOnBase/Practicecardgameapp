import { useState, useEffect, useRef } from 'react';
import type { PracticeCard } from '@/data/cards';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Download } from 'lucide-react';
import { 
  saveJournalEntry, 
  calculateWordCount,
  getJournalEntryForCard,
  type JournalEntry 
} from '@/utils/journalTracking';
import { generateJournalPrompts, getMilestonePrompts } from '@/data/journalPrompts';
import { playSound } from '@/utils/soundEffects';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: PracticeCard;
  userId: string;
  streakDay: number;
  onSave: (wordCount: number) => void;
}

export default function JournalModal({ 
  isOpen, 
  onClose, 
  card, 
  userId, 
  streakDay,
  onSave 
}: JournalModalProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [responses, setResponses] = useState<{
    prompt1: string;
    prompt2: string;
    prompt3: string;
  }>({
    prompt1: '',
    prompt2: '',
    prompt3: '',
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load existing entry if available
  useEffect(() => {
    if (isOpen) {
      const existingEntry = getJournalEntryForCard(userId, card.id);
      if (existingEntry) {
        setResponses(existingEntry.responses);
      } else {
        setResponses({ prompt1: '', prompt2: '', prompt3: '' });
      }
      setCurrentPromptIndex(0);
    }
  }, [isOpen, userId, card.id]);

  const milestonePrompts = getMilestonePrompts(streakDay);
  const prompts = milestonePrompts || generateJournalPrompts(
    card.affirmation,
    card.mission,
    card.inspiration,
    streakDay
  );

  const promptKeys: Array<keyof typeof prompts> = ['affirmation', 'mission', 'inspiration'];
  const currentPromptKey = promptKeys[currentPromptIndex];
  const currentPrompt = prompts[currentPromptKey];
  const currentResponse = responses[`prompt${currentPromptIndex + 1}` as keyof typeof responses];

  const wordCount = calculateWordCount(currentResponse);
  const totalWordCount = calculateWordCount(
    `${responses.prompt1} ${responses.prompt2} ${responses.prompt3}`
  );

  const handleNext = () => {
    playSound('button_click');
    if (currentPromptIndex < 2) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const handlePrevious = () => {
    playSound('button_click');
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    playSound('button_click');

    const entry: JournalEntry = {
      id: `${userId}_${card.id}_${Date.now()}`,
      cardId: card.id,
      userId,
      date: Date.now(),
      responses,
      wordCount: totalWordCount,
      completed: true,
    };

    const success = saveJournalEntry(entry);
    
    if (success) {
      onSave(totalWordCount);
    }

    setIsSaving(false);
    onClose();
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    playSound('button_click');

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (Instagram-friendly 1080x1350)
      canvas.width = 1080;
      canvas.height = 1350;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#4c1d95'); // purple-900
      gradient.addColorStop(0.5, '#7e22ce'); // purple-700
      gradient.addColorStop(1, '#581c87'); // purple-900
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add decorative elements
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, 8);
      ctx.fillRect(0, canvas.height - 8, canvas.width, 8);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('My PRACTICE Journal', canvas.width / 2, 100);

      // Date
      ctx.font = '32px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      ctx.fillText(date, canvas.width / 2, 160);

      // Card Affirmation
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#fbbf24'; // yellow-400
      ctx.fillText('Card Affirmation', canvas.width / 2, 240);
      
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#ffffff';
      wrapText(ctx, card.affirmation, canvas.width / 2, 290, canvas.width - 120, 40);

      // Responses
      let yPos = 400;
      const promptTitles = ['Affirmation Reflection', 'Mission Reflection', 'Inspiration Reflection'];
      const responseKeys: Array<keyof typeof responses> = ['prompt1', 'prompt2', 'prompt3'];
      
      responseKeys.forEach((key, index) => {
        if (responses[key].trim()) {
          // Prompt title
          ctx.font = 'bold 32px sans-serif';
          ctx.fillStyle = '#c084fc'; // purple-400
          ctx.fillText(promptTitles[index], canvas.width / 2, yPos);
          yPos += 50;

          // Response text
          ctx.font = '24px sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.textAlign = 'left';
          const lines = wrapText(ctx, responses[key], 60, yPos, canvas.width - 120, 32);
          yPos += lines * 32 + 40;
          ctx.textAlign = 'center';
        }
      });

      // Footer
      ctx.font = '28px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`${totalWordCount} words • Day ${streakDay}`, canvas.width / 2, canvas.height - 80);
      
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('PRACTICE by $VibeOfficial', canvas.width / 2, canvas.height - 40);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `practice-journal-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        setIsExporting(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      setIsExporting(false);
    }
  };

  // Helper function to wrap text
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + ' ';
        y += lineHeight;
        lineCount++;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    lineCount++;
    return lineCount;
  };

  const handleResponseChange = (value: string) => {
    const newResponses = { ...responses };
    newResponses[`prompt${currentPromptIndex + 1}` as keyof typeof responses] = value;
    setResponses(newResponses);
  };

  const progress = ((currentPromptIndex + 1) / 3) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-black/95 text-white border-purple-500/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            📝 Reflect on Today's Card
          </DialogTitle>
          <p className="text-xs text-purple-300 mt-1">Your PRACTICE reflections earn you LECHE 🥛</p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Prompt {currentPromptIndex + 1} of 3</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Milestone Badge */}
          {milestonePrompts && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-400 font-semibold flex items-center gap-2">
                🎉 Milestone Reflection - Day {streakDay}!
              </p>
            </div>
          )}

          {/* Card Context */}
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-gray-300 mb-2">Today's Card:</p>
            <p className="text-lg font-semibold text-purple-300">
              {card.affirmation}
            </p>
          </div>

          {/* Current Prompt */}
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
              <p className="text-base leading-relaxed">{currentPrompt}</p>
            </div>

            {/* Response Textarea */}
            <Textarea
              value={currentResponse}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[200px] bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 resize-none"
            />

            {/* Word Count */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {wordCount} words
              </span>
              {wordCount >= 100 && (
                <span className="text-green-400 flex items-center gap-1">
                  ✓ Bonus XP eligible!
                </span>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentPromptIndex === 0}
              variant="outline"
              className="flex-1 bg-white/10 border-purple-500/50 text-white hover:bg-white/20"
            >
              ← Previous
            </Button>

            {currentPromptIndex < 2 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Next Prompt →
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isSaving ? 'Saving...' : '💾 Save Journal Entry'}
              </Button>
            )}
          </div>

          {/* Export PNG Button - only show if there's content */}
          {(responses.prompt1 || responses.prompt2 || responses.prompt3) && (
            <Button
              onClick={handleExportPNG}
              disabled={isExporting}
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400/50 text-blue-200 hover:bg-blue-500/30"
            >
              {isExporting ? (
                'Exporting...'
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export as Image
                </>
              )}
            </Button>
          )}

          {/* Total Progress Info */}
          <div className="text-center text-xs text-gray-400 space-y-1">
            <p>Total: {totalWordCount} words across all prompts</p>
            <p className="text-pink-300">💜 Journaling = PRACTICE → LECHE</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
