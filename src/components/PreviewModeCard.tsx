import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';

import confetti from 'canvas-confetti';
import { validateUsername } from '@/utils/usernameValidation';

interface PreviewModeCardProps {
  card: PracticeCard;
  onConnectWallet: () => void;
  onStart: (username: string) => void;
}

export function PreviewModeCard({ card, onConnectWallet, onStart }: PreviewModeCardProps) {
  // Preview mode messaging
  const previewMessage = "🎭 Preview Mode: This card pull won't be saved or count toward your stats. Create an account to track your progress and join the community!";
  const [isFlipped, setIsFlipped] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Preview banner with clear messaging */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-xl p-4 text-center shadow-xl border-2 border-blue-300/50"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🎭</span>
          <h3 className="text-white font-bold text-lg">Preview Mode</h3>
          <span className="text-2xl">🎭</span>
        </div>
        <p className="text-white/95 text-sm font-semibold mb-2">
          {previewMessage}
        </p>
        <p className="text-white/80 text-xs">
          Get your free daily cards and track your streak by creating an account below!
        </p>
      </motion.div>

      {/* Card display */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .preview-flip-card {
            perspective: 1000px;
          }
          .preview-flip-card-inner {
            position: relative;
            width: 100%;
            min-height: 600px;
            transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform-style: preserve-3d;
          }
          .preview-flip-card-inner.flipped {
            transform: rotateY(180deg);
          }
          .preview-flip-card-front,
          .preview-flip-card-back {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          .preview-flip-card-back {
            transform: rotateY(180deg);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            min-height: 100%;
          }
        `
      }} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="preview-flip-card"
      >
        <div 
          className={`preview-flip-card-inner ${isFlipped ? 'flipped' : ''}`}
          onClick={() => {
            if (!isFlipped) {
              setIsFlipped(true);
              // Trigger confetti on preview card reveal
              setTimeout(() => {
                confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.5 },
                  colors: ['#34D399', '#60A5FA', '#A78BFA', '#EC4899', '#FBBF24'],
                  startVelocity: 35,
                  gravity: 0.8,
                });
              }, 400);
            }
          }}
        >
          {/* Card Back */}
          <div className="preview-flip-card-front">
            <Card className={`relative overflow-hidden border-0 shadow-2xl bg-transparent ${!isFlipped ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}`}>
              <div className="relative w-full aspect-[2/3]">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/26181beb-d34c-4402-b78d-678a67d83bfb-YLQa6lpN5X6aRBgIQSRl9nVNSjS5OS"
                  alt="PRACTICE Card Back"
                 
                  className="object-cover"
                 
                />
                
                {!isFlipped && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/50"
                    >
                      <p className="text-white font-bold text-lg">✨ Tap to Reveal ✨</p>
                    </motion.div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Card Front */}
          <div className="preview-flip-card-back">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-transparent">
              <div className="relative w-full aspect-[2/3]">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3c7aff8f-230d-47f2-bcf1-e867252a5833-XsinrK6LfchksIA9GYIBPFTSm2RHNO"
                  alt="PRACTICE Card"
                 
                  className="object-cover"
                 
                />
                
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 py-6 space-y-3">
                  <motion.div 
                    className="space-y-1 max-w-[88%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                      Affirmation
                    </h3>
                    <p className="text-white text-sm sm:text-base font-bold leading-tight drop-shadow-lg">
                      {card.affirmation}
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-1 max-w-[88%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                      Today's Mission
                    </h3>
                    <p className="text-white text-xs sm:text-sm leading-tight drop-shadow-lg font-semibold">
                      {card.mission}
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-1 max-w-[88%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <h3 className="text-white/90 text-[9px] uppercase tracking-wider font-bold drop-shadow-lg">
                      Inspiration
                    </h3>
                    <p className="text-white/95 text-xs italic leading-tight drop-shadow-lg font-medium">
                      "{card.inspiration}"
                    </p>
                  </motion.div>
                </div>

                {/* VibeOfficial Logo - Bottom Center on Front Side Too */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <img
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                    alt="VibeOfficial"
                    width={60}
                    height={60}
                    className="object-contain rounded-full shadow-2xl border-3 border-white/30"
                   
                  />
                </div>
              </div>
              
              <CardContent className="relative z-10 p-4 space-y-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  variant="outline"
                  className="w-full glass-card border-2 text-white hover:glass-card-hover"
                >
                  🔄 Flip Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Connect wallet CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400/30 text-center space-y-4"
      >
        <h3 className="text-white font-bold text-xl">Love what you see?</h3>
        <p className="text-white/80 text-sm">
          Connect your wallet to pull a new magical card every day, build streaks, earn achievements, and join our community!
        </p>
        
        {!showUsernameInput ? (
          <Button
            onClick={() => setShowUsernameInput(true)}
            size="lg"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg group"
          >
            <span>Connect Wallet & Start Your Journey</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="text-left space-y-2">
              <Label htmlFor="preview-username" className="text-white text-sm font-semibold">
                Choose Your Username
              </Label>
              <Input
                id="preview-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter username..."
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:ring-2 focus:ring-green-400"
                maxLength={20}
              />
              {error && (
                <p className="text-red-300 text-xs">{error}</p>
              )}
              <p className="text-white/60 text-xs">
                3-20 characters, letters, numbers, _ or - only
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowUsernameInput(false);
                  setUsername('');
                  setError('');
                }}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  const validation = validateUsername(username);
                  if (!validation.isValid) {
                    setError(validation.error || 'Invalid username');
                    return;
                  }
                  // Save username and proceed to wallet connection
                  onStart(validation.sanitized || username.trim());
                  onConnectWallet();
                }}
                disabled={!username.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        <p className="text-white/60 text-xs">
          Free daily cards for everyone • $VibeOfficial holders get exclusive perks
        </p>
      </motion.div>
    </div>
  );
}
