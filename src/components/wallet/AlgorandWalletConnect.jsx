import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle2, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const ALC_ASA_ID = 445905873;
const MIN_ALC_BALANCE = 10000;
const NFT_CREATOR = 'PZNGYF4Y25GGO674BW4CRDHFKOKHMHZXSFXIKMYPEJCQAUTDH52WV24XTY';
const VIP_ASA_ID = 449137537;

export default function AlgorandWalletConnect({ onConnect }) {
  const [connecting, setConnecting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const PeraWalletConnect = (await import('https://esm.sh/@perawallet/connect@1.3.4')).PeraWalletConnect;
      const peraWallet = new PeraWalletConnect({ chainId: 416001 });

      const accounts = await peraWallet.connect();
      const address = accounts[0];
      
      setConnectedAddress(address);
      await verifyHoldings(address);
    } catch (error) {
      console.error('Failed to connect Pera Wallet:', error);
      if (!error.message?.includes('cancelled') && !error.message?.includes('rejected')) {
        alert('Failed to connect Pera Wallet. Please make sure you have it installed or use the Pera Wallet mobile app.');
      }
    } finally {
      setConnecting(false);
    }
  };

  const verifyHoldings = async (address) => {
    setVerifying(true);
    try {
      const user = await base44.auth.me();
      const response = await base44.functions.invoke('verifyAlgoLeaguesHoldings', {
        walletAddress: address
      });

      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      const profileData = {
        algorand_wallet_address: address,
        algo_leagues_pack_unlocked: response.data.qualified
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
      alert('Failed to verify Algorand holdings. Please try again.');
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
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {connecting ? 'Connecting...' : 'Connect Pera Wallet'}
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
              Verifying NFT/ASA holdings...
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
                {verificationStatus.details && (
                  <div className="text-sm text-label space-y-1">
                    <p>Creator NFT: {verificationStatus.details.hasCreatorNft ? '✔' : '✘'}</p>
                    <p>ALC (10K+): {verificationStatus.details.hasAlc ? '✔' : '✘'} ({verificationStatus.details.alcBalance?.toFixed(2)})</p>
                    <p>VIP ASA: {verificationStatus.details.hasVip ? '✔' : '✘'}</p>
                  </div>
                )}
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