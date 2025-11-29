/**
 * WalletConnect v2 Sign Client Wrapper for EVM/Base
 * 
 * This module provides a clean interface for connecting to EVM wallets
 * (specifically targeting Base network) using WalletConnect v2 Sign Client.
 * It handles connection via QR code scanning and Coinbase Wallet deep linking.
 * 
 * @module web3/walletConnectEVM
 */

import SignClient from '@walletconnect/sign-client';

// Singleton instance of SignClient
let signClientInstance = null;

// Current session reference
let currentSession = null;

// Event callbacks
let disconnectCallback = null;

// Base network chain configuration
const BASE_CHAIN = {
  chainId: 8453,
  chainIdHex: '0x2105',
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  explorerUrl: 'https://basescan.org',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

// WalletConnect v2 required namespaces for EVM
const EVM_NAMESPACES = {
  eip155: {
    chains: [`eip155:${BASE_CHAIN.chainId}`],
    methods: [
      'eth_sendTransaction',
      'eth_signTransaction',
      'eth_sign',
      'personal_sign',
      'eth_signTypedData',
    ],
    events: ['chainChanged', 'accountsChanged'],
  },
};

/**
 * Get the WalletConnect v2 Project ID from environment
 * @returns {string} The project ID
 * @throws {Error} If project ID is not configured
 */
function getProjectId() {
  // Try Vite environment variable format
  const projectId = import.meta.env.VITE_WC_PROJECT_ID;
  
  if (!projectId) {
    console.warn(
      'WalletConnect v2 Project ID not found. ' +
      'Please set VITE_WC_PROJECT_ID in your .env file. ' +
      'Get a project ID from https://cloud.walletconnect.com'
    );
    // Return a placeholder that will cause WC to fail gracefully
    return 'demo-project-id-not-configured';
  }
  
  return projectId;
}

/**
 * Initialize the WalletConnect SignClient
 * @returns {Promise<SignClient>} The initialized SignClient instance
 */
async function initSignClient() {
  if (signClientInstance) {
    return signClientInstance;
  }
  
  try {
    signClientInstance = await SignClient.init({
      projectId: getProjectId(),
      metadata: {
        name: 'Practice Card Game',
        description: 'A mindfulness practice app with Web3 integration',
        url: window.location.origin,
        icons: [`${window.location.origin}/vibe-logo.png`],
      },
    });
    
    // Setup event listeners
    signClientInstance.on('session_delete', () => {
      console.log('WalletConnect session deleted');
      currentSession = null;
      if (disconnectCallback) {
        disconnectCallback();
      }
    });
    
    signClientInstance.on('session_expire', () => {
      console.log('WalletConnect session expired');
      currentSession = null;
      if (disconnectCallback) {
        disconnectCallback();
      }
    });
    
    return signClientInstance;
  } catch (error) {
    console.error('Failed to initialize WalletConnect SignClient:', error);
    throw new Error('Failed to initialize wallet connection. Please try again.');
  }
}

/**
 * Get the SignClient instance, initializing if needed
 * @returns {Promise<SignClient>} The SignClient instance
 */
export async function getSignClient() {
  if (!signClientInstance) {
    return initSignClient();
  }
  return signClientInstance;
}

/**
 * Connect to an EVM wallet using WalletConnect v2
 * Returns the URI for QR code display and waits for approval
 * 
 * @param {Object} options - Connection options
 * @param {Function} options.onUri - Callback when URI is available (for QR display)
 * @returns {Promise<{address: string, chainId: number}>} Connected wallet info
 * @throws {Error} If connection fails or is rejected
 */
export async function connectEVMWallet({ onUri }) {
  const client = await getSignClient();
  
  try {
    // Create connection proposal
    const { uri, approval } = await client.connect({
      requiredNamespaces: EVM_NAMESPACES,
    });
    
    // Provide URI to caller for QR code display
    if (uri && onUri) {
      onUri(uri);
    }
    
    // Wait for user to approve connection in their wallet
    const session = await approval();
    currentSession = session;
    
    // Extract account from session
    const accounts = session.namespaces.eip155?.accounts || [];
    if (accounts.length === 0) {
      throw new Error('No accounts found in wallet');
    }
    
    // Parse account string (format: "eip155:chainId:address")
    const [, chainIdStr, address] = accounts[0].split(':');
    const chainId = parseInt(chainIdStr, 10);
    
    return {
      address,
      chainId,
      session,
    };
  } catch (error) {
    // Check for user rejection
    if (error?.message?.includes('rejected') || error?.code === 5000) {
      throw new Error('Connection rejected by user');
    }
    
    throw new Error(
      error.message || 'Failed to connect wallet. Please try again.'
    );
  }
}

/**
 * Disconnect from the current EVM wallet session
 * 
 * @returns {Promise<void>}
 */
export async function disconnectEVMWallet() {
  if (!signClientInstance || !currentSession) {
    currentSession = null;
    return;
  }
  
  try {
    await signClientInstance.disconnect({
      topic: currentSession.topic,
      reason: {
        code: 6000,
        message: 'User disconnected',
      },
    });
  } catch (error) {
    console.warn('Error disconnecting WalletConnect session:', error);
  } finally {
    currentSession = null;
  }
}

/**
 * Check for and restore existing WalletConnect sessions
 * Call this on app load to restore a previous connection
 * 
 * @returns {Promise<{address: string, chainId: number} | null>}
 *          Connected wallet info or null if no valid session exists
 */
export async function restoreEVMSession() {
  const client = await getSignClient();
  
  // Get all active sessions
  const sessions = client.session.getAll();
  
  if (!sessions || sessions.length === 0) {
    return null;
  }
  
  // Find a session that includes our chain
  const validSession = sessions.find((session) => {
    const chains = session.namespaces.eip155?.chains || [];
    return chains.includes(`eip155:${BASE_CHAIN.chainId}`);
  });
  
  if (!validSession) {
    return null;
  }
  
  currentSession = validSession;
  
  // Extract account info
  const accounts = validSession.namespaces.eip155?.accounts || [];
  if (accounts.length === 0) {
    return null;
  }
  
  const [, chainIdStr, address] = accounts[0].split(':');
  const chainId = parseInt(chainIdStr, 10);
  
  return {
    address,
    chainId,
    session: validSession,
  };
}

/**
 * Register a disconnect event handler
 * Called when the wallet session is disconnected or expires
 * 
 * @param {Function} callback - Function to call on disconnect
 * @returns {Function} Cleanup function to remove the listener
 */
export function onEVMDisconnect(callback) {
  disconnectCallback = callback;
  
  // Return cleanup function
  return () => {
    disconnectCallback = null;
  };
}

/**
 * Generate a Coinbase Wallet deep link URI
 * Used for mobile "Open in Coinbase Wallet" button
 * 
 * @param {string} wcUri - The WalletConnect pairing URI
 * @returns {string} The Coinbase Wallet deep link URL
 */
export function getCoinbaseDeepLink(wcUri) {
  const encodedUri = encodeURIComponent(wcUri);
  return `https://go.cb-w.com/wc?uri=${encodedUri}`;
}

/**
 * Format an EVM address for display
 * Returns a shortened version like "0x1234...5678"
 * 
 * @param {string} address - Full EVM address
 * @returns {string} Shortened address for display
 */
export function formatEVMAddress(address) {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if currently connected to an EVM wallet
 * 
 * @returns {boolean} True if connected
 */
export function isEVMConnected() {
  return currentSession !== null;
}

/**
 * Get the Base network chain configuration
 * 
 * @returns {Object} Chain configuration object
 */
export function getBaseChainConfig() {
  return { ...BASE_CHAIN };
}

/**
 * Get the explorer URL for an address on Base
 * 
 * @param {string} address - The address to look up
 * @returns {string} The explorer URL
 */
export function getBaseExplorerUrl(address) {
  return `${BASE_CHAIN.explorerUrl}/address/${address}`;
}
