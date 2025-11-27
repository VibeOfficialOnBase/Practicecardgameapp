import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, LogOut, ChevronDown, Copy, Check, ExternalLink, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WalletConnect() {
  const {
    walletAddress,
    walletType,
    isConnecting,
    error,
    isConnected,
    isVibeHolder,
    connectPera,
    connectDefly,
    connectBase,
    disconnectWallet,
    getShortAddress,
  } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = async (walletName) => {
    if (walletName === 'pera') {
      await connectPera();
    } else if (walletName === 'defly') {
      await connectDefly();
    } else if (walletName === 'base') {
      await connectBase();
    }
    setShowConnectModal(false);
  };

  // Get explorer URL based on wallet type
  const getExplorerUrl = () => {
    if (walletType === 'base') {
      return `https://basescan.org/address/${walletAddress}`;
    }
    return `https://allo.info/account/${walletAddress}`;
  };

  // Connected state
  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
        >
          <div className={`w-2 h-2 rounded-full ${isVibeHolder ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`} />
          <span className="text-sm font-medium text-white">
            {getShortAddress(walletAddress)}
          </span>
          {isVibeHolder && <Gift className="w-3 h-3 text-amber-400" />}
          <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-white/10 rounded-xl shadow-xl p-2 z-50"
            >
              <div className="p-3 border-b border-white/10 mb-2">
                <p className="text-xs text-white/50 uppercase mb-1">Connected with {walletType}</p>
                <p className="text-sm text-white font-mono truncate">{walletAddress}</p>
                {isVibeHolder && (
                  <div className="mt-2 flex items-center gap-2 bg-amber-500/10 rounded-lg px-2 py-1">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-400 font-bold">Holders Bonus Pack Unlocked!</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/70" />}
                <span className="text-sm text-white">{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>

              <a
                href={getExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white">View on Explorer</span>
              </a>

              <button
                onClick={() => {
                  disconnectWallet();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Disconnected state
  return (
    <>
      <Button
        onClick={() => setShowConnectModal(true)}
        disabled={isConnecting}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </Button>

      {/* Connect Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConnectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm min-w-[380px] min-h-[500px] bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col"
            >
              <h2 className="text-xl font-bold text-white mb-2 text-center">Connect Wallet</h2>
              <p className="text-white/60 text-sm text-center mb-6 leading-relaxed">
                Choose your preferred wallet to connect
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3 flex-1">
                {/* Base Wallet Section */}
                <div className="mb-4">
                  <p className="text-xs text-white/50 uppercase mb-2 font-bold">Base Network</p>
                  <button
                    onClick={() => handleConnect('base')}
                    disabled={isConnecting}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 rounded-xl border border-blue-500/30 transition-all disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src="/vibe_logo.jpg" 
                        alt="$VibeOfficial" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white text-base">Base Wallet</p>
                      <p className="text-sm text-white/50 leading-relaxed">Connect for $VibeOfficial Holders Pack</p>
                    </div>
                    <Gift className="w-5 h-5 text-amber-400" />
                  </button>
                </div>

                {/* Algorand Wallet Section */}
                <div>
                  <p className="text-xs text-white/50 uppercase mb-2 font-bold">Algorand Network</p>
                  <button
                    onClick={() => handleConnect('pera')}
                    disabled={isConnecting}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all disabled:opacity-50 mb-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🟡</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white text-base">Pera Wallet</p>
                      <p className="text-sm text-white/50 leading-relaxed">Connect with Pera mobile or web wallet</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleConnect('defly')}
                    disabled={isConnecting}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🔵</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white text-base">Defly Wallet</p>
                      <p className="text-sm text-white/50 leading-relaxed">Connect with Defly mobile wallet</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowConnectModal(false)}
                className="w-full mt-4 p-3 text-white/60 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
