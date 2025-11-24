import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle2, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const VIBE_TOKEN_ADDRESS = '0xa57b7d6fe91c26c5dcc3c7f7f26ba897c4fe6a3e';
const MIN_VIBE_BALANCE = 5000;

export default function BaseWalletConnect({ onConnect }) {
  const [connecting, setConnecting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask or another Web3 wallet to connect.');
        setConnecting(false);
        return;
      }

      // Switch to Base network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // Base mainnet
        });
      } catch (switchError) {
        // Chain not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }]
          });
        }
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const address = accounts[0];
      setConnectedAddress(address);

      await verifyHoldings(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const verifyHoldings = async (address) => {
    setVerifying(true);
    try {
      const user = await base44.auth.me();
      const response = await base44.functions.invoke('verifyVibeOfficialHoldings', {
        walletAddress: address
      });

      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      const profileData = {
        base_wallet_address: address,
        vibe_official_pack_unlocked: response.data.qualified
      };
      
      if (profiles.length > 0) {
        await base44.entities.UserProfile.update(profiles[0].id, profileData);
      } else {
        await base44.entities.UserProfile.create(profileData);
      }

      setVerificationStatus(response.data);
      if (onConnect) {
        onConnect(address);
      }
    } catch (error) {
      console.error('Failed to verify holdings:', error);
      alert('Failed to verify token holdings. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {!connectedAddress ? (
        <Button
          onClick={connectWallet}
          disabled={connecting}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {connecting ? 'Connecting...' : 'Connect Base Wallet'}
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-label mb-1">Connected Wallet</p>
            <p className="font-mono text-sm ensure-readable break-all">
              {connectedAddress}
            </p>
          </div>

          {verifying && (
            <p className="text-sm text-center ensure-readable">
              Verifying token holdings...
            </p>
          )}

          {verificationStatus && (
            <div className={`flex items-center gap-3 p-4 rounded-xl ${
              verificationStatus.qualified 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              {verificationStatus.qualified ? (
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold ensure-readable">
                  {verificationStatus.qualified ? '✔ Verified!' : '✘ Not Verified'}
                </p>
                <p className="text-sm text-label">
                  Balance: {verificationStatus.balance?.toLocaleString()} / {verificationStatus.minRequired?.toLocaleString()} $VIBE
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={() => verifyHoldings(connectedAddress)}
            disabled={verifying}
            variant="outline"
            className="w-full"
          >
            Re-verify Holdings
          </Button>
        </motion.div>
      )}
    </div>
  );
}