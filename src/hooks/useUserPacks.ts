import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { VIBE_CHECK_PACKS, type VibeCheckPack } from '@/data/vibeCheckPacks';
import type { TokenBalance } from '@/utils/tokenGating';

export interface UseUserPacksReturn {
  claimedPacks: VibeCheckPack[];
  claimedPackIds: string[];
  hasClaimedAnyPack: boolean;
  refreshPacks: () => void;
}

interface UseUserPacksProps {
  tokenBalance?: TokenBalance | null;
}

export function useUserPacks({ tokenBalance }: UseUserPacksProps = {}): UseUserPacksReturn {
  const { address } = useAccount();
  const [claimedPacks, setClaimedPacks] = useState<VibeCheckPack[]>([]);

  // Determine available packs based on wallet and token balance
  const loadPacks = useCallback(() => {
    const packs: VibeCheckPack[] = [];

    // PRACTICE pack is ALWAYS available (FREE for everyone)
    const practicePack = VIBE_CHECK_PACKS.find(p => p.id === 'practice_pack');
    if (practicePack) {
      packs.push(practicePack);
    }

    // Vibe Check pack ONLY for users with $VibeOfficial tokens (1000+)
    if (address && tokenBalance && tokenBalance.formattedBalance >= 1000) {
      const vibeCheckPack = VIBE_CHECK_PACKS.find(p => p.id === 'vibe_check_exclusive');
      if (vibeCheckPack) {
        packs.push(vibeCheckPack);
      }
    }


    setClaimedPacks(packs);
  }, [address, tokenBalance]);

  // Load packs on mount and when dependencies change
  useEffect(() => {
    loadPacks();
  }, [loadPacks]);

  // Get claimed pack IDs
  const claimedPackIds = claimedPacks.map(pack => pack.id);

  // Always has at least PRACTICE pack
  const hasClaimedAnyPack = claimedPacks.length > 0;

  // Refresh packs
  const refreshPacks = useCallback(() => {
    loadPacks();
  }, [loadPacks]);

  return {
    claimedPacks,
    claimedPackIds,
    hasClaimedAnyPack,
    refreshPacks,
  };
}
