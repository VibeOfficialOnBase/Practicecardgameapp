import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Crown, Zap, Shield, Sparkles, Trophy, Target } from 'lucide-react';

export default function PremiumPacks() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Since we are standalone, we unlock these based on progression or they are just available
  // We can make them "unlocked" by default or achievable via XP.
  // For now, let's show them as available features or achievements to unlock via Gameplay (mocked).
  const vibeOfficialPerks = [
    { icon: Trophy, text: '+10% bonus score in all games' },
    { icon: Zap, text: '+5% faster firing rate in Chakra Blaster' },
    { icon: Sparkles, text: '+1 extra shuffle in Memory Match' },
    { icon: Target, text: '+1 extra explosion orb in Bubble Challenge' },
    { icon: Crown, text: 'Exclusive purple-gold aura' }
  ];

  const algoLeaguesPerks = [
    { icon: Sparkles, text: '+10% XP gain globally' },
    { icon: Shield, text: '+1 extra life in all games' },
    { icon: Zap, text: '+15% stronger blasts in Chakra Blaster' },
    { icon: Crown, text: 'Legendary Algo Leagues theme' },
    { icon: Target, text: 'Special "Algo Burst" power (60s cooldown)' }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 ensure-readable-strong flex items-center justify-center gap-3">
            <Crown className="w-12 h-12 text-amber-400" />
            Premium Packs
          </h1>
          <p className="text-xl ensure-readable">
            Unlock exclusive perks by leveling up your profile
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* VibeOfficial Premium Pack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`card-organic p-8 relative overflow-hidden border-2 border-purple-500`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold ensure-readable-strong">Vibe Master</h2>
                  <p className="text-lg text-label">Premium Pack</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 ensure-readable">Requirements:</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="ensure-readable">Reach <span className="font-bold text-purple-400">Level 10</span></p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 ensure-readable">Perks:</h3>
                <div className="space-y-2">
                  {vibeOfficialPerks.map((perk, idx) => {
                    const Icon = perk.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-sm ensure-readable">
                        <Icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>{perk.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Algo Leagues Pack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`card-organic p-8 relative overflow-hidden border-2 border-cyan-500`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold ensure-readable-strong">League Champion</h2>
                  <p className="text-lg text-label">Premium Pack</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 ensure-readable">Requirements:</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="ensure-readable font-semibold mb-1">Reach Level 20</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 ensure-readable">Perks:</h3>
                <div className="space-y-2">
                  {algoLeaguesPerks.map((perk, idx) => {
                    const Icon = perk.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-sm ensure-readable">
                        <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{perk.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
