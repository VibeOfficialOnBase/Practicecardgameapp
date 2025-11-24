import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Sparkles, Crown, Star, Zap } from 'lucide-react';
import { COSMETICS } from './cosmeticsData';

export default function CosmeticsGallery({ userEmail, isVibeHolder, vibeBalance }) {
  const queryClient = useQueryClient();
  const [selectedCosmetic, setSelectedCosmetic] = useState(null);

  const { data: userCosmetics = [] } = useQuery({
    queryKey: ['userCosmetics', userEmail],
    queryFn: () => base44.entities.UserCosmetics.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const userCosmeticsData = userCosmetics[0] || { 
    equipped_cosmetics: [], 
    unlocked_cosmetics: [] 
  };

  const toggleCosmeticMutation = useMutation({
    mutationFn: async (cosmeticId) => {
      const isEquipped = userCosmeticsData.equipped_cosmetics?.includes(cosmeticId);
      const cosmetic = COSMETICS.find(c => c.id === cosmeticId);
      
      // Remove other cosmetics of the same type
      const newEquipped = userCosmeticsData.equipped_cosmetics?.filter(id => {
        const c = COSMETICS.find(cos => cos.id === id);
        return c?.type !== cosmetic?.type;
      }) || [];
      
      // Add this one if not already equipped
      if (!isEquipped) {
        newEquipped.push(cosmeticId);
      }

      const data = {
        user_email: userEmail,
        equipped_cosmetics: newEquipped,
        unlocked_cosmetics: userCosmeticsData.unlocked_cosmetics || []
      };

      if (userCosmetics.length > 0) {
        return base44.entities.UserCosmetics.update(userCosmetics[0].id, data);
      } else {
        return base44.entities.UserCosmetics.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCosmetics', userEmail] });
    }
  });

  const handleToggleCosmetic = (cosmeticId) => {
    if (isVibeHolder) {
      toggleCosmeticMutation.mutate(cosmeticId);
    }
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'card-effect': return <Sparkles className="w-5 h-5" />;
      case 'card-background': return <Star className="w-5 h-5" />;
      case 'profile-badge': return <Crown className="w-5 h-5" />;
      case 'theme': return <Zap className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const categories = [...new Set(COSMETICS.map(c => c.type))];

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <div className={`card-organic p-6 ${isVibeHolder ? 'border-2 border-amber-500/50' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold ensure-readable-strong flex items-center gap-2">
              {isVibeHolder ? '✨ Premium Unlocked' : '🔒 Premium Cosmetics'}
            </h3>
            <p className="text-sm text-label mt-1">
              {isVibeHolder 
                ? `You own ${vibeBalance?.toFixed(0)} $VIBE tokens`
                : 'Hold 5,000+ $VIBE to unlock exclusive cosmetics'
              }
            </p>
          </div>
          {isVibeHolder && (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm ensure-readable text-center">
          <strong>Remember:</strong> All core features are 100% free. These are purely optional cosmetic enhancements to thank our supporters.
        </p>
      </div>

      {/* Cosmetics Grid by Category */}
      {categories.map(category => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-4">
            {getCategoryIcon(category)}
            <h3 className="text-xl font-bold ensure-readable-strong capitalize">
              {category.replace('-', ' ')}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COSMETICS.filter(c => c.type === category).map(cosmetic => {
              const isEquipped = userCosmeticsData.equipped_cosmetics?.includes(cosmetic.id);
              
              return (
                <motion.div
                  key={cosmetic.id}
                  whileHover={isVibeHolder ? { scale: 1.02 } : {}}
                  className={`card-organic p-6 cursor-pointer transition-all ${
                    isVibeHolder ? '' : 'opacity-60'
                  } ${isEquipped ? 'ring-2 ring-amber-500' : ''}`}
                  onClick={() => isVibeHolder && handleToggleCosmetic(cosmetic.id)}
                >
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{cosmetic.preview}</div>
                    <h4 className="text-lg font-bold ensure-readable-strong mb-2">
                      {cosmetic.name}
                    </h4>
                    <p className="text-sm text-label">
                      {cosmetic.description}
                    </p>
                  </div>

                  {!isVibeHolder && (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-white/10 rounded-lg">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-label">Requires 5,000 $VIBE</span>
                    </div>
                  )}

                  {isVibeHolder && (
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                        isEquipped
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                          : 'bg-white/10 text-label hover:bg-white/20'
                      }`}
                    >
                      {isEquipped ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Equipped
                        </span>
                      ) : (
                        'Equip'
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}