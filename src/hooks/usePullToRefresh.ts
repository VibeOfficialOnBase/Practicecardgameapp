import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  disabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  disabled = false,
}: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    // Check if device is mobile
    isMobile.current = window.innerWidth < 768;

    if (disabled || !isMobile.current) return;

    let startY = 0;
    let currentY = 0;
    let isAtTop = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull-to-refresh when at the top of the page
      isAtTop = window.scrollY === 0;
      if (!isAtTop) return;

      startY = e.touches[0].clientY;
      touchStartY.current = startY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTop || isPulling) return;

      currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      // Only track downward pulls
      if (distance > 0 && distance < threshold * 2) {
        setPullDistance(distance);
        
        // Prevent default scroll behavior when pulling
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isAtTop) {
        setPullDistance(0);
        return;
      }

      if (pullDistance >= threshold) {
        setIsPulling(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Error during pull-to-refresh:', error);
        } finally {
          setIsPulling(false);
        }
      }
      
      setPullDistance(0);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold, disabled, isPulling, pullDistance]);

  const progress = Math.min((pullDistance / threshold) * 100, 100);

  return {
    isPulling,
    pullDistance,
    progress,
    isVisible: pullDistance > 0,
  };
}
