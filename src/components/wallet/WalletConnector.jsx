/**
 * Base Network Wallet Connection Utility
 * Supports: MetaMask, Coinbase Wallet, and other injected providers
 * Auto-switches to Base Mainnet (Chain ID: 8453)
 */

const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_ID_HEX = '0x2105';

const BASE_NETWORK_CONFIG = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org']
};

export class WalletConnector {
  constructor() {
    this.provider = null;
    this.address = null;
  }

  /**
   * Detect available wallet providers
   */
  detectProviders() {
    const providers = [];
    
    // Check for Coinbase Wallet
    if (window.ethereum?.isCoinbaseWallet) {
      providers.push({ name: 'Coinbase Wallet', provider: window.ethereum });
    }
    
    // Check for MetaMask
    if (window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet) {
      providers.push({ name: 'MetaMask', provider: window.ethereum });
    }
    
    // Generic injected provider
    if (window.ethereum && providers.length === 0) {
      providers.push({ name: 'Web3 Wallet', provider: window.ethereum });
    }

    return providers;
  }

  /**
   * Main connection method
   */
  async connect() {
    try {
      const providers = this.detectProviders();

      if (providers.length === 0) {
        throw this.getInstallWalletError();
      }

      // Use the first available provider
      this.provider = providers[0].provider;

      // Request account access
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      this.address = accounts[0];

      // Ensure we're on Base network
      await this.switchToBase();

      return {
        address: this.address,
        provider: this.provider,
        chainId: BASE_CHAIN_ID
      };
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Connection request rejected. Please approve the wallet connection.');
      }
      throw error;
    }
  }

  /**
   * Switch to Base Mainnet
   */
  async switchToBase() {
    try {
      // Check current chain
      const chainId = await this.provider.request({ method: 'eth_chainId' });
      
      if (chainId === BASE_CHAIN_ID_HEX) {
        return; // Already on Base
      }

      // Try to switch to Base
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID_HEX }]
      });
    } catch (switchError) {
      // Network not added to wallet
      if (switchError.code === 4902) {
        try {
          await this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_NETWORK_CONFIG]
          });
        } catch (addError) {
          throw new Error('Failed to add Base network. Please add it manually in your wallet settings.');
        }
      } else if (switchError.code === 4001) {
        throw new Error('Network switch rejected. Please switch to Base network manually.');
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Get current network info
   */
  async getNetwork() {
    if (!this.provider) {
      throw new Error('No provider connected');
    }

    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return {
      chainId: parseInt(chainId, 16),
      isBase: chainId === BASE_CHAIN_ID_HEX
    };
  }

  /**
   * Read token balance
   * @param {string} tokenAddress - ERC20 token contract address
   * @param {string} walletAddress - Wallet to check balance for
   */
  async getTokenBalance(tokenAddress, walletAddress) {
    if (!this.provider) {
      throw new Error('No provider connected');
    }

    // ERC20 balanceOf function signature
    const balanceOfSignature = '0x70a08231';
    const paddedAddress = walletAddress.slice(2).padStart(64, '0');
    const data = balanceOfSignature + paddedAddress;

    try {
      const balance = await this.provider.request({
        method: 'eth_call',
        params: [{
          to: tokenAddress,
          data: data
        }, 'latest']
      });

      // Convert hex to decimal (wei)
      return parseInt(balance, 16);
    } catch (error) {
      console.error('Failed to read token balance:', error);
      throw new Error('Could not read token balance');
    }
  }

  /**
   * Sign a message
   */
  async signMessage(message) {
    if (!this.provider || !this.address) {
      throw new Error('Wallet not connected');
    }

    return await this.provider.request({
      method: 'personal_sign',
      params: [message, this.address]
    });
  }

  /**
   * Listen for account changes
   */
  onAccountsChanged(callback) {
    if (this.provider) {
      this.provider.on('accountsChanged', (accounts) => {
        this.address = accounts[0] || null;
        callback(accounts[0] || null);
      });
    }
  }

  /**
   * Listen for chain changes
   */
  onChainChanged(callback) {
    if (this.provider) {
      this.provider.on('chainChanged', (chainId) => {
        callback(parseInt(chainId, 16));
      });
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.provider = null;
    this.address = null;
  }

  /**
   * Get helpful error message for missing wallet
   */
  getInstallWalletError() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      return new Error(
        'No compatible wallet detected. Please:\n\n' +
        '1. Open this page in Coinbase Wallet or MetaMask mobile app\n' +
        '2. Or install a Base-compatible wallet from your app store\n\n' +
        'Recommended: Coinbase Wallet (native Base support)'
      );
    } else {
      return new Error(
        'No compatible wallet detected. Please install:\n\n' +
        '• Coinbase Wallet (recommended for Base)\n' +
        '• MetaMask\n\n' +
        'Then refresh this page.'
      );
    }
  }
}

export const walletConnector = new WalletConnector();