/**
 * Wallet Modal Component
 * 
 * A full-screen centered modal for connecting EVM/Base (WalletConnect v2) wallets.
 * Features QR code display, mobile deep linking, and responsive design.
 * 
 * NOTE: Algorand wallet support has been commented out as part of UI simplification.
 * The UI now presents a single, streamlined wallet connection option for initial use.
 * To re-enable Algorand support, uncomment the relevant sections marked with
 * "DISABLED: Algorand wallet support" comments.
 * 
 * @module components/wallet/WalletModal
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';
import { 
  Wallet, 
  X, 
  // ArrowLeft removed - back button disabled in simplified UI
  AlertCircle, 
  ExternalLink,
  Smartphone 
} from 'lucide-react';
import { useWallet } from '@/web3/WalletContext';
import './walletModal.css';

/**
 * Detects if the user is on a mobile/touch device
 * Uses feature detection rather than user agent string
 * @returns {boolean} True if on mobile/touch device
 */
function isMobile() {
  // Use multiple detection methods for reliability
  return (
    navigator.maxTouchPoints > 0 ||
    'ontouchstart' in window ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}

/**
 * WalletModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close
 */
export default function WalletModal({ isOpen, onClose }) {
  const {
    // State
    /* DISABLED: Algorand wallet support - uncomment to re-enable
    algoAddress,
    isAlgoConnected,
    isAlgoConnecting,
    algoError,
    */
    evmAddress,
    isEvmConnected,
    isEvmConnecting,
    evmError,
    wcUri,
    
    // Actions
    /* DISABLED: Algorand wallet support - uncomment to re-enable
    connectAlgorand,
    disconnectAlgorand,
    */
    connectEVM,
    disconnectEVM,
    clearErrors,
    
    // Utilities
    /* DISABLED: Algorand wallet support - uncomment to re-enable
    formatAlgoAddress,
    */
    formatEVMAddress,
    getCoinbaseDeepLink,
  } = useWallet();
  
  // View state: 'evm' for EVM connection view
  // NOTE: Previously supported 'select' | 'algo' | 'evm' for multiple wallet options
  // Simplified to directly show EVM connection
  const [view, setView] = useState('evm');
  
  // Reset view when modal opens - now defaults directly to EVM
  useEffect(() => {
    if (isOpen) {
      setView('evm');
      clearErrors();
    }
  }, [isOpen, clearErrors]);

  // Track close timer for cleanup
  const closeTimerRef = useRef(null);
  
  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  /* DISABLED: Algorand wallet support - uncomment to re-enable
   * Handle Algorand wallet connection
   *
  const handleConnectAlgo = useCallback(async () => {
    setView('algo');
    try {
      await connectAlgorand();
      // Success - close modal after brief delay for user feedback
      closeTimerRef.current = setTimeout(() => onClose(), 500);
    } catch (error) {
      // Error is already set in context
      console.log('Algorand connection error:', error.message);
    }
  }, [connectAlgorand, onClose]);
  */

  /**
   * Handle EVM wallet connection
   * Initiates connection immediately when modal opens
   */
  const handleConnectEVM = useCallback(async () => {
    setView('evm');
    try {
      await connectEVM();
      // Success - close modal after brief delay for user feedback
      closeTimerRef.current = setTimeout(() => onClose(), 500);
    } catch (error) {
      // Error is already set in context
      console.log('EVM connection error:', error.message);
    }
  }, [connectEVM, onClose]);

  /* DISABLED: Algorand wallet support - uncomment to re-enable
   * Handle disconnect and return to selection
   *
  const handleDisconnectAlgo = useCallback(async () => {
    await disconnectAlgorand();
    setView('select');
  }, [disconnectAlgorand]);
  */

  const handleDisconnectEVM = useCallback(async () => {
    await disconnectEVM();
  }, [disconnectEVM]);

  /**
   * Retry connection after error
   */
  const handleRetry = useCallback(() => {
    clearErrors();
    // Only EVM connection is supported in simplified UI
    handleConnectEVM();
  }, [clearErrors, handleConnectEVM]);

  /* DISABLED: Back button navigation - no longer needed with single wallet option
   * Go back to selection view
   *
  const handleBack = useCallback(() => {
    clearErrors();
    setView('select');
  }, [clearErrors]);
  */

  /* DISABLED: Wallet selection view - removed as part of UI simplification
   * Previously showed options for both Algorand and EVM wallets
   *
  // Render wallet selection view
  const renderSelectView = () => (
    <>
      {isAlgoConnected && (
        <div className="wallet-connected">
          <div className="wallet-connected-dot" />
          <div className="wallet-connected-info">
            <p className="wallet-connected-label">Algorand Connected</p>
            <p className="wallet-connected-address">{formatAlgoAddress(algoAddress)}</p>
          </div>
          <button 
            className="wallet-disconnect-btn"
            onClick={handleDisconnectAlgo}
          >
            Disconnect
          </button>
        </div>
      )}
      
      {isEvmConnected && (
        <div className="wallet-connected">
          <div className="wallet-connected-dot" />
          <div className="wallet-connected-info">
            <p className="wallet-connected-label">Base Connected</p>
            <p className="wallet-connected-address">{formatEVMAddress(evmAddress)}</p>
          </div>
          <button 
            className="wallet-disconnect-btn"
            onClick={handleDisconnectEVM}
          >
            Disconnect
          </button>
        </div>
      )}
      
      <div className="wallet-section">
        <p className="wallet-section-label">Base Network</p>
        <button
          className="wallet-option"
          onClick={handleConnectEVM}
          disabled={isEvmConnecting || isEvmConnected}
        >
          <div className="wallet-option-icon evm">
            <img 
              src="/assets/vibe-logo.png" 
              alt="Base" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="wallet-option-info">
            <p className="wallet-option-name">
              {isEvmConnected ? 'Connected' : 'Base Wallet'}
            </p>
            <p className="wallet-option-desc">
              {isEvmConnected 
                ? formatEVMAddress(evmAddress)
                : 'WalletConnect v2 • Coinbase Wallet'
              }
            </p>
          </div>
        </button>
      </div>
      
      <div className="wallet-section">
        <p className="wallet-section-label">Algorand Network</p>
        <button
          className="wallet-option"
          onClick={handleConnectAlgo}
          disabled={isAlgoConnecting || isAlgoConnected}
        >
          <div className="wallet-option-icon algo">
            🟡
          </div>
          <div className="wallet-option-info">
            <p className="wallet-option-name">
              {isAlgoConnected ? 'Connected' : 'Pera Wallet'}
            </p>
            <p className="wallet-option-desc">
              {isAlgoConnected 
                ? formatAlgoAddress(algoAddress)
                : 'Scan QR or open on mobile'
              }
            </p>
          </div>
        </button>
      </div>
    </>
  );
  */

  /* DISABLED: Algorand connection view - removed as part of UI simplification
  // Render Algorand connection view
  const renderAlgoView = () => (
    <>
      <button className="wallet-back-btn" onClick={handleBack}>
        <ArrowLeft size={16} />
        <span>Back to wallets</span>
      </button>
      
      {algoError ? (
        <div className="wallet-error">
          <AlertCircle className="wallet-error-icon" size={20} />
          <div className="wallet-error-content">
            <p className="wallet-error-message">{algoError}</p>
            <div className="wallet-error-actions">
              <button className="wallet-error-btn retry" onClick={handleRetry}>
                Try Again
              </button>
              <button className="wallet-error-btn cancel" onClick={handleBack}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : isAlgoConnecting ? (
        <div className="wallet-loading">
          <div className="wallet-loading-spinner" />
          <p className="wallet-loading-text">
            Opening Pera Wallet...
          </p>
        </div>
      ) : isAlgoConnected ? (
        <div className="wallet-connected">
          <div className="wallet-connected-dot" />
          <div className="wallet-connected-info">
            <p className="wallet-connected-label">Successfully Connected</p>
            <p className="wallet-connected-address">{formatAlgoAddress(algoAddress)}</p>
          </div>
        </div>
      ) : null}
    </>
  );
  */

  // Render EVM connection view - this is now the primary/only wallet connection view
  const renderEVMView = () => (
    <>
      {/* Connected state - show wallet info with disconnect option */}
      {isEvmConnected ? (
        <div className="wallet-connected">
          <div className="wallet-connected-dot" />
          <div className="wallet-connected-info">
            <p className="wallet-connected-label">Successfully Connected</p>
            <p className="wallet-connected-address">{formatEVMAddress(evmAddress)}</p>
          </div>
          <button 
            className="wallet-disconnect-btn"
            onClick={handleDisconnectEVM}
          >
            Disconnect
          </button>
        </div>
      ) : evmError ? (
        /* Error state - show error with retry option */
        <div className="wallet-error">
          <AlertCircle className="wallet-error-icon" size={20} />
          <div className="wallet-error-content">
            <p className="wallet-error-message">{evmError}</p>
            <div className="wallet-error-actions">
              <button className="wallet-error-btn retry" onClick={handleRetry}>
                Try Again
              </button>
              <button className="wallet-error-btn cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : wcUri ? (
        /* QR code display for wallet connection */
        <>
          <div className="wallet-qr-container">
            <div className="wallet-qr-wrapper">
              <QRCodeSVG 
                value={wcUri} 
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="wallet-qr-label">
              Scan with your wallet app
            </p>
          </div>
          
          {/* Mobile deep link buttons */}
          {isMobile() && (
            <a 
              href={getCoinbaseDeepLink(wcUri)}
              className="wallet-deep-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Smartphone size={18} />
              <span>Open in Coinbase Wallet</span>
              <ExternalLink size={14} />
            </a>
          )}
        </>
      ) : isEvmConnecting ? (
        /* Loading state during connection initialization */
        <div className="wallet-loading">
          <div className="wallet-loading-spinner" />
          <p className="wallet-loading-text">
            Initializing connection...
          </p>
        </div>
      ) : (
        /* Initial state - show connect button */
        <div className="wallet-section">
          <button
            className="wallet-option"
            onClick={handleConnectEVM}
          >
            <div className="wallet-option-icon evm">
              <img 
                src="/assets/vibe-logo.png" 
                alt="Base" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="wallet-option-info">
              <p className="wallet-option-name">Connect Base Wallet</p>
              <p className="wallet-option-desc">WalletConnect v2 • Coinbase Wallet</p>
            </div>
          </button>
        </div>
      )}
    </>
  );

  // Render current view content
  // Simplified to only render EVM view since we removed other wallet options
  const renderContent = () => {
    return renderEVMView();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="wallet-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="wallet-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="wallet-modal-header">
              <button 
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <X size={20} />
              </button>
              <h2 className="wallet-modal-title">
                <Wallet size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Connect Wallet
              </h2>
              <p className="wallet-modal-subtitle">
                {isEvmConnected 
                  ? 'Your wallet is connected'
                  : 'Scan the QR code or use your mobile wallet to connect'
                }
              </p>
            </div>
            
            {/* Content */}
            <div className="wallet-modal-content">
              {renderContent()}
            </div>
            
            {/* Footer */}
            <div className="wallet-modal-footer">
              <button 
                className="wallet-cancel-btn"
                onClick={onClose}
              >
                {isEvmConnected ? 'Done' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

WalletModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
