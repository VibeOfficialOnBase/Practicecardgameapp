import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const gameOptions = [
  { value: 'chakra_blaster', label: 'Chakra Blaster', icon: Zap },
  { value: 'challenge_bubbles', label: 'Challenge Bubbles', icon: Trophy },
  { value: 'memory_match', label: 'Memory Match', icon: Brain }
];

const challengeTypes = [
  { value: 'beat_score', label: 'Beat My Score' },
  { value: 'reach_level', label: 'Reach Level' },
  { value: 'complete_in_time', label: 'Complete in Time' },
  { value: 'custom', label: 'Custom Challenge' }
];

export default function CreateChallengeModal({ friendEmail, onClose }) {
  const [gameType, setGameType] = useState('chakra_blaster');
  const [gameMode, setGameMode] = useState('normal');
  const [challengeType, setChallengeType] = useState('beat_score');
  const [targetValue, setTargetValue] = useState('');
  const [timeLimitDays, setTimeLimitDays] = useState(3);
  const [customDescription, setCustomDescription] = useState('');
  const queryClient = useQueryClient();

  const createChallenge = useMutation({
    mutationFn: async (data) => {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + timeLimitDays);
      
      return await base44.entities.CustomChallenge.create({
        ...data,
        expires_at: expiresAt.toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      onClose();
    }
  });

  const handleSubmit = async () => {
    const user = await base44.auth.me();
    
    createChallenge.mutate({
      creator_email: user.email,
      challenged_email: friendEmail,
      game_type: gameType,
      game_mode: gameMode,
      challenge_type: challengeType,
      target_value: parseFloat(targetValue),
      time_limit_days: timeLimitDays,
      custom_description: customDescription
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="card-organic p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold ensure-readable-strong">
            Create Challenge
          </h3>
          <button onClick={onClose} className="text-label hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold ensure-readable mb-2 block">
              Game
            </label>
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gameOptions.map((game) => (
                  <SelectItem key={game.value} value={game.value}>
                    {game.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold ensure-readable mb-2 block">
              Challenge Type
            </label>
            <Select value={challengeType} onValueChange={setChallengeType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {challengeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {challengeType !== 'custom' && (
            <div>
              <label className="text-sm font-semibold ensure-readable mb-2 block">
                Target {challengeType === 'beat_score' ? 'Score' : challengeType === 'reach_level' ? 'Level' : 'Time (seconds)'}
              </label>
              <Input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="Enter target value"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold ensure-readable mb-2 block">
              Time Limit (Days)
            </label>
            <Input
              type="number"
              value={timeLimitDays}
              onChange={(e) => setTimeLimitDays(parseInt(e.target.value))}
              min="1"
              max="30"
            />
          </div>

          <div>
            <label className="text-sm font-semibold ensure-readable mb-2 block">
              Custom Message
            </label>
            <Textarea
              placeholder="Add a motivational message or custom challenge details..."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createChallenge.isPending || (!targetValue && challengeType !== 'custom')}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Create Challenge
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}