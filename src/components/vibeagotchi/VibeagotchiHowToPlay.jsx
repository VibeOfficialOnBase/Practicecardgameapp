import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Sparkles, Zap, Droplets, Wind, Cookie, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VibeagotchiHowToPlay({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="card-organic max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            <Sparkles className="w-8 h-8 text-purple-400" />
            How to Care for Your VibeAGotchi
          </h2>
          <button onClick={onClose} className="text-label hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* What is VibeAGotchi */}
          <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>What is VibeAGotchi?</h3>
            <p style={{ color: '#E8E8E8', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
              Your personal spirit companion that grows and evolves as you practice mindfulness. 
              Keep it happy, healthy, and harmonious to unlock new evolution stages!
            </p>
          </div>

          {/* Stats Explained */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>Understanding Stats</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold" style={{ color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>Energy</p>
                  <p className="text-sm" style={{ color: '#D8D8D8', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Depletes over time. Feed your companion or let it rest to restore.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold" style={{ color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>Happiness</p>
                  <p className="text-sm" style={{ color: '#D8D8D8', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Play mini-games and give treats to boost happiness.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <Droplets className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold" style={{ color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>Cleanliness</p>
                  <p className="text-sm" style={{ color: '#D8D8D8', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Keep your companion clean to prevent sickness.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <Wind className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold" style={{ color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>Peace & Focus</p>
                  <p className="text-sm" style={{ color: '#D8D8D8', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Practice breathing exercises to enhance these stats.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-xl font-bold ensure-readable-strong mb-4">Care Actions</h3>
            <div className="space-y-2">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold ensure-readable mb-1">🍎 Feed</p>
                <p className="text-sm text-label">Reduces hunger, increases energy slightly</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold ensure-readable mb-1">🧼 Clean</p>
                <p className="text-sm text-label">Restores cleanliness, prevents sickness</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold ensure-readable mb-1">🎮 Play</p>
                <p className="text-sm text-label">Boosts happiness, unlocks mini-games</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold ensure-readable mb-1">💊 Heal</p>
                <p className="text-sm text-label">Cures sickness and restores health</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold ensure-readable mb-1">🌬️ Breathe</p>
                <p className="text-sm text-label">Deep breathing exercise increases peace and focus</p>
              </div>
            </div>
          </div>

          {/* Evolution */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
              <Trophy className="w-6 h-6 text-amber-400" />
              Evolution Stages
            </h3>
            <p className="mb-3" style={{ color: '#E8E8E8', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
              Your VibeAGotchi evolves as it gains XP and maintains high stats:
            </p>
            <div className="space-y-2 text-sm">
              <p style={{ color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>✨ <strong>Spark</strong> → <strong>Ember</strong> → <strong>Flame</strong> → <strong>Radiant</strong> → <strong>Celestial</strong> → <strong>Transcendent</strong></p>
              <p style={{ color: '#D8D8D8', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Keep all stats above 50 to trigger evolution!</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-indigo-500/20 rounded-xl p-4 border border-indigo-500/30">
            <h3 className="text-xl font-bold mb-3" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>Pro Tips</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#D8D8D8', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              <li>• Check in daily to maintain your harmony streak</li>
              <li>• Buy items from the shop to customize your companion</li>
              <li>• Play mini-games to earn bonus XP</li>
              <li>• Don't let stats drop too low or your companion may get sick</li>
              <li>• Complete daily practice to boost multiple stats at once</li>
            </ul>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 text-lg"
          >
            Start Caring for Your VibeAGotchi! ✨
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}