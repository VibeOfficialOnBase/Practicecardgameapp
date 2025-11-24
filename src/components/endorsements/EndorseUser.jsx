import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Award, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const traits = [
  { value: 'Supportive', icon: Heart, color: 'rose' },
  { value: 'Inspiring', icon: Sparkles, color: 'amber' },
  { value: 'Consistent', icon: Award, color: 'blue' },
  { value: 'Empathetic', icon: Heart, color: 'purple' },
  { value: 'Leader', icon: Award, color: 'indigo' },
  { value: 'Kind', icon: Heart, color: 'pink' },
  { value: 'Motivating', icon: Sparkles, color: 'orange' },
  { value: 'Thoughtful', icon: Heart, color: 'green' }
];

export default function EndorseUser({ endorsedEmail, userEmail }) {
  const [showEndorse, setShowEndorse] = useState(false);
  const [selectedTrait, setSelectedTrait] = useState('');
  const [endorsementMessage, setEndorsementMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: receivedEndorsements = [] } = useQuery({
    queryKey: ['endorsements', endorsedEmail],
    queryFn: () => base44.entities.Endorsement.filter({ endorsed_email: endorsedEmail }),
    enabled: !!endorsedEmail
  });

  const endorseUser = useMutation({
    mutationFn: async () => {
      await base44.entities.Endorsement.create({
        endorser_email: userEmail,
        endorsed_email: endorsedEmail,
        trait: selectedTrait,
        message: endorsementMessage
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endorsements'] });
      setShowEndorse(false);
      setSelectedTrait('');
      setEndorsementMessage('');
      alert('Endorsement sent!');
    }
  });

  const traitCounts = traits.map(trait => ({
    ...trait,
    count: receivedEndorsements.filter(e => e.trait === trait.value).length
  }));

  return (
    <div className="card-organic p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Community Endorsements</h3>
        <Button
          onClick={() => setShowEndorse(!showEndorse)}
          variant="outline"
          size="sm"
          className="rounded-xl"
        >
          <Award className="w-4 h-4 mr-2" />
          Endorse
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {traitCounts.map((trait) => {
          const Icon = trait.icon;
          return (
            <div
              key={trait.value}
              className={`p-3 rounded-xl bg-${trait.color}-50 border border-${trait.color}-200`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${trait.color}-600`} />
                <span className="text-sm font-semibold text-slate-900">{trait.value}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{trait.count} endorsements</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showEndorse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-4 border-t border-slate-200"
          >
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Select a trait:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {traits.map((trait) => (
                  <button
                    key={trait.value}
                    onClick={() => setSelectedTrait(trait.value)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      selectedTrait === trait.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-900">{trait.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Add a message (optional):
              </label>
              <Textarea
                value={endorsementMessage}
                onChange={(e) => setEndorsementMessage(e.target.value)}
                placeholder="Why are you endorsing them for this trait?"
                className="min-h-20 rounded-xl"
              />
            </div>

            <Button
              onClick={() => endorseUser.mutate()}
              disabled={!selectedTrait || endorseUser.isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl"
            >
              Send Endorsement
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}