import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !isSyncing && pendingCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isOnline ? 'bg-green-600' : 'bg-orange-600'
        } text-white py-2 px-4 shadow-lg`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Syncing...</span>
            </>
          ) : isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Back online!</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">
                You're offline. Changes will sync when reconnected.
              </span>
              {pendingCount > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}