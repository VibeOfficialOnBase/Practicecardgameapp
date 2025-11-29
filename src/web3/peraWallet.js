/**
 * Pera Wallet Connect v2 Wrapper
 * 
 * This module provides a clean interface for connecting to Algorand wallets
 * using Pera Wallet Connect. It handles connection, disconnection, session
 * reconnection, and provides hooks for QR code display and deep linking.
 * 
 * @module web3/peraWallet
 */

import { PeraWalletConnect } from '@perawallet/connect';

// Singleton instance of PeraWalletConnect
let peraWalletInstance = null;

/**
 * Configuration for Pera Wallet Connect
 */
const PERA_CONFIG = {
  // Algorand MainNet chain ID
  chainId: 4160,
  // Show transaction signing toast notifications
  shouldShowSignTxnToast: true,
};

/**
 * Get or create the Pera Wallet Connect instance
 * @returns {PeraWalletConnect} The Pera Wallet Connect instance
 */
export function getPeraWallet() {
  if (!peraWalletInstance) {
    peraWalletInstance = new PeraWalletConnect(PERA_CONFIG);
  }
  return peraWalletInstance;
}

/**
 * Connect to Pera Wallet
 * Opens the Pera Wallet connect modal (QR code on desktop, deep link on mobile)
 * 
 * @returns {Promise<{address: string, accounts: string[]}>} Connected wallet info
 * @throws {Error} If connection fails or is cancelled
 */
export async function connectPeraWallet() {
  const peraWallet = getPeraWallet();
  
  try {
    const accounts = await peraWallet.connect();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from Pera Wallet');
    }
    
    return {
      address: accounts[0],
      accounts,
    };
  } catch (error) {
    // Check if user closed the modal
    if (error?.data?.type === 'CONNECT_MODAL_CLOSED') {
      throw new Error('Connection cancelled by user');
    }
    
    // Re-throw with a more descriptive message
    throw new Error(
      error.message || 'Failed to connect to Pera Wallet. Please try again.'
    );
  }
}

/**
 * Disconnect from Pera Wallet
 * Clears the current session and resets the wallet state
 * 
 * @returns {Promise<void>}
 */
export async function disconnectPeraWallet() {
  const peraWallet = getPeraWallet();
  
  try {
    await peraWallet.disconnect();
  } catch (error) {
    console.warn('Error disconnecting Pera Wallet:', error);
    // Non-fatal - we'll clear state anyway
  }
}

/**
 * Reconnect to an existing Pera Wallet session
 * Call this on app load to restore a previous connection
 * 
 * @returns {Promise<{address: string, accounts: string[]} | null>} 
 *          Connected wallet info or null if no session exists
 */
export async function reconnectPeraSession() {
  const peraWallet = getPeraWallet();
  
  try {
    const accounts = await peraWallet.reconnectSession();
    
    if (accounts && accounts.length > 0) {
      return {
        address: accounts[0],
        accounts,
      };
    }
    
    return null;
  } catch {
    // Session reconnection failed - this is expected if no session exists
    console.log('No existing Pera session to reconnect');
    return null;
  }
}

/**
 * Register a disconnect event handler
 * Called when the wallet is disconnected (either by user or remotely)
 * 
 * @param {Function} callback - Function to call on disconnect
 * @returns {Function} Cleanup function to remove the listener
 */
export function onPeraDisconnect(callback) {
  const peraWallet = getPeraWallet();
  
  const handler = () => {
    callback();
  };
  
  peraWallet.connector?.on('disconnect', handler);
  
  // Return cleanup function
  return () => {
    peraWallet.connector?.off('disconnect', handler);
  };
}

/**
 * Check if Pera Wallet is connected
 * 
 * @returns {boolean} True if connected
 */
export function isPeraConnected() {
  const peraWallet = getPeraWallet();
  return peraWallet.isConnected;
}

/**
 * Format an Algorand address for display
 * Returns a shortened version like "ALGO...XYZ5"
 * 
 * @param {string} address - Full Algorand address
 * @returns {string} Shortened address for display
 */
export function formatAlgoAddress(address) {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
