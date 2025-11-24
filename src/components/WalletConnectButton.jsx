import React from 'react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity
} from '@coinbase/onchainkit/identity';
import { useVibeTokenVerification } from '@/hooks/useVibeTokenVerification';

export function WalletConnectButton() {
  const {
    isConnected,
    isEligible,
    formattedBalance,
    minRequired,
    tokensNeeded,
    isLoading
  } = useVibeTokenVerification();

  return (
    <div className="w-full max-w-md">
      <Wallet>
        <ConnectWallet className="bg-gradient-to-r from-[#D4A574] to-[#8B7355] hover:opacity-90 transition-opacity">
          <Avatar className="h-6 w-6" />
          <Name className="text-white font-semibold" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity
            className="px-4 pt-3 pb-2 bg-white rounded-lg"
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name />
            <Address className="text-sm text-gray-600" />
          </Identity>
          <WalletDropdownDisconnect className="hover:bg-red-50" />
        </WalletDropdown>
      </Wallet>

      {isConnected && !isLoading && (
        <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">$VIBE Balance:</span>
            <span className="font-bold text-[#D4A574]">{formattedBalance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Required:</span>
            <span className="font-bold text-gray-800">{minRequired}</span>
          </div>

          {isEligible ? (
            <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-lg text-center text-sm font-semibold">
              ✓ Cosmetics Unlocked
            </div>
          ) : (
            <div className="mt-3 p-2 bg-amber-100 text-amber-800 rounded-lg text-center text-sm">
              Need {tokensNeeded.toFixed(2)} more $VIBE
            </div>
          )}
        </div>
      )}
    </div>
  );
}
