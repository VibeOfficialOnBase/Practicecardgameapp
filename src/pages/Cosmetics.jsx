import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import CosmeticsGallery from '../components/cosmetics/CosmeticsGallery';
import BaseWalletConnect from '../components/wallet/BaseWalletConnect';

export default function CosmeticsPage() {
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
  const isVibeHolder = userProfile?.vibe_official_pack_unlocked || false;
  const hasWalletConnected = !!userProfile?.base_wallet_address;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to={createPageUrl('Dashboard')}
            className="inline-flex items-center gap-2 text-label hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold ensure-readable-strong">Premium Cosmetics</h1>
              <p className="text-lg text-label">Optional visual rewards for $VIBE holders</p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Connection Section */}
        {!hasWalletConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="card-organic p-8">
              <div className="flex items-start gap-4 mb-6">
                <Wallet className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold ensure-readable-strong mb-2">
                    Connect Your Wallet
                  </h2>
                  <p className="text-label mb-4">
                    Connect your Base wallet to verify your $VIBEOFFICIAL token holdings and unlock exclusive cosmetics.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <p className="text-sm ensure-readable">
                      <strong>What you need:</strong> Hold at least 5,000 $VIBE tokens on Base network to unlock all cosmetics.
                    </p>
                  </div>
                </div>
              </div>
              
              {user && <BaseWalletConnect />}
            </div>
          </motion.div>
        )}

        {/* Cosmetics Gallery */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CosmeticsGallery 
              userEmail={user.email}
              isVibeHolder={isVibeHolder}
              vibeBalance={5000} // This would come from actual balance check
            />
          </motion.div>
        )}

        {/* Footer Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 card-organic p-6 text-center"
        >
          <p className="text-sm text-label">
            <strong>Core Guarantee:</strong> Every feature of the PRACTICE app—daily cards, streaks, games, community, achievements—is completely free and always will be. Cosmetics are purely optional visual enhancements to thank our community supporters.
          </p>
        </motion.div>
      </div>
    </div>
  );
}