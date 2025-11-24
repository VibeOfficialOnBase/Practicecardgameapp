import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, TrendingUp, Lightbulb, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AICompanion({ userEmail, gameContext = null, minimized = false }) {
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [currentTip, setCurrentTip] = useState(null);
  const queryClient = useQueryClient();

  const { data: tips = [] } = useQuery({
    queryKey: ['aiCompanionTips', userEmail],
    queryFn: async () => {
      const response = await base44.functions.invoke('getAICompanionTips', {
        gameContext
      });
      return response.data.tips || [];
    },
    enabled: !!userEmail,
    refetchInterval: 60000 // Refresh every minute
  });

  useEffect(() => {
    if (tips.length > 0 && !currentTip) {
      setCurrentTip(tips[0]);
    }
  }, [tips]);

  const dismissTip = useMutation({
    mutationFn: async (tipId) => {
      await base44.functions.invoke('dismissAITip', { tipId });
    },
    onSuccess: () => {
      setCurrentTip(null);
      queryClient.invalidateQueries({ queryKey: ['aiCompanionTips'] });
    }
  });

  if (!currentTip) return null;

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-2xl flex items-center justify-center"
      >
        <Sparkles className="w-6 h-6 text-white animate-pulse" />
      </motion.button>
    );
  }

  const getIcon = () => {
    switch (currentTip.type) {
      case 'strategy': return <Target className="w-5 h-5" />;
      case 'encouragement': return <Heart className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-24 right-6 z-40 max-w-sm"
      >
        <div className="card-organic p-6 shadow-2xl border-2 border-purple-500/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                {getIcon()}
              </div>
              <div>
                <h4 className="font-bold ensure-readable-strong text-sm">AI Companion</h4>
                <p className="text-xs text-label capitalize">{currentTip.type}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-label hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-sm ensure-readable mb-4">{currentTip.message}</p>

          {currentTip.actionable && (
            <div className="bg-purple-500/10 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold ensure-readable-strong mb-1">💡 Quick Tip:</p>
              <p className="text-xs ensure-readable">{currentTip.actionable}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => dismissTip.mutate(currentTip.id)}
              className="flex-1"
            >
              Got it
            </Button>
            {currentTip.action && (
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
                onClick={() => {
                  if (currentTip.action.onClick) currentTip.action.onClick();
                  dismissTip.mutate(currentTip.id);
                }}
              >
                {currentTip.action.label}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}