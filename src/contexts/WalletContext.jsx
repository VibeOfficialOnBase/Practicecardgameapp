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

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Disconnect handler
  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
    setWalletType(null);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
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
      }
    }
  }, []);

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

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (walletType === 'pera') {
        await peraWallet.disconnect();
      } else if (walletType === 'defly') {
        await deflyWallet.disconnect();
      }
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
    connectPera,
    connectDefly,
    disconnectWallet,
    getShortAddress,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
