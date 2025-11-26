import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Eye, Wallet, X } from 'lucide-react';

import { practiceCards } from '@/data/cardsExport';
import { validateUsername } from '@/utils/usernameValidation';

interface PreviewModeWelcomeProps {
  onStart: (username: string) => void;
  onPreview: () => void;
}

export function PreviewModeWelcome({ onStart, onPreview }: PreviewModeWelcomeProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewCard, setPreviewCard] = useState<typeof practiceCards[0] | null>(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handlePreview = () => {
    // Pick a random card for preview
    const randomCard = practiceCards[Math.floor(Math.random() * practiceCards.length)];
    setPreviewCard(randomCard);
    setShowPreview(true);
    onPreview();
  };

  return (
    <div className="min-h-screen whimsical-gradient-backdrop relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg w-full"
          >
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
              {/* Logo */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                  alt="VibeOfficial"
                  width={100}
                  height={100}
                  className="mx-auto rounded-full shadow-lg border-4 border-purple-400/50 mb-4"
                 
                />
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 font-practice">
                  PRACTICE
                </h1>
                <p className="text-white/80 text-sm">
                  Patiently Repeating Altruistic Challenges To Inspire Core Excellence
                </p>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-8"
              >
                <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-4 rounded-lg border border-purple-400/30">
                  <p className="text-white/90 text-center text-sm leading-relaxed">
                    Pull a daily card for affirmations, missions, and inspiration. 
                    Build streaks, unlock achievements, and transform through daily practice.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-2xl mb-1">🎴</p>
                    <p className="text-white/70 text-xs">365 Cards</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-2xl mb-1">🔥</p>
                    <p className="text-white/70 text-xs">Daily Streaks</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-2xl mb-1">🏆</p>
                    <p className="text-white/70 text-xs">Achievements</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                {/* Preview Button */}
                <Button
                  onClick={handlePreview}
                  variant="gradient"
                  size="lg"
                  className="w-full text-lg group"
                >
                  <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Preview a Card (No Wallet Needed)
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>

                {/* Username Input */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Choose a username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <Button
                    onClick={() => {
                      const validation = validateUsername(username);
                      if (!validation.isValid) {
                        setError(validation.error || 'Invalid username');
                        return;
                      }
                      onStart(validation.sanitized || username);
                    }}
                    disabled={!username}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet & Start
                  </Button>
                  {error && (
                    <p className="text-red-300 text-xs mt-1">{error}</p>
                  )}
                </div>

                <p className="text-white/60 text-xs text-center mt-4">
                  Hold 1,000 $VibeOfficial tokens for daily cards • First pull is FREE!
                </p>
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full relative"
          >
            {/* Close button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full transition-colors z-50"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Preview Card */}
            {previewCard && (
              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-400/30 backdrop-blur-xl overflow-hidden">
                <div className="relative w-full aspect-[2/3]">
                  <img
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3c7aff8f-230d-47f2-bcf1-e867252a5833-XsinrK6LfchksIA9GYIBPFTSm2RHNO"
                    alt="PRACTICE Card"
                   
                    className="object-cover"
                  />
                  
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 py-6 space-y-3">
                    <div className="space-y-1 max-w-[88%]">
                      <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                        Affirmation
                      </h3>
                      <p className="text-white text-sm sm:text-base font-bold leading-tight drop-shadow-lg">
                        {previewCard.affirmation}
                      </p>
                    </div>

                    <div className="space-y-1 max-w-[88%]">
                      <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                        Today's Mission
                      </h3>
                      <p className="text-white text-xs sm:text-sm leading-tight drop-shadow-lg font-semibold">
                        {previewCard.mission}
                      </p>
                    </div>

                    <div className="space-y-1 max-w-[88%]">
                      <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                        Inspiration
                      </h3>
                      <p className="text-white/95 text-xs italic leading-tight drop-shadow-lg font-medium">
                        "{previewCard.inspiration}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3 bg-black/20">
                  <p className="text-white text-center text-sm">
                    ✨ This is just a preview! ✨
                  </p>
                  <p className="text-white/80 text-center text-xs mb-2">
                    Ready to start your daily practice?
                  </p>
                  
                  {/* Username Input */}
                  <input
                    type="text"
                    placeholder="Choose a username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  
                  <Button
                    onClick={() => {
                      const validation = validateUsername(username);
                      if (!validation.isValid) {
                        setError(validation.error || 'Invalid username');
                        return;
                      }
                      onStart(validation.sanitized || username.trim());
                    }}
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={!username.trim()}
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet & Start Daily Cards
                  </Button>
                  {error && (
                    <p className="text-red-300 text-xs mt-1 text-center">{error}</p>
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
