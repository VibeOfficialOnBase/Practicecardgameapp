import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const reflectionPrompts = {
  chakra_blaster: {
    struggling: [
      "The enemies you faced today represent real challenges. How do you handle feelings of overwhelm in your daily life?",
      "When facing difficult emotions like anger or fear, what strategies help you stay centered?",
      "Reflect on a time when you successfully overcame a challenging situation. What strength can you draw from that experience?"
    ],
    improving: [
      "You're making progress in managing these emotional challenges. What patterns are you noticing about your resilience?",
      "As you blast through negative emotions in the game, what real-life emotions are you learning to process better?",
      "Notice how your focus improves with practice. Where else in life can you apply this growing skill?"
    ],
    excelling: [
      "Your mastery in handling these challenges is inspiring. How can you use this confidence in facing real-world obstacles?",
      "You've become skilled at transforming negative energy into positive action. What does this teach you about your own power?",
      "Reflect on how far you've come. What advice would you give to your past self just starting this journey?"
    ]
  },
  challenge_bubbles: {
    struggling: [
      "When things feel chaotic, like the bubbles falling, how do you find clarity and focus?",
      "Matching emotions to find peace—what helps you find alignment in your life when things feel mismatched?",
      "Anxiety can feel overwhelming. What grounding techniques work best for you?"
    ],
    improving: [
      "You're learning to see patterns in the chaos. How does this apply to organizing your thoughts and emotions?",
      "As clarity emerges in matching bubbles, what areas of your life are becoming clearer too?",
      "Notice your improving ability to stay calm under pressure. Where else can you apply this skill?"
    ],
    excelling: [
      "Your ability to find order in chaos is remarkable. How does this reflect your personal growth?",
      "You're mastering the art of clarity. What insights has this journey given you about yourself?",
      "Reflect on your journey from confusion to clarity. What has been most transformative?"
    ]
  },
  memory_match: {
    struggling: [
      "Memory and focus take practice. What distracts you most in your daily life, and how can you minimize those distractions?",
      "When you feel scattered, what brings you back to center?",
      "Patience with yourself is key. How can you be more compassionate when you make mistakes?"
    ],
    improving: [
      "Your memory is strengthening. What other mental skills are you noticing improvement in?",
      "As your focus sharpens, what positive changes are you experiencing in other areas of life?",
      "Notice how repetition builds mastery. What other habits would benefit from consistent practice?"
    ],
    excelling: [
      "Your focus and memory are exceptional. How do you maintain such mental clarity?",
      "Reflect on the discipline that brought you here. How can you apply this to other goals?",
      "You've mastered the art of remembering. What important things in life deserve more of your mindful attention?"
    ]
  }
};

export default function ReflectionPrompt({ gameType, score, maxScore, onComplete }) {
  const [reflection, setReflection] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    generatePrompt();
  }, []);

  const generatePrompt = async () => {
    setIsGenerating(true);
    const performanceRating = score / maxScore > 0.7 ? 'excelling' : score / maxScore > 0.4 ? 'improving' : 'struggling';
    const prompts = reflectionPrompts[gameType]?.[performanceRating] || [];
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Simulate AI generation with slight delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setPrompt(selectedPrompt);
    setIsGenerating(false);
  };

  const saveReflection = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      const performanceRating = score / maxScore > 0.7 ? 'excelling' : score / maxScore > 0.4 ? 'improving' : 'struggling';
      
      return await base44.entities.GameReflection.create({
        user_email: user.email,
        game_type: gameType,
        score: score,
        performance_rating: performanceRating,
        ai_prompt: prompt,
        user_reflection: reflection
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      onComplete();
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
    >
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-amber-400" />
        <h3 className="text-xl font-bold ensure-readable-strong">
          Moment of Reflection
        </h3>
      </div>

      {isGenerating ? (
        <div className="text-center py-8">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-5/6 mx-auto"></div>
          </div>
          <p className="text-sm text-label mt-4">Generating personalized prompt...</p>
        </div>
      ) : (
        <>
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="ensure-readable italic">"{prompt}"</p>
          </div>

          <Textarea
            placeholder="Take a moment to reflect on your experience..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={5}
            className="mb-4"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onComplete}
              className="flex-1"
            >
              Skip for Now
            </Button>
            <Button
              onClick={() => saveReflection.mutate()}
              disabled={!reflection || saveReflection.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Save Reflection
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
}