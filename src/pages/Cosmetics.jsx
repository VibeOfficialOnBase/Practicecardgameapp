import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import CosmeticsGallery from '../components/cosmetics/CosmeticsGallery';

export default function CosmeticsPage() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Since we are standalone, we can unlock cosmetics based on XP or Levels instead of tokens.
  // For now, we'll show all as unlocked or use a mock "unlocked" state if available in user profile.
  // Or we can just show them as available.
  const isVibeHolder = true;

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
              <p className="text-lg text-label">Unlock visual styles by practicing daily</p>
            </div>
          </div>
        </motion.div>

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
                vibeBalance={100}
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
            <strong>Core Guarantee:</strong> Every feature of the PRACTICE app—daily cards, streaks, games, community, achievements—is completely free and always will be. Cosmetics are purely optional visual enhancements.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
