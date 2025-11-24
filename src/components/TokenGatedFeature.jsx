import React from 'react';
import { useVibeTokenVerification } from '@/hooks/useVibeTokenVerification';

export function TokenGatedFeature({
  children,
  fallback,
  showLock = true
}) {
  const { isEligible, isConnected, minRequired } = useVibeTokenVerification();

  if (isEligible) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      {showLock && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🔒</div>
            <p className="font-semibold text-gray-800">
              {isConnected
                ? `Requires ${minRequired} $VIBE`
                : 'Connect Wallet to Unlock'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
