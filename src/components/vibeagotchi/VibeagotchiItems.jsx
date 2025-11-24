import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Heart, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const items = [
  { id: 'crown', name: 'Royal Crown', icon: Crown, cost: 500, effect: '+10 Happiness' },
  { id: 'star_badge', name: 'Star Badge', icon: Star, cost: 300, effect: '+5 Bond' },
  { id: 'heart_charm', name: 'Heart Charm', icon: Heart, cost: 400, effect: '+15 Health' },
  { id: 'sparkle_ring', name: 'Sparkle Ring', icon: Sparkles, cost: 600, effect: '+20 Energy' },
];

export default function VibeagotchiItems({ ownedItems = [], currentXP, equippedItem, onPurchase, onEquip }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const owned = ownedItems.includes(item.id);
        const equipped = equippedItem === item.id;
        const canAfford = currentXP >= item.cost;

        return (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className={`card-organic p-4 ${equipped ? 'border-2 border-purple-500' : ''}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                owned ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gray-600/30'
              }`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <p className="font-bold text-sm ensure-readable mb-1">{item.name}</p>
              <p className="text-xs text-label mb-2">{item.effect}</p>
              
              {!owned ? (
                <Button
                  size="sm"
                  onClick={() => onPurchase(item.id, item.cost)}
                  disabled={!canAfford}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600"
                >
                  <Gift className="w-3 h-3 mr-1" />
                  {item.cost} XP
                </Button>
              ) : equipped ? (
                <Button size="sm" variant="outline" className="w-full" disabled>
                  Equipped
                </Button>
              ) : (
                <Button size="sm" onClick={() => onEquip(item.id)} className="w-full">
                  Equip
                </Button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}