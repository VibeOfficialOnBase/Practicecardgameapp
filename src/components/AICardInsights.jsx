import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, BookOpen, Target, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AICardInsights({ card, userEmail }) {
  const [showInsights, setShowInsights] = useState(false);
  const [userContext, setUserContext] = useState('');
  const [insights, setInsights] = useState(null);

  const generateInsights = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('generateCardInsight', {
        cardTitle: card.title,
        cardMission: card.mission,
        cardAffirmation: card.affirmation,
        userContext
      });
      
      await base44.entities.CardInsight.create({
        user_email: userEmail,
        practice_card_id: card.id,
        user_context: userContext,
        ai_interpretation: response.data.interpretation,
        suggested_action: response.data.action,
        learning_resources: response.data.resources
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      setInsights(data);
    }
  });

  return (
    <div className="card-organic p-6">
      <Button
        onClick={() => setShowInsights(!showInsights)}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl py-4 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Get AI Insights for This Card
      </Button>

      <AnimatePresence>
        {showInsights && !insights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Share your current situation or goals (optional):
              </label>
              <Textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder="E.g., 'I'm working on being more present with my family' or 'I want to build confidence in my work'"
                className="min-h-24 rounded-xl"
              />
            </div>
            <Button
              onClick={() => generateInsights.mutate()}
              disabled={generateInsights.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              {generateInsights.isPending ? 'Generating Insights...' : 'Generate Personalized Insights'}
            </Button>
          </motion.div>
        )}

        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-6"
          >
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-purple-900">Personalized Interpretation</h4>
              </div>
              <p className="text-slate-700 leading-relaxed">{insights.interpretation}</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-green-900">Suggested Action</h4>
              </div>
              <p className="text-slate-700 leading-relaxed">{insights.action}</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-amber-900">Learning Resources</h4>
              </div>
              <div className="space-y-3">
                {insights.resources?.map((resource, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-amber-100">
                    <h5 className="font-semibold text-slate-900 mb-1">{resource.title}</h5>
                    <p className="text-sm text-slate-600">{resource.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}