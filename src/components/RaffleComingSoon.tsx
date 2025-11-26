import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gift, Sparkles, Clock } from 'lucide-react';


export function RaffleComingSoon() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-white/80 text-sm">Powered By</span>
        <img
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
          alt="VibeOfficial"
          width={32}
          height={32}
          className="object-contain rounded-full shadow-lg border-2 border-purple-300/50"
        />
        <span className="text-white font-bold">VibeOfficial</span>
      </div>

      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <CardHeader className="relative z-10 px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              VibeOfficial Merch Raffle
            </CardTitle>
          </div>
          
          {/* Merch Image Showcase */}
          <div className="my-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl"></div>
            <div className="relative bg-white/5 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/76712288-5f7e-4e68-a4fd-ee239e958fd5-NrnR7Z7uBnjR3GqBGuJSZP4svrWQc5"
                  alt="VibeOfficial Merch"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12">
                  <Clock className="w-4 h-4 inline mr-1 animate-pulse" />
                  <span className="font-bold text-sm">Coming Soon!</span>
                </div>
              </div>
            </div>
          </div>
          
          <CardDescription className="text-indigo-200 text-sm sm:text-base md:text-lg">
            Exclusive VibeOfficial merch raffle launching soon! Stay tuned for your chance to win amazing prizes.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 px-4 sm:px-6">
          <div className="text-center py-8 sm:py-12">
            <div className="flex justify-center gap-2 mb-6">
              <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
              <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">🎉 Raffle Coming Soon! 🎉</h3>
            
            <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-400/30 mb-6 max-w-md mx-auto">
              <p className="text-white/90 mb-4">Get ready for an epic raffle with amazing VibeOfficial merchandise!</p>
              <ul className="text-indigo-200 text-sm space-y-2 text-left">
                <li>• Exclusive limited edition merch</li>
                <li>• Token-gated entry for $VibeOfficial holders</li>
                <li>• Weighted selection based on holdings</li>
                <li>• Multiple winners announced soon</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30 max-w-md mx-auto">
              <p className="text-purple-200 text-sm">
                💎 Hold <span className="text-green-300 font-bold">$100 USD</span> worth of $VibeOfficial tokens to qualify!
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-white/60 text-sm">
              Follow{' '}
              <a 
                href="https://x.com/havehonorfaith" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 underline"
              >
                @havehonorfaith
              </a>
              {' '}for raffle launch announcements
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
