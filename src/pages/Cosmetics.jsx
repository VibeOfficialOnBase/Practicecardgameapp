import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import CosmeticsGallery from '../components/cosmetics/CosmeticsGallery';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { TokenGatedFeature } from '../components/TokenGatedFeature';
import { useVibeTokenVerification } from '@/hooks/useVibeTokenVerification';

export default function CosmeticsPage() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { isConnected, isEligible } = useVibeTokenVerification();

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
            to={createPageUrl('Practice')}
            className="inline-flex items-center gap-2 text-label hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Practice
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
        {!isConnected && (
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
                      <strong>What you need:</strong> Hold at least 100 $VIBE tokens on Base network to unlock all cosmetics.
                    </p>
                  </div>
                </div>
              </div>
              
              <WalletConnectButton />
            </div>
          </motion.div>
        )}

        {/* Connected Status */}
        {isConnected && (
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 card-organic p-6"
           >
             <h3 className="text-lg font-bold mb-4">Wallet Status</h3>
             <WalletConnectButton />
           </motion.div>
        )}

        {/* Cosmetics Gallery */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TokenGatedFeature
                fallback={
                    <div className="relative">
                        <div className="blur-sm pointer-events-none opacity-50">
                            <CosmeticsGallery
                                userEmail={user.email}
                                isVibeHolder={false}
                                vibeBalance={0}
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
                                <div className="text-4xl mb-2">🔒</div>
                                <p className="font-semibold text-gray-800">
                                    Connect Wallet & Hold 100 $VIBE to Unlock
                                </p>
                            </div>
                        </div>
                    </div>
                }
            >
                <CosmeticsGallery
                    userEmail={user.email}
                    isVibeHolder={true}
                    vibeBalance={100}
                />
            </TokenGatedFeature>
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
