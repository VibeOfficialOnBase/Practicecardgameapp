import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Calendar, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateChallenge() {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [lecheValue, setLecheValue] = useState('All');
  const [duration, setDuration] = useState(7);
  const queryClient = useQueryClient();

  const createChallenge = useMutation({
    mutationFn: async () => {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + duration);

      return base44.entities.CommunityChallenge.create({
        title,
        description,
        theme,
        leche_value: lecheValue,
        start_date: today.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        duration_days: duration,
        participants_count: 0,
        is_active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityChallenges'] });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setTheme('');
      setLecheValue('All');
      setDuration(7);
    }
  });

  if (!isCreating) {
    return (
      <Button
        onClick={() => setIsCreating(true)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Community Challenge
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="card-organic p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-500" />
          Create New Challenge
        </h3>
        <Button
          variant="ghost"
          onClick={() => setIsCreating(false)}
          className="text-sm"
        >
          Cancel
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-contrast mb-2 block">
            Challenge Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 30 Days of Gratitude"
            className="rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-contrast mb-2 block">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this challenge about?"
            className="rounded-xl"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-contrast mb-2 block">
            Theme / Focus
          </label>
          <Input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., Daily Gratitude Practice"
            className="rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-contrast mb-2 block">
            LECHE Value
          </label>
          <Select value={lecheValue} onValueChange={setLecheValue}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Values</SelectItem>
              <SelectItem value="Love">💗 Love</SelectItem>
              <SelectItem value="Empathy">🤝 Empathy</SelectItem>
              <SelectItem value="Community">👥 Community</SelectItem>
              <SelectItem value="Healing">🌿 Healing</SelectItem>
              <SelectItem value="Empowerment">⚡ Empowerment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-semibold text-contrast mb-2 block flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Duration (days)
          </label>
          <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="14">14 Days</SelectItem>
              <SelectItem value="21">21 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="60">60 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => createChallenge.mutate()}
          disabled={!title || !description || !theme || createChallenge.isPending}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Award className="w-5 h-5" />
          {createChallenge.isPending ? 'Creating...' : 'Launch Challenge'}
        </Button>
      </div>
    </motion.div>
  );
}