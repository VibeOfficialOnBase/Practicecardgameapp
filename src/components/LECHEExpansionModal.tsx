import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface LECHEExpansionModalProps {
  open: boolean;
  onClose: () => void;
}

export function LECHEExpansionModal({ open, onClose }: LECHEExpansionModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl"
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white/20">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="text-6xl">🥛</div>
                  </div>
                  <motion.h2 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl font-bold gradient-text mb-2"
                  >
                    LECHE Expansion Pack
                  </motion.h2>
                  <motion.p 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-indigo-200 text-lg font-semibold mb-2"
                  >
                    365 Daily Cards of Love & Empowerment
                  </motion.p>
                  <motion.p 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-pink-300 text-sm"
                  >
                    Love • Empathy • Community • Healing • Empowerment
                  </motion.p>
                </div>

                {/* Content */}
                <div className="space-y-6 mb-8">
                  {/* What's Included */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-xl border border-pink-400/30"
                  >
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                      What's Inside
                    </h3>
                    <ul className="space-y-3 text-indigo-200">
                      <li className="flex items-start gap-3">
                        <span className="text-pink-400 mt-1">✨</span>
                        <span><span className="font-bold text-white">365 unique LECHE cards</span> - one for every day of the year</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-pink-400 mt-1">💝</span>
                        <span>Focused on <span className="font-bold text-white">Love, Empathy, Community, Healing, and Empowerment</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-pink-400 mt-1">🎯</span>
                        <span>Daily affirmations, missions, and inspirations to nurture your soul</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-pink-400 mt-1">🏆</span>
                        <span>Exclusive achievements and bonus rewards for LECHE card collectors</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-pink-400 mt-1">📖</span>
                        <span>Special journaling prompts focused on self-love and community connection</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Pricing and CTA */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-400/40 rounded-xl p-6 text-center"
                  >
                    <div className="mb-4">
                      <p className="text-white/80 text-sm mb-2">Full Year Access</p>
                      <div className="text-4xl font-bold gradient-text mb-1">Coming Soon</div>
                      <p className="text-pink-300 text-xs">Be the first to know when LECHE launches</p>
                    </div>
                    
                    <Button
                      onClick={() => {
                        window.open('https://zora.co/vibeofficial', '_blank');
                        onClose();
                      }}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg py-6 shadow-2xl hover-scale"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Join Waitlist on Zora
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  {/* About LECHE */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-white/70 text-sm leading-relaxed">
                      LECHE is the evolution of PRACTICE - a deeper dive into what we cultivate through our daily work. 
                      Where PRACTICE teaches us <span className="text-purple-300 font-semibold">the discipline</span>, 
                      LECHE shows us <span className="text-pink-300 font-semibold">the reward</span>: 
                      a lifeed with Love, Empathy, Community, Healing, and Empowerment.
                    </p>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
                  <img
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                    alt="VibeOfficial"
                    width={32}
                    height={32}
                    className="object-contain rounded-full shadow-lg border-2 border-pink-300/50"
                  />
                  <p className="text-white/60 text-xs">
                    Created by Eddie Pabon • Powered by <span className="text-pink-300 font-semibold">$VibeOfficial</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
