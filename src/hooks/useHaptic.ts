import { useEffect, useState } from 'react';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export function useHaptic() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if haptic feedback is supported
    setIsSupported('vibrate' in navigator);
  }, []);

  const vibrate = (pattern: HapticPattern) => {
    if (!isSupported) return;

    try {
      switch (pattern) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(50);
          break;
        case 'heavy':
          navigator.vibrate(100);
          break;
        case 'success':
          navigator.vibrate([50, 100, 50]);
          break;
        case 'error':
          navigator.vibrate([100, 50, 100, 50, 100]);
          break;
        default:
          navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  };

  return { vibrate, isSupported };
}
