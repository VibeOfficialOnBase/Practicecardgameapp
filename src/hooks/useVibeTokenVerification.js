import { useAccount, useReadContract } from 'wagmi';
import { VIBE_TOKEN_CONFIG } from '@/config/vibeToken';
import { formatUnits } from 'viem';
import { useEffect, useState } from 'react';

export function useVibeTokenVerification() {
  const { address, isConnected } = useAccount();
  const [isEligible, setIsEligible] = useState(false);

  const { data: balanceData, isLoading, isError, refetch } = useReadContract({
    address: VIBE_TOKEN_CONFIG.address,
    abi: VIBE_TOKEN_CONFIG.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(isConnected && address),
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  const tokenBalance = balanceData
    ? Number(formatUnits(balanceData, VIBE_TOKEN_CONFIG.decimals))
    : 0;

  useEffect(() => {
    setIsEligible(isConnected && tokenBalance >= VIBE_TOKEN_CONFIG.minHolding);
  }, [isConnected, tokenBalance]);

  return {
    // Wallet connection status
    isConnected,
    address,

    // Token information
    tokenBalance,
    formattedBalance: tokenBalance.toFixed(2),
    minRequired: VIBE_TOKEN_CONFIG.minHolding,
    tokensNeeded: Math.max(0, VIBE_TOKEN_CONFIG.minHolding - tokenBalance),

    // Eligibility
    isEligible,
    hasMinimumTokens: tokenBalance >= VIBE_TOKEN_CONFIG.minHolding,

    // Loading states
    isLoading,
    isError,

    // Actions
    refetch,
  };
}
