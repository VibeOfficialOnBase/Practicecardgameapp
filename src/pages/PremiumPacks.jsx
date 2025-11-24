import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Crown, Zap, Shield, Sparkles, Trophy, Target } from 'lucide-react';
import BaseWalletConnect from '../components/wallet/BaseWalletConnect';
import AlgorandWalletConnect from '../components/wallet/AlgorandWalletConnect';

export default function PremiumPacks() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: userProfiles = [] } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: user?.email }),
    enabled: !!user
  });

  const userProfile = userProfiles[0];

  const handleVerificationComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  };

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
            Unlock exclusive perks by holding crypto assets
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* VibeOfficial Premium Pack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`card-organic p-8 relative overflow-hidden ${
              userProfile?.vibe_official_pack_unlocked ? 'border-2 border-purple-500' : ''
            }`}
          >
            {userProfile?.vibe_official_pack_unlocked && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-amber-500/10 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/2534ea7df_VIBEOFFICIALLOGO.jpg" 
                  alt="VibeOfficial Logo" 
                  loading="lazy"
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}
                />
                <div>
                  <h2 className="text-3xl font-bold ensure-readable-strong">$VibeOfficial</h2>
                  <p className="text-lg text-label">Premium Pack</p>
                </div>
              </div>

              {userProfile?.vibe_official_pack_unlocked && (
                <div className="mb-6 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                  <p className="font-bold text-green-400 flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Pack Unlocked!
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 ensure-readable">Requirements:</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="ensure-readable">Hold minimum <span className="font-bold text-purple-400">5,000 $VibeOfficial</span> tokens</p>
                  <p className="text-xs text-label mt-2 font-mono break-all">
                    Contract: 0xa57b7d6fe91c26c5dcc3c7f7f26ba897c4fe6a3e
                  </p>
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

              {user && (
                <BaseWalletConnect 
                  userEmail={user.email}
                  onVerificationComplete={handleVerificationComplete}
                />
              )}
            </div>
          </motion.div>

          {/* Algo Leagues Pack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`card-organic p-8 relative overflow-hidden ${
              userProfile?.algo_leagues_pack_unlocked ? 'border-2 border-cyan-500' : ''
            }`}
          >
            {userProfile?.algo_leagues_pack_unlocked && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/910ef3c50_ALC.png" 
                  alt="Algo Leagues Logo" 
                  loading="lazy"
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}
                />
                <div>
                  <h2 className="text-3xl font-bold ensure-readable-strong">Algo Leagues</h2>
                  <p className="text-lg text-label">Premium Pack</p>
                </div>
              </div>

              {userProfile?.algo_leagues_pack_unlocked && (
                <div className="mb-6 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                  <p className="font-bold text-green-400 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Pack Unlocked!
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 ensure-readable">Requirements (Any One):</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="ensure-readable font-semibold mb-1">Option 1: NFT Holder</p>
                    <p className="text-sm text-label">Own any Algo Leagues NFT</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="ensure-readable font-semibold mb-1">Option 2: ALC Holder</p>
                    <p className="text-sm text-label">Hold 10,000+ Algo Leagues Coin (ASA: 445905873)</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="ensure-readable font-semibold mb-1">Option 3: VIP Holder</p>
                    <p className="text-sm text-label">Hold 1+ VIP Algo Leagues Asset (ASA: 449137537)</p>
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

              {user && (
                <AlgorandWalletConnect 
                  userEmail={user.email}
                  onVerificationComplete={handleVerificationComplete}
                />
              )}
            </div>
          </motion.div>
        </div>

        {userProfile?.vibe_official_pack_unlocked && userProfile?.algo_leagues_pack_unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 card-organic p-8 text-center bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-gradient"
          >
            <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2 ensure-readable-strong">Ultimate Champion!</h2>
            <p className="text-lg ensure-readable">
              You've unlocked BOTH premium packs! All perks are stacked for maximum power. 🚀
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}