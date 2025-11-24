import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Wallet } from 'lucide-react';

export default function WalletStatus({ userProfile }) {
  const baseConnected = !!userProfile?.base_wallet_address;
  const algoConnected = !!userProfile?.algorand_wallet_address;
  const vibeUnlocked = userProfile?.vibe_official_pack_unlocked;
  const algoUnlocked = userProfile?.algo_leagues_pack_unlocked;

  const perks = [];
  if (vibeUnlocked) {
    perks.push('10% Score Boost', '5% Fire Rate');
  }
  if (algoUnlocked) {
    perks.push('10% XP Boost', '+1 Extra Life', '15% Blast Power');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-organic p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold ensure-readable-strong">Wallet Status</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
          <div>
            <div className="font-bold ensure-readable-strong">Base Wallet</div>
            <div className="text-sm ensure-readable">
              {baseConnected ? `${userProfile.base_wallet_address.slice(0, 6)}...${userProfile.base_wallet_address.slice(-4)}` : 'Not connected'}
            </div>
          </div>
          {baseConnected ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-gray-500" />
          )}
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
          <div>
            <div className="font-bold ensure-readable-strong">Algorand Wallet</div>
            <div className="text-sm ensure-readable">
              {algoConnected ? `${userProfile.algorand_wallet_address.slice(0, 6)}...${userProfile.algorand_wallet_address.slice(-4)}` : 'Not connected'}
            </div>
          </div>
          {algoConnected ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-gray-500" />
          )}
        </div>

        {(vibeUnlocked || algoUnlocked) && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
            <div className="font-bold mb-3 ensure-readable-strong">🎉 Premium Packs Unlocked</div>
            <div className="space-y-3">
              {vibeUnlocked && (
                <div className="flex items-center gap-3">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/2534ea7df_VIBEOFFICIALLOGO.jpg" 
                    alt="VibeOfficial Logo" 
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}
                  />
                  <span className="font-semibold ensure-readable">$VibeOfficial Premium Pack</span>
                </div>
              )}
              {algoUnlocked && (
                <div className="flex items-center gap-3">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/910ef3c50_ALC.png" 
                    alt="Algo Leagues Logo" 
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}
                  />
                  <span className="font-semibold ensure-readable">Algo Leagues Pack</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}