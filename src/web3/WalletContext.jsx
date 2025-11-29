/**
 * Wallet Context Provider
 * 
 * Provides wallet connection state and functions for both Algorand (Pera)
 * and EVM/Base (WalletConnect v2) wallets. Persists wallet addresses to
 * Supabase profiles table.
 * 
 * @module web3/WalletContext
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isDemoMode } from '@/api/supabaseClient';

// Pera Wallet functions
import {
  connectPeraWallet,
  disconnectPeraWallet,
  reconnectPeraSession,
  onPeraDisconnect,
  formatAlgoAddress,
} from './peraWallet';

// WalletConnect EVM functions
import {
  connectEVMWallet,
  disconnectEVMWallet,
  restoreEVMSession,
  onEVMDisconnect,
  getCoinbaseDeepLink,
  formatEVMAddress,
  getBaseExplorerUrl,
} from './walletConnectEVM';

// Create the context
const WalletContext = createContext({});

/**
 * Hook to access wallet context
 * @returns {Object} Wallet context value
 */
export const useWallet = () => useContext(WalletContext);

/**
 * Local storage keys for wallet persistence
 */
const STORAGE_KEYS = {
  ALGO_ADDRESS: 'wallet_algo_address',
  EVM_ADDRESS: 'wallet_evm_address',
};

/**
 * WalletProvider Component
 * Wraps the app to provide wallet connection functionality
 */
