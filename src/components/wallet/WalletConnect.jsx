import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, LogOut, ChevronDown, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WalletConnect() {
  const {
    walletAddress,
    walletType,
    isConnecting,
    error,
    isConnected,
    connectPera,
    connectDefly,
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
    }
    setShowConnectModal(false);
  };

  // Connected state
  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-white">
            {getShortAddress(walletAddress)}
          </span>
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
              </div>

              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/70" />}
                <span className="text-sm text-white">{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>

              <a
                href={`https://allo.info/account/${walletAddress}`}
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
              className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2 text-center">Connect Wallet</h2>
              <p className="text-white/60 text-sm text-center mb-6">
                Choose your preferred Algorand wallet
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handleConnect('pera')}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-xl">🟡</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">Pera Wallet</p>
                    <p className="text-xs text-white/50">Connect with Pera</p>
                  </div>
                </button>

                <button
                  onClick={() => handleConnect('defly')}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-xl">🔵</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">Defly Wallet</p>
                    <p className="text-xs text-white/50">Connect with Defly</p>
                  </div>
                </button>
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
