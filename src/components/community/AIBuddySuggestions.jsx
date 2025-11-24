import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIBuddySuggestions({ userEmail }) {
  const [suggestions, setSuggestions] = useState([]);
  const queryClient = useQueryClient();

  const generateSuggestions = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('suggestBuddies', { userEmail });
      return response.data.suggestions || [];
    },
    onSuccess: (data) => {
      setSuggestions(data);
    }
  });

  const sendRequest = useMutation({
    mutationFn: async ({ buddyEmail, reason }) => {
      await base44.entities.BuddyConnection.create({
        user_email: userEmail,
        buddy_email: buddyEmail,
        shared_focus: reason,
        connection_date: new Date().toISOString(),
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buddyConnections'] });
      alert('Connection request sent!');
    }
  });

  return (
    <div className="card-organic p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-bold text-white">AI Buddy Matches</h3>
        </div>
        <Button
          onClick={() => generateSuggestions.mutate()}
          disabled={generateSuggestions.isPending}
          className="bg-purple-500 hover:bg-purple-600 rounded-xl"
        >
          {generateSuggestions.isPending ? 'Analyzing...' : 'Find Matches'}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <motion.div
              key={suggestion.email}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-slate-900">{suggestion.email.split('@')[0]}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-bold">{suggestion.compatibility_score}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{suggestion.reason}</p>
                  <Button
                    onClick={() => sendRequest.mutate({ 
                      buddyEmail: suggestion.email, 
                      reason: suggestion.reason 
                    })}
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}