/**
 * Wallet Modal Component
 * 
 * A full-screen centered modal for connecting Algorand (Pera) and 
 * EVM/Base (WalletConnect v2) wallets. Features QR code display,
 * mobile deep linking, and responsive design.
 * 
 * @module components/wallet/WalletModal
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';
import { 
  Wallet, 
  X, 
  ArrowLeft, 
  AlertCircle, 
  ExternalLink,
  Smartphone 
} from 'lucide-react';
import { useWallet } from '@/web3/WalletContext';
import './walletModal.css';

/**
 * Detects if the user is on a mobile device
 * @returns {boolean} True if on mobile
 */
function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
    algoAddress,
    isAlgoConnected,
    isAlgoConnecting,
    algoError,
    evmAddress,
    isEvmConnected,
    isEvmConnecting,
    evmError,
    wcUri,
    
    // Actions
    connectAlgorand,
    disconnectAlgorand,
    connectEVM,
    disconnectEVM,
    clearErrors,
    
    // Utilities
    formatAlgoAddress,
    formatEVMAddress,
    getCoinbaseDeepLink,
  } = useWallet();
  
  // View state: 'select' | 'algo' | 'evm'
  const [view, setView] = useState('select');
  
  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('select');
      clearErrors();
    }
  }, [isOpen, clearErrors]);

  /**
   * Handle Algorand wallet connection
   */
  const handleConnectAlgo = useCallback(async () => {
    setView('algo');
    try {
      await connectAlgorand();
      // Success - close modal after brief delay
      setTimeout(() => onClose(), 500);
    } catch (error) {
      // Error is already set in context
      console.log('Algorand connection error:', error.message);
    }
  }, [connectAlgorand, onClose]);

  /**
   * Handle EVM wallet connection
   */
  const handleConnectEVM = useCallback(async () => {
    setView('evm');
    try {
      await connectEVM();
      // Success - close modal after brief delay
      setTimeout(() => onClose(), 500);
    } catch (error) {
      // Error is already set in context
      console.log('EVM connection error:', error.message);
    }
  }, [connectEVM, onClose]);

  /**
   * Handle disconnect and return to selection
   */
  const handleDisconnectAlgo = useCallback(async () => {
    await disconnectAlgorand();
    setView('select');
  }, [disconnectAlgorand]);

  const handleDisconnectEVM = useCallback(async () => {
    await disconnectEVM();
    setView('select');
  }, [disconnectEVM]);

  /**
   * Retry connection after error
   */
  const handleRetry = useCallback(() => {
    clearErrors();
    if (view === 'algo') {
      handleConnectAlgo();
    } else if (view === 'evm') {
      handleConnectEVM();
    }
  }, [view, clearErrors, handleConnectAlgo, handleConnectEVM]);

  /**
   * Go back to selection view
   */
  const handleBack = useCallback(() => {
    clearErrors();
    setView('select');
  }, [clearErrors]);

  // Render wallet selection view
  const renderSelectView = () => (
    <>
      {/* Connected Wallets Status */}
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
      
      {/* EVM/Base Section */}
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
      
      {/* Algorand Section */}
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

  // Render EVM connection view
  const renderEVMView = () => (
    <>
      <button className="wallet-back-btn" onClick={handleBack}>
        <ArrowLeft size={16} />
        <span>Back to wallets</span>
      </button>
      
      {evmError ? (
        <div className="wallet-error">
          <AlertCircle className="wallet-error-icon" size={20} />
          <div className="wallet-error-content">
            <p className="wallet-error-message">{evmError}</p>
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
      ) : isEvmConnected ? (
        <div className="wallet-connected">
          <div className="wallet-connected-dot" />
          <div className="wallet-connected-info">
            <p className="wallet-connected-label">Successfully Connected</p>
            <p className="wallet-connected-address">{formatEVMAddress(evmAddress)}</p>
          </div>
        </div>
      ) : wcUri ? (
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
        <div className="wallet-loading">
          <div className="wallet-loading-spinner" />
          <p className="wallet-loading-text">
            Initializing connection...
          </p>
        </div>
      ) : null}
    </>
  );

  // Render current view content
  const renderContent = () => {
    switch (view) {
      case 'algo':
        return renderAlgoView();
      case 'evm':
        return renderEVMView();
      default:
        return renderSelectView();
    }
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
                {view === 'select' 
                  ? 'Choose your wallet to connect and unlock features'
                  : view === 'algo'
                  ? 'Connect your Algorand wallet using Pera'
                  : 'Scan the QR code or use the deep link'
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
                {view === 'select' ? 'Close' : 'Cancel'}
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
