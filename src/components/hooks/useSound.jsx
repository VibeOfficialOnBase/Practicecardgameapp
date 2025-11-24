import { useCallback } from 'react';
import { soundManager } from '../utils/soundManager';

export function useSound() {
  const play = useCallback((soundName, volume) => {
    soundManager.play(soundName, volume);
  }, []);

  const stop = useCallback((soundName) => {
    soundManager.stop(soundName);
  }, []);

  const stopAll = useCallback(() => {
    soundManager.stopAll();
  }, []);

  return { play, stop, stopAll };
}