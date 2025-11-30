/**
 * Connect Wallet Button Component
 * 
 * A button that opens the wallet connection modal.
 * Shows connection status when wallets are connected.
 * 
 * NOTE: Algorand wallet support has been commented out as part of UI simplification.
 * The UI now presents a single, streamlined wallet connection option for Base network.
 * To re-enable Algorand support, uncomment the relevant sections marked with
 * "DISABLED: Algorand wallet support" comments.
 * 
 * @module components/wallet/ConnectWalletButton
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { 
  Wallet, 
  ChevronDown, 
  Copy, 
  Check, 
  ExternalLink, 
  LogOut,
  Gift 
} from 'lucide-react';
import { useWallet } from '@/web3/WalletContext';
import WalletModal from './WalletModal';
import { Button } from '@/components/ui/button';

/**
 * ConnectWalletButton Component
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 */
export default function ConnectWalletButton({ className = '' }) {
  const {
    /* DISABLED: Algorand wallet support - uncomment to re-enable
    algoAddress,
    isAlgoConnected,
    disconnectAlgorand,
    formatAlgoAddress,
    */
    evmAddress,
    isEvmConnected,
    isConnecting,
    hasAnyWallet,
    disconnectEVM,
    formatEVMAddress,
    getBaseExplorerUrl,
  } = useWallet();
  
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(null);

  /**
   * Copy address to clipboard
   */
  const handleCopy = async (address, type) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  /**
   * Get explorer URL for an address
   */
  const getExplorerUrl = (address, type) => {
    if (type === 'evm') {
      return getBaseExplorerUrl(address);
    }
    /* DISABLED: Algorand wallet support - uncomment to re-enable
    // Algorand explorer
    return `https://allo.info/account/${address}`;
    */
    return '#';
  };

  /* DISABLED: Algorand wallet support - uncomment to re-enable
   * Disconnect all wallets
   *
  const handleDisconnectAll = async () => {
    if (isAlgoConnected) await disconnectAlgorand();
    if (isEvmConnected) await disconnectEVM();
    setShowDropdown(false);
  };
  */

  // Connected state - show dropdown (simplified for Base wallet only)
  if (hasAnyWallet) {
    return (
      <>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl 
              bg-gradient-to-r from-purple-500/20 to-pink-500/20 
              border border-purple-400/30 
              hover:from-purple-500/30 hover:to-pink-500/30 
              transition-all
              ${className}
            `}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-white">
              {/* Simplified to only show EVM address */}
              {isEvmConnected 
                ? formatEVMAddress(evmAddress)
                : 'Connected'
              }
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-white/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
            />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-72 bg-gray-900 border border-white/10 rounded-xl shadow-xl p-2 z-50"
              >
                {/* EVM/Base Wallet Section - Primary wallet connection */}
                {isEvmConnected && (
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs text-white/50 uppercase mb-1 flex items-center gap-2">
                      Base Network
                      <Gift className="w-3 h-3 text-amber-400" />
                    </p>
                    <p className="text-sm text-white font-mono truncate mb-2">{evmAddress}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(evmAddress, 'evm')}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/70"
                      >
                        {copied === 'evm' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied === 'evm' ? 'Copied' : 'Copy'}
                      </button>
                      <a
                        href={getExplorerUrl(evmAddress, 'evm')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/70"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Explorer
                      </a>
                      <button
                        onClick={async () => {
                          await disconnectEVM();
                          setShowDropdown(false);
                        }}
                        aria-label="Disconnect Base wallet"
                        className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs text-red-400"
                      >
                        <LogOut className="w-3 h-3" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
                
                {/* DISABLED: Algorand Wallet Section - removed as part of UI simplification
                {isAlgoConnected && (
                  <div className={`p-3 ${isEvmConnected ? '' : 'border-b border-white/10'}`}>
                    <p className="text-xs text-white/50 uppercase mb-1">Algorand Network</p>
                    <p className="text-sm text-white font-mono truncate mb-2">{algoAddress}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(algoAddress, 'algo')}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/70"
                      >
                        {copied === 'algo' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied === 'algo' ? 'Copied' : 'Copy'}
                      </button>
                      <a
                        href={getExplorerUrl(algoAddress, 'algo')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/70"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Explorer
                      </a>
                      <button
                        onClick={async () => {
                          await disconnectAlgorand();
                          if (!isEvmConnected) setShowDropdown(false);
                        }}
                        aria-label="Disconnect Algorand wallet"
                        className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs text-red-400"
                      >
                        <LogOut className="w-3 h-3" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
                */}
                
                {/* Manage Wallet - simplified for single wallet */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white"
                  >
                    <Wallet className="w-4 h-4" />
                    Manage Wallet
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <WalletModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </>
    );
  }

  // Disconnected state - show connect button
  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className={`
          flex items-center gap-2 
          bg-gradient-to-r from-purple-600 to-pink-600 
          hover:from-purple-700 hover:to-pink-700 
          text-white px-4 py-2 rounded-xl
          ${className}
        `}
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </Button>
      
      <WalletModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}

ConnectWalletButton.propTypes = {
  className: PropTypes.string,
};
