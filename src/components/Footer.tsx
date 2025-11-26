import { Button } from '@/components/ui/button';

import { Heart, Twitter, MessageCircle, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-white/10 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Column */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img
                src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                alt="VibeOfficial"
                width={48}
                height={48}
                className="object-contain rounded-full shadow-lg border-2 border-purple-400/50 animate-logo-glow"
               
              />
              <div>
                <h3 className="text-white font-bold text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  PRACTICE
                </h3>
                <p className="text-xs text-white/60">Powered by $VibeOfficial</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs mx-auto md:mx-0">
              Daily affirmations and missions to inspire core excellence through patient, altruistic practice.
            </p>
          </div>

          {/* Community Column */}
          <div className="text-center">
            <h4 className="text-white font-bold mb-4 flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Join Our Community
            </h4>
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto text-white/80 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => window.open('https://zora.co/vibeofficial', '_blank')}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Follow on Zora
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto text-white/80 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => window.open('https://x.com/havehonorfaith', '_blank')}
              >
                <Twitter className="w-4 h-4 mr-2" />
                Follow on X
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto text-white/80 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => {
                  const discordWindow = window.open('https://discord.com/invite/JyCspthQTx', '_blank', 'noopener,noreferrer');
                  if (!discordWindow) {
                    alert('Please allow popups to join our Discord community!');
                  }
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discord
              </Button>
            </div>
          </div>

          {/* About Column */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-bold mb-4">About the Creator</h4>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs mx-auto md:ml-auto">
              Created by <span className="font-semibold text-purple-300">Eddie Pabon</span>, Author, Breathwork Coach, and founder of $VibeOfficial on Base.
            </p>
            <div className="mt-4 inline-block bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg px-4 py-2 border border-purple-400/30">
              <p className="text-xs font-semibold text-white">PRACTICE → LECHE 🥛</p>
              <p className="text-xs text-purple-200">Love, Empathy, Community, Healing, Empowerment</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} $VibeOfficial. Built with <Heart className="w-3 h-3 inline text-pink-400 animate-pulse" /> on Base
            </p>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Token Gated</span>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <span>Base Network</span>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <span>Powered by $VibeOfficial</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
