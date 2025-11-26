import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';


export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasSeenPrompt, setHasSeenPrompt] = useState(false);

  useEffect(() => {
    // Check if user has already seen and dismissed the prompt
    const seen = localStorage.getItem('pwa_install_prompt_seen');
    if (seen) {
      setHasSeenPrompt(true);
    }

    // Show prompt after 30 seconds if installable and not seen
    if (isInstallable && !hasSeenPrompt && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, hasSeenPrompt, isInstalled]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success || !success) {
      setShowPrompt(false);
      localStorage.setItem('pwa_install_prompt_seen', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_install_prompt_seen', 'true');
  };

  if (!isInstallable || isInstalled || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="relative bg-gradient-to-br from-indigo-950 to-purple-950 border-2 border-purple-400/50 shadow-2xl p-6">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon with animation */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                  alt="PRACTICE"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-purple-400/50 shadow-xl"
                />
              </motion.div>

              {/* Title */}
              <div>
                <h3 className="text-white text-2xl font-bold mb-2">
                  Install PRACTICE
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Add PRACTICE to your home screen for quick access and a better experience!
                </p>
              </div>

              {/* Benefits */}
              <div className="w-full space-y-2 text-left">
                {[
                  'Instant access from home screen',
                  'Works offline',
                  'Faster loading',
                  'No app store required'
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-white/70 text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Install button */}
              <Button
                onClick={handleInstall}
                variant="gradient"
                size="lg"
                className="w-full text-lg group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Install Now
                <Smartphone className="w-5 h-5 ml-2" />
              </Button>

              {/* Dismiss text */}
              <button
                onClick={handleDismiss}
                className="text-white/50 hover:text-white/80 text-sm transition-colors"
              >
                Maybe later
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
