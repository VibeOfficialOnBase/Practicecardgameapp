import { useCallback } from 'react';
import { hapticManager } from '../utils/hapticManager';

export function useHaptic() {
  const trigger = useCallback((pattern) => {
    hapticManager.trigger(pattern);
  }, []);

  return { trigger };
}