import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Wallet, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface PurchaseOption {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  gradient: string;
  badge?: string;
}

interface PurchaseOptionsModalProps {
  open: boolean;
  onClose: () => void;
  tokenAddress: string;
}

export function PurchaseOptionsModal({ open, onClose, tokenAddress }: PurchaseOptionsModalProps) {
  const purchaseOptions: PurchaseOption[] = [
    {
      name: 'Base Wallet',
      description: 'Official Coinbase Wallet - Easiest way to buy',
      icon: <Wallet className="w-6 h-6" />,
      url: `https://go.cb-w.com/swap?asset=${tokenAddress}&network=base`,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'Recommended'
    },
    {
      name: 'Uniswap',
      description: 'Trade on the world\'s largest DEX',
      icon: <DollarSign className="w-6 h-6" />,
      url: `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=base`,
      gradient: 'from-pink-500 to-purple-600',
    },
    {
      name: 'DEX Screener',
      description: 'View live charts and trading data',
      icon: <TrendingUp className="w-6 h-6" />,
      url: `https://dexscreener.com/base/${tokenAddress}`,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Aerodrome',
      description: 'Base\'s premier liquidity marketplace',
      icon: <Sparkles className="w-6 h-6" />,
      url: `https://aerodrome.finance/swap?from=eth&to=${tokenAddress}`,
      gradient: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl"
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white/20">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <img
                      src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                      alt="VibeOfficial"
                      width={50}
                      height={50}
                      className="object-contain rounded-full shadow-lg border-2 border-purple-300/50"
                    />
                  </div>
                  <motion.h2 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl font-bold gradient-text mb-2"
                  >
                    Get $VibeOfficial Tokens
                  </motion.h2>
                  <motion.p 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-indigo-200 text-sm"
                  >
                    Choose your preferred platform to purchase $VibeOfficial tokens
                  </motion.p>
                </div>

                {/* Purchase Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {purchaseOptions.map((option, index) => (
                    <motion.div
                      key={option.name}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                    >
                      <button
                        onClick={() => {
                          window.open(option.url, '_blank');
                          onClose();
                        }}
                        className="relative w-full group"
                      >
                        <div className={`glass-card glass-card-hover p-5 rounded-xl border-2 border-white/10 hover:border-white/30 transition-all duration-300 h-full`}>
                          {/* Badge */}
                          {option.badge && (
                            <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold text-gray-900 rounded-full shadow-lg">
                              {option.badge}
                            </div>
                          )}

                          {/* Icon with gradient background */}
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {option.icon}
                          </div>

                          {/* Content */}
                          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                            {option.name}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </h3>
                          <p className="text-indigo-200 text-sm">
                            {option.description}
                          </p>

                          {/* Hover indicator */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer info */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center glass-card p-4 rounded-xl"
                >
                  <p className="text-indigo-200 text-xs leading-relaxed">
                    💡 <span className="font-semibold text-white">Tip:</span> You need at least 1,000 $VibeOfficial tokens to pull daily cards. All platforms trade on Base network.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
