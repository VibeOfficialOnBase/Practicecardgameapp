import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';

const WalletContext = createContext({});

export const useWallet = () => useContext(WalletContext);

// Initialize wallet connectors
const peraWallet = new PeraWalletConnect({
  shouldShowSignTxnToast: true,
});

const deflyWallet = new DeflyWalletConnect({
  shouldShowSignTxnToast: true,
});

// $VibeOfficial token contract on Base (placeholder - update with real contract)
const VIBE_OFFICIAL_CONTRACT = '0x...'; // TODO: Add real contract address

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isVibeHolder, setIsVibeHolder] = useState(false);
  const [vibeBalance, setVibeBalance] = useState(0);

  // Disconnect handler
  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
    setWalletType(null);
    setIsVibeHolder(false);
    setVibeBalance(0);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
  }, []);

  // Check $VibeOfficial holdings on Base
  const checkVibeHoldings = useCallback(async (address) => {
    if (!address) return;
    
    try {
      // For now, we'll use a placeholder check
      // In production, this would call a Base RPC or API to check token balance
      // const balance = await checkTokenBalance(address, VIBE_OFFICIAL_CONTRACT);
      // setVibeBalance(balance);
      // setIsVibeHolder(balance > 0);
      
      // Mock check - always set to false for now
      setVibeBalance(0);
      setIsVibeHolder(false);
    } catch (err) {
      console.error('Failed to check Vibe holdings:', err);
    }
  }, []);

  // Setup disconnect listeners
  useEffect(() => {
    peraWallet.connector?.on('disconnect', handleDisconnect);
    deflyWallet.connector?.on('disconnect', handleDisconnect);

    return () => {
      peraWallet.connector?.off('disconnect', handleDisconnect);
      deflyWallet.connector?.off('disconnect', handleDisconnect);
    };
  }, [handleDisconnect]);

  // Reconnect on page load
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const savedType = localStorage.getItem('walletType');

    if (savedAddress && savedType) {
      setWalletAddress(savedAddress);
      setWalletType(savedType);

      // Try to reconnect the session
      if (savedType === 'pera') {
        peraWallet.reconnectSession().catch(console.error);
      } else if (savedType === 'defly') {
        deflyWallet.reconnectSession().catch(console.error);
      } else if (savedType === 'base') {
        // Check Vibe holdings for Base wallet
        checkVibeHoldings(savedAddress);
      }
    }
  }, [checkVibeHoldings]);

  // Connect to Pera Wallet
  const connectPera = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await peraWallet.connect();
      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setWalletType('pera');
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletType', 'pera');
        return address;
      }
    } catch (err) {
      console.error('Pera wallet connection error:', err);
      if (err?.data?.type !== 'CONNECT_MODAL_CLOSED') {
        setError(err.message || 'Failed to connect Pera Wallet');
      }
    } finally {
      setIsConnecting(false);
    }
    return null;
  };

  // Connect to Defly Wallet
  const connectDefly = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await deflyWallet.connect();
      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setWalletType('defly');
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletType', 'defly');
        return address;
      }
    } catch (err) {
      console.error('Defly wallet connection error:', err);
      if (err?.data?.type !== 'CONNECT_MODAL_CLOSED') {
        setError(err.message || 'Failed to connect Defly Wallet');
      }
    } finally {
      setIsConnecting(false);
    }
    return null;
  };

  // Connect to Base wallet (MetaMask or similar)
  const connectBase = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Check if ethereum provider is available (MetaMask, etc.)
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or another Web3 wallet to connect to Base');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Switch to Base network (chainId: 8453)
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }], // 8453 in hex
          });
        } catch (switchError) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              }],
            });
          }
        }

        setWalletAddress(address);
        setWalletType('base');
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletType', 'base');
        
        // Check for $VibeOfficial holdings
        await checkVibeHoldings(address);
        
        return address;
      }
    } catch (err) {
      console.error('Base wallet connection error:', err);
      setError(err.message || 'Failed to connect Base Wallet');
    } finally {
      setIsConnecting(false);
    }
    return null;
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (walletType === 'pera') {
        await peraWallet.disconnect();
      } else if (walletType === 'defly') {
        await deflyWallet.disconnect();
      }
      // Base wallets don't have a disconnect method, just clear state
    } catch (err) {
      console.error('Wallet disconnect error:', err);
    }
    handleDisconnect();
  };

  // Get short address for display
  const getShortAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const value = {
    walletAddress,
    walletType,
    isConnecting,
    error,
    isConnected: !!walletAddress,
    isVibeHolder,
    vibeBalance,
    connectPera,
    connectDefly,
    connectBase,
    disconnectWallet,
    getShortAddress,
    checkVibeHoldings,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