export const WalletProvider = ({ children }) => {
  // Auth context for user ID
  const { user } = useAuth();
  
  // Algorand wallet state
  const [algoAddress, setAlgoAddress] = useState(null);
  const [isAlgoConnecting, setIsAlgoConnecting] = useState(false);
  const [algoError, setAlgoError] = useState(null);
  
  // EVM wallet state
  const [evmAddress, setEvmAddress] = useState(null);
  const [isEvmConnecting, setIsEvmConnecting] = useState(false);
  const [evmError, setEvmError] = useState(null);
  const [wcUri, setWcUri] = useState(null);
  
  // Track if we're currently saving to prevent race conditions
  const isSaving = useRef(false);

  /**
   * Save wallet addresses to Supabase profiles table
   */
  const saveAddressesToSupabase = useCallback(async (algo, evm) => {
    if (!user?.id || isSaving.current) return;
    
    isSaving.current = true;
    
    try {
      if (isDemoMode) {
        // In demo mode, save to localStorage demo DB
        const demoDb = JSON.parse(localStorage.getItem('demo_db') || '{"data":{}}');
        if (!demoDb.data.profiles) demoDb.data.profiles = [];
        
        const existingIndex = demoDb.data.profiles.findIndex(p => p.id === user.id);
        const profile = {
          id: user.id,
          algo_address: algo || null,
          evm_address: evm || null,
          updated_at: new Date().toISOString(),
        };
        
        if (existingIndex >= 0) {
          demoDb.data.profiles[existingIndex] = {
            ...demoDb.data.profiles[existingIndex],
            ...profile,
          };
        } else {
          demoDb.data.profiles.push(profile);
        }
        
        localStorage.setItem('demo_db', JSON.stringify(demoDb));
        console.log('Demo mode: Wallet addresses saved to local storage');
        return;
      }
      
      // Upsert to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          algo_address: algo || null,
          evm_address: evm || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });
      
      if (error) {
        console.error('Failed to save wallet addresses to Supabase:', error);
      } else {
        console.log('Wallet addresses saved to Supabase');
      }
    } catch (err) {
      console.error('Error saving wallet addresses:', err);
    } finally {
      isSaving.current = false;
    }
  }, [user?.id]);

  /**
   * Load wallet addresses from Supabase on mount
   */
  const loadAddressesFromSupabase = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      if (isDemoMode) {
        // Load from localStorage in demo mode
        const demoDb = JSON.parse(localStorage.getItem('demo_db') || '{"data":{}}');
        const profile = demoDb.data.profiles?.find(p => p.id === user.id);
        if (profile) {
          if (profile.algo_address) {
            setAlgoAddress(profile.algo_address);
            localStorage.setItem(STORAGE_KEYS.ALGO_ADDRESS, profile.algo_address);
          }
          if (profile.evm_address) {
            setEvmAddress(profile.evm_address);
            localStorage.setItem(STORAGE_KEYS.EVM_ADDRESS, profile.evm_address);
          }
        }
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('algo_address, evm_address')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        if (data.algo_address) {
          setAlgoAddress(data.algo_address);
          localStorage.setItem(STORAGE_KEYS.ALGO_ADDRESS, data.algo_address);
        }
        if (data.evm_address) {
          setEvmAddress(data.evm_address);
          localStorage.setItem(STORAGE_KEYS.EVM_ADDRESS, data.evm_address);
        }
      }
    } catch (err) {
      console.error('Error loading wallet addresses:', err);
    }
  }, [user?.id]);

  /**
   * Connect to Algorand wallet using Pera
   */
  const connectAlgorand = useCallback(async () => {
    setIsAlgoConnecting(true);
    setAlgoError(null);
    
    try {
      const result = await connectPeraWallet();
      const address = result.address;
      
      setAlgoAddress(address);
      localStorage.setItem(STORAGE_KEYS.ALGO_ADDRESS, address);
      
      // Save to Supabase
      await saveAddressesToSupabase(address, evmAddress);
      
      return address;
    } catch (error) {
      const message = error.message || 'Failed to connect Algorand wallet';
      setAlgoError(message);
      throw error;
    } finally {
      setIsAlgoConnecting(false);
    }
  }, [evmAddress, saveAddressesToSupabase]);

  /**
   * Disconnect Algorand wallet
   */
  const disconnectAlgorand = useCallback(async () => {
    try {
      await disconnectPeraWallet();
    } catch (error) {
      console.warn('Error disconnecting Algorand wallet:', error);
    }
    
    setAlgoAddress(null);
    setAlgoError(null);
    localStorage.removeItem(STORAGE_KEYS.ALGO_ADDRESS);
    
    // Update Supabase
    await saveAddressesToSupabase(null, evmAddress);
  }, [evmAddress, saveAddressesToSupabase]);

  /**
   * Connect to EVM/Base wallet using WalletConnect v2
   * @param {Object} options - Connection options
   * @param {Function} options.onUri - Callback when URI is available for QR display
   */
  const connectEVM = useCallback(async ({ onUri } = {}) => {
    setIsEvmConnecting(true);
    setEvmError(null);
    setWcUri(null);
    
    try {
      const result = await connectEVMWallet({
        onUri: (uri) => {
          setWcUri(uri);
          if (onUri) onUri(uri);
        },
      });
      
      const address = result.address;
      
      setEvmAddress(address);
      setWcUri(null);
      localStorage.setItem(STORAGE_KEYS.EVM_ADDRESS, address);
      
      // Save to Supabase
      await saveAddressesToSupabase(algoAddress, address);
      
      return address;
    } catch (error) {
      const message = error.message || 'Failed to connect EVM wallet';
      setEvmError(message);
      setWcUri(null);
      throw error;
    } finally {
      setIsEvmConnecting(false);
    }
  }, [algoAddress, saveAddressesToSupabase]);

  /**
   * Disconnect EVM wallet
   */
  const disconnectEVM = useCallback(async () => {
    try {
      await disconnectEVMWallet();
    } catch (error) {
      console.warn('Error disconnecting EVM wallet:', error);
    }
    
    setEvmAddress(null);
    setEvmError(null);
    setWcUri(null);
    localStorage.removeItem(STORAGE_KEYS.EVM_ADDRESS);
    
    // Update Supabase
    await saveAddressesToSupabase(algoAddress, null);
  }, [algoAddress, saveAddressesToSupabase]);

  /**
   * Clear errors
   */
  const clearErrors = useCallback(() => {
    setAlgoError(null);
    setEvmError(null);
  }, []);

  /**
   * Restore sessions on mount
   */
  useEffect(() => {
    // Load from localStorage first for immediate display
    const storedAlgo = localStorage.getItem(STORAGE_KEYS.ALGO_ADDRESS);
    const storedEvm = localStorage.getItem(STORAGE_KEYS.EVM_ADDRESS);
    
    if (storedAlgo) setAlgoAddress(storedAlgo);
    if (storedEvm) setEvmAddress(storedEvm);
    
    // Try to restore actual wallet sessions
    const restoreSessions = async () => {
      try {
        // Restore Pera session
        const algoResult = await reconnectPeraSession();
        if (algoResult?.address) {
          setAlgoAddress(algoResult.address);
          localStorage.setItem(STORAGE_KEYS.ALGO_ADDRESS, algoResult.address);
        }
      } catch (error) {
        console.log('Could not restore Algorand session:', error);
      }
      
      try {
        // Restore WalletConnect session
        const evmResult = await restoreEVMSession();
        if (evmResult?.address) {
          setEvmAddress(evmResult.address);
          localStorage.setItem(STORAGE_KEYS.EVM_ADDRESS, evmResult.address);
        }
      } catch (error) {
        console.log('Could not restore EVM session:', error);
      }
    };
    
    restoreSessions();
  }, []);

  /**
   * Load addresses from Supabase when user changes
   */
  useEffect(() => {
    if (user?.id) {
      loadAddressesFromSupabase();
    }
  }, [user?.id, loadAddressesFromSupabase]);

  /**
   * Setup disconnect listeners
   */
  useEffect(() => {
    const cleanupAlgo = onPeraDisconnect(() => {
      setAlgoAddress(null);
      localStorage.removeItem(STORAGE_KEYS.ALGO_ADDRESS);
    });
    
    const cleanupEvm = onEVMDisconnect(() => {
      setEvmAddress(null);
      localStorage.removeItem(STORAGE_KEYS.EVM_ADDRESS);
    });
    
    return () => {
      cleanupAlgo();
      cleanupEvm();
    };
  }, []);

  // Context value
  const value = {
    // Algorand state
    algoAddress,
    isAlgoConnected: !!algoAddress,
    isAlgoConnecting,
    algoError,
    
    // EVM state
    evmAddress,
    isEvmConnected: !!evmAddress,
    isEvmConnecting,
    evmError,
    wcUri,
    
    // Convenience booleans
    isConnecting: isAlgoConnecting || isEvmConnecting,
    hasAnyWallet: !!algoAddress || !!evmAddress,
    
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
    getBaseExplorerUrl,
    
    // Legacy compatibility (for existing components)
    walletAddress: evmAddress || algoAddress,
    walletType: evmAddress ? 'base' : (algoAddress ? 'pera' : null),
    isConnected: !!algoAddress || !!evmAddress,
    error: algoError || evmError,
    disconnectWallet: async () => {
      await disconnectAlgorand();
      await disconnectEVM();
    },
    getShortAddress: (address) => {
      if (!address) return '';
      // Algorand addresses are 58 chars, EVM are 42 chars
      if (address.length > 50) {
        return formatAlgoAddress(address);
      }
      return formatEVMAddress(address);
    },
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WalletProvider;
