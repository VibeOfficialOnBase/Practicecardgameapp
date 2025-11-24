import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Zap, Brain, ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import BaseWalletConnect from '../wallet/BaseWalletConnect';
import AlgorandWalletConnect from '../wallet/AlgorandWalletConnect';

const intentions = [
  { id: 'peace', label: 'Inner Peace', icon: '🕊️' },
  { id: 'growth', label: 'Personal Growth', icon: '🌱' },
  { id: 'healing', label: 'Emotional Healing', icon: '💚' },
  { id: 'connection', label: 'Community Connection', icon: '🤝' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' }
];

const games = [
  { id: 'chakra_blaster', name: 'Chakra Blaster', icon: Zap, desc: 'Release negativity with light' },
  { id: 'challenge_bubbles', name: 'Challenge Bubbles', icon: Sparkles, desc: 'Match emotions & find clarity' },
  { id: 'memory_match', name: 'Memory Match', icon: Brain, desc: 'Train your mind with affirmations' }
];

export default function OnboardingSetup({ userEmail, onComplete }) {
  const [step, setStep] = useState(1);
  const [intention, setIntention] = useState('');
  const [selectedGames, setSelectedGames] = useState([]);
  const [baseWallet, setBaseWallet] = useState(null);
  const [algoWallet, setAlgoWallet] = useState(null);
  const [saving, setSaving] = useState(false);

  const toggleGame = (gameId) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(g => g !== gameId));
    } else if (selectedGames.length < 3) {
      setSelectedGames([...selectedGames, gameId]);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const profiles = await base44.entities.UserProfile.filter({ created_by: userEmail });
      
      const profileData = {
        daily_intention: intention,
        preferred_games: selectedGames,
        base_wallet_address: baseWallet,
        algorand_wallet_address: algoWallet,
        onboarding_completed: true
      };

      if (profiles.length > 0) {
        await base44.entities.UserProfile.update(profiles[0].id, profileData);
      } else {
        await base44.entities.UserProfile.create(profileData);
      }

      onComplete();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-organic p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 flex-1 mx-1 rounded-full transition-all ${i <= step ? 'bg-purple-500' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-3xl font-bold mb-2 ensure-readable-strong">Set Your Intention</h2>
              <p className="mb-6 ensure-readable">What brings you to LECHE today?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {intentions.map(int => (
                  <button
                    key={int.id}
                    onClick={() => setIntention(int.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      intention === int.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-3xl mb-2">{int.icon}</div>
                    <div className="font-bold ensure-readable-strong">{int.label}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!intention}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-3xl font-bold mb-2 ensure-readable-strong">Choose Your Games</h2>
              <p className="mb-6 ensure-readable">Select up to 3 daily practice games</p>
              
              <div className="space-y-4 mb-8">
                {games.map(game => {
                  const Icon = game.icon;
                  const isSelected = selectedGames.includes(game.id);
                  return (
                    <button
                      key={game.id}
                      onClick={() => toggleGame(game.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-8 h-8 text-purple-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-bold ensure-readable-strong">{game.name}</div>
                        <div className="text-sm ensure-readable">{game.desc}</div>
                      </div>
                      {isSelected && <Check className="w-6 h-6 text-purple-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedGames.length === 0}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-3xl font-bold mb-2 ensure-readable-strong">Connect Wallets (Optional)</h2>
              <p className="mb-6 ensure-readable">Unlock premium features by connecting your wallets</p>
              
              <div className="space-y-6 mb-8">
                <div className="card-organic p-6">
                  <h3 className="font-bold mb-2 ensure-readable-strong">Base Wallet</h3>
                  <p className="text-sm mb-4 ensure-readable">Hold 5000+ $VibeOfficial tokens to unlock premium perks</p>
                  <BaseWalletConnect onConnect={setBaseWallet} />
                </div>

                <div className="card-organic p-6">
                  <h3 className="font-bold mb-2 ensure-readable-strong">Algorand Wallet</h3>
                  <p className="text-sm mb-4 ensure-readable">Hold Algo Leagues assets to unlock exclusive features</p>
                  <AlgorandWalletConnect onConnect={setAlgoWallet} />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="flex-1 btn-primary"
                >
                  {saving ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}