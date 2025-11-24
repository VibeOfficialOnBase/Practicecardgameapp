import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    // Check if iOS
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // Android install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS prompt after 3 seconds
    if (ios && !window.navigator.standalone) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-amber-200">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              {isIOS ? (
                <Smartphone className="w-6 h-6 text-white" />
              ) : (
                <Download className="w-6 h-6 text-white" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-stone-800 mb-1">
                Install PRACTICE
              </h3>
              <p className="text-sm text-stone-600 mb-3">
                Access offline, faster loading, and add to your home screen
              </p>

              {isIOS ? (
                <p className="text-xs text-stone-500 bg-stone-50 p-2 rounded-lg">
                  Tap <span className="font-semibold">Share</span> → 
                  <span className="font-semibold"> Add to Home Screen</span>
                </p>
              ) : (
                <Button
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  Install App
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}