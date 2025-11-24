import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { upgradeManager, UPGRADES, UPGRADE_CATEGORIES } from './UpgradeManager';

export default function UpgradeMenu({ isOpen, onClose, onPurchase }) {
  const [coins, setCoins] = useState(0);
  const [upgradeLevels, setUpgradeLevels] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(UPGRADE_CATEGORIES.POWER);
  const [purchaseAnimation, setPurchaseAnimation] = useState(null);

  useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen]);

  const refresh = () => {
    setCoins(upgradeManager.getCoins());
    const levels = {};
    Object.keys(UPGRADES).forEach(id => {
      levels[id] = upgradeManager.getLevel(id);
    });
    setUpgradeLevels(levels);
  };

  const handlePurchase = (upgradeId) => {
    const upgrade = UPGRADES[upgradeId];
    if (upgradeManager.purchase(upgradeId)) {
      setPurchaseAnimation(upgradeId);
      setTimeout(() => setPurchaseAnimation(null), 2000);
      refresh();
      onPurchase?.(upgrade);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case UPGRADE_CATEGORIES.POWER: return <Zap className="w-5 h-5" />;
      case UPGRADE_CATEGORIES.UTILITY: return <Star className="w-5 h-5" />;
      case UPGRADE_CATEGORIES.SPECIAL: return <Sparkles className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case UPGRADE_CATEGORIES.POWER: return 'from-red-500 to-orange-500';
      case UPGRADE_CATEGORIES.UTILITY: return 'from-blue-500 to-cyan-500';
      case UPGRADE_CATEGORIES.SPECIAL: return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const upgrades = upgradeManager.getUpgradesByCategory(selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden"
            style={{ maxWidth: '100vw' }}
          >
            <div className="bg-gradient-to-b from-purple-900/95 via-indigo-900/95 to-black/95 backdrop-blur-xl rounded-t-3xl border-t-2 border-purple-500/50 shadow-2xl">
              {/* Header */}
              <div className="relative px-6 py-6 border-b border-purple-500/30">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-safe hover:scale-110 transition-transform"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                  <h2 className="text-3xl font-bold text-safe">Upgrades</h2>
                </div>

                {/* Coin Display */}
                <div className="bg-black/50 rounded-2xl px-4 py-3 inline-flex items-center gap-2 border border-amber-500/30">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-xs text-muted">Lumina Coins</p>
                    <p className="text-2xl font-bold text-safe">{coins}</p>
                  </div>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 px-6 py-4 overflow-x-auto">
                {Object.values(UPGRADE_CATEGORIES).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r ' + getCategoryColor(category) + ' text-white shadow-lg scale-105'
                        : 'bg-white/10 text-muted hover:bg-white/20'
                    }`}
                  >
                    {getCategoryIcon(category)}
                    <span className="capitalize">{category}</span>
                  </button>
                ))}
              </div>

              {/* Upgrades Grid */}
              <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
                <div className="space-y-4">
                  {upgrades.map(upgrade => {
                    const level = upgradeLevels[upgrade.id] || 0;
                    const cost = upgradeManager.getCost(upgrade.id);
                    const canAfford = upgradeManager.canAfford(upgrade.id);
                    const isMaxed = level >= upgrade.maxLevel;
                    const isPurchasing = purchaseAnimation === upgrade.id;

                    return (
                      <motion.div
                        key={upgrade.id}
                        layout
                        className="relative bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-purple-500/30 overflow-hidden"
                      >
                        {/* Purchase Animation */}
                        <AnimatePresence>
                          {isPurchasing && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 2 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50 blur-xl"
                            />
                          )}
                        </AnimatePresence>

                        <div className="relative flex items-start gap-4">
                          {/* Icon */}
                          <div className="text-4xl flex-shrink-0">
                            {upgrade.icon}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-safe mb-1">
                              {upgrade.name}
                            </h3>
                            <p className="text-sm text-secondary mb-2">
                              {upgrade.description}
                            </p>

                            {/* Progress Bar */}
                            <div className="relative h-2 bg-black/50 rounded-full overflow-hidden mb-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(level / upgrade.maxLevel) * 100}%` }}
                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getCategoryColor(upgrade.category)} rounded-full`}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted">
                                Level {level} / {upgrade.maxLevel}
                              </span>
                              
                              {!isMaxed && (
                                <span className={`text-sm font-bold ${canAfford ? 'text-amber-400' : 'text-red-400'}`}>
                                  💰 {cost}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Upgrade Button */}
                          <div className="flex-shrink-0">
                            {isMaxed ? (
                              <div className="px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/50">
                                <span className="text-sm font-bold text-green-400">MAX</span>
                              </div>
                            ) : (
                              <motion.button
                                onClick={() => handlePurchase(upgrade.id)}
                                disabled={!canAfford}
                                whileHover={canAfford ? { scale: 1.05 } : {}}
                                whileTap={canAfford ? { scale: 0.95 } : {}}
                                animate={canAfford ? {
                                  boxShadow: [
                                    '0 0 20px rgba(168,85,247,0.5)',
                                    '0 0 40px rgba(168,85,247,0.8)',
                                    '0 0 20px rgba(168,85,247,0.5)'
                                  ]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                                  canAfford
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                Upgrade
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Affirmation on Purchase */}
                        <AnimatePresence>
                          {isPurchasing && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center"
                            >
                              <p className="text-lg font-bold text-safe drop-shadow-lg">
                                ✨ {upgrade.affirmation}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}