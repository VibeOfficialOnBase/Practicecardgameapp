import { useState } from 'react';
import { Copy, LogOut, RefreshCw, Check, ChevronDown, Wallet, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Address } from 'viem';

interface WalletDropdownProps {
  address: Address;
  onDisconnect: () => void;
  onRefreshBalance: () => void;
  isRefreshing: boolean;
  hasBalance?: boolean;
}

export function WalletDropdown({ 
  address, 
  onDisconnect, 
  onRefreshBalance,
  isRefreshing,
  hasBalance = true
}: WalletDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleDisconnect = () => {
    setIsOpen(false);
    onDisconnect();
  };

  const handleRefresh = () => {
    onRefreshBalance();
  };

  return (
    <div className="relative">
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
        aria-label="Wallet management menu"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold hidden sm:inline">{truncatedAddress}</span>
        <span className="text-xs sm:hidden font-semibold">{address.slice(0, 4)}...</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {/* Connection Status */}
              <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-xs font-semibold">Connected to Base</span>
                </div>
                
                {/* Wallet Type Indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-3.5 h-3.5 text-purple-300" />
                  <span className="text-purple-300 text-xs font-semibold">Smart Wallet</span>
                </div>
                
                {/* Wallet Address */}
                <div className="space-y-1">
                  <p className="text-white/60 text-xs">Wallet Address:</p>
                  <div className="flex items-center justify-between gap-2 bg-white/5 rounded px-2 py-1.5">
                    <span className="text-white/80 text-xs font-mono break-all">{address}</span>
                    <button
                      onClick={handleCopy}
                      className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                      aria-label="Copy wallet address"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-xs mt-1"
                  >
                    Full address copied!
                  </motion.p>
                )}
                
                {/* Zero Balance Warning */}
                {!hasBalance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-2 bg-yellow-900/30 border border-yellow-400/30 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-yellow-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-200 text-xs font-semibold mb-1">No balance found?</p>
                        <p className="text-yellow-200/80 text-xs leading-relaxed">
                          Your tokens might be in a different Smart Wallet. Try disconnecting and reconnecting.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Menu Options */}
              <div className="p-2">
                {/* Refresh Balance */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Refresh token balance"
                >
                  <RefreshCw 
                    className={`w-4 h-4 text-purple-300 ${isRefreshing ? 'animate-spin' : ''}`} 
                  />
                  <span className="text-white text-sm font-medium">
                    {isRefreshing ? 'Refreshing...' : 'Refresh Balance'}
                  </span>
                </button>

                {/* Disconnect */}
                <button
                  onClick={handleDisconnect}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                    !hasBalance 
                      ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-400/30' 
                      : 'hover:bg-red-500/20'
                  }`}
                  aria-label="Disconnect wallet and switch to a different one"
                >
                  <LogOut className="w-4 h-4 text-red-300" />
                  <div className="flex flex-col">
                    <span className="text-red-300 text-sm font-medium">
                      {!hasBalance ? 'Switch Wallet' : 'Disconnect'}
                    </span>
                    {!hasBalance && (
                      <span className="text-red-200/70 text-xs">Reconnect with different wallet</span>
                    )}
                  </div>
                </button>
              </div>

              {/* Footer Note */}
              <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                <p className="text-white/50 text-xs text-center leading-relaxed">
                  {!hasBalance 
                    ? 'Connected to the wrong wallet? Disconnect to switch.'
                    : 'Manage your wallet connection'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
