import { useState, useEffect } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import type { Address } from 'viem';
import { createPublicClient, http, formatUnits } from 'viem';
import { zora } from 'viem/chains';
import { VIBE_TOKEN_ADDRESS } from '@/utils/tokenGating';

interface NetworkWarningBannerProps {
  address: Address;
}

interface ZoraBalance {
  balance: number;
  hasTokens: boolean;
  checking: boolean;
}

export function NetworkWarningBanner({ address }: NetworkWarningBannerProps) {
  const [zoraBalance, setZoraBalance] = useState<ZoraBalance>({
    balance: 0,
    hasTokens: false,
    checking: true,
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkZoraBalance();
  }, [address]);

  const checkZoraBalance = async () => {
    try {
      setZoraBalance({ balance: 0, hasTokens: false, checking: true });

      // Create Zora chain client
      const client = createPublicClient({
        chain: zora,
        transport: http(),
      });

      // ERC20 ABI for balance and decimals
      const erc20ABI = [
        {
          inputs: [{ name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint8' }],
          stateMutability: 'view',
          type: 'function',
        },
      ] as const;

      // Get token decimals
      const decimals = await client.readContract({
        address: VIBE_TOKEN_ADDRESS,
        abi: erc20ABI,
        functionName: 'decimals',
      });

      // Get token balance on Zora
      const balance = await client.readContract({
        address: VIBE_TOKEN_ADDRESS,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address],
      });

      const balanceFormatted = formatUnits(balance, decimals);
      const balanceNumber = parseFloat(balanceFormatted);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Zora VIBE Balance: ${balanceNumber}`);
      }

      setZoraBalance({
        balance: balanceNumber,
        hasTokens: balanceNumber > 0,
        checking: false,
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking Zora balance:', error);
      }
      setZoraBalance({ balance: 0, hasTokens: false, checking: false });
    }
  };

  // Don't show if dismissed or still checking
  if (dismissed || zoraBalance.checking) {
    return null;
  }

  return (
    <AnimatePresence>
      {zoraBalance.hasTokens && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-2 border-yellow-400/50 rounded-xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1 animate-pulse" />
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">
                  🌉 Bridge Your $VibeOfficial Tokens to Base
                </h3>
                <p className="text-yellow-100 text-sm mb-3">
                  We detected <span className="font-bold text-yellow-200">{Math.floor(zoraBalance.balance).toLocaleString()} $VibeOfficial tokens</span> in your wallet on Zora network.
                </p>
                <p className="text-yellow-100/90 text-sm mb-4">
                  To pull PRACTICE cards, your $VibeOfficial tokens must be on <span className="font-bold text-white">Base network</span>. Please bridge your tokens to Base to continue.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => window.open('https://app.relay.link/bridge/zora', '_blank')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Bridge via Relay
                  </Button>
                  <Button
                    onClick={() => window.open('https://zora.co/bridge', '_blank')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Bridge via Zora
                  </Button>
                  <Button
                    onClick={() => setDismissed(true)}
                    variant="outline"
                    className="border-yellow-300/50 text-yellow-200 hover:bg-yellow-500/20"
                    size="sm"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
