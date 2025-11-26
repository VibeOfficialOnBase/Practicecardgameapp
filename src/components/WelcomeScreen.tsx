import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SparklesBackground } from '@/components/SparklesBackground';
import { MagicalParticles } from '@/components/MagicalParticles';

import { validateUsername } from '@/utils/usernameValidation';

interface WelcomeScreenProps {
  onStart: (username: string) => void;
  onPreviewPull?: () => void;
  onReturningUser?: () => void;
}

export function WelcomeScreen({ onStart, onPreviewPull, onReturningUser }: WelcomeScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Check for referral code in URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    
    if (ref) {
      setReferralCode(ref);
      // Store it temporarily so we can use it after username is set
      sessionStorage.setItem('pending_referral_code', ref);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username
    const validation = validateUsername(username);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid username');
      return;
    }

    if (email.trim()) {
      // Send email notification to admin
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            username: username.trim(),
            action: 'signup',
            wallet: null,
          }),
        });
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error sending email notification:', err);
        }
      }
    }

    // Use the sanitized username from validation
    onStart(validation.sanitized || username.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16 sm:pt-4 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 relative overflow-hidden">
      <SparklesBackground />
      <MagicalParticles />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 flex items-center justify-center">
            <img
              src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
              alt="VibeOfficial Logo"
              width={160}
              height={160}
              sizes="(max-width: 640px) 128px, 160px"
              className="object-contain drop-shadow-2xl rounded-full shadow-2xl border-4 border-purple-400/30"
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-sm">Powered By</span>
            <img
              src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
              alt="VibeOfficial"
              width={32}
              height={32}
              className="object-contain rounded-full shadow-lg border-2 border-purple-300/50"
            />
            <span className="text-white font-bold">$VibeOfficial</span>
          </div>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-practice">
              PRACTICE
            </CardTitle>
            <CardDescription className="text-indigo-200 text-sm sm:text-base md:text-lg">
              Patiently Repeating Altruistic Challenges To Inspire Core Excellence
            </CardDescription>
            <p className="text-white/80 mt-4 text-xs sm:text-sm">
              Daily affirmations, missions, and inspiration for your self-empowerment journey
            </p>
            {referralCode && (
              <div className="mt-3 p-2 bg-green-500/20 border border-green-400/30 rounded-lg">
                <p className="text-green-300 text-xs font-semibold">
                  🎉 You were referred! Using code: {referralCode}
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                  maxLength={20}
                />
                <p className="text-xs text-white/50">
                  3-20 characters, letters, numbers, _ or - only
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
                <p className="text-xs text-indigo-200">
                  Get daily reminders to pull your PRACTICE card
                </p>
              </div>

              {error && (
                <p className="text-red-300 text-sm">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-2xl active:scale-95 transition-all transform hover:scale-105 animate-pulse"
              >
                ✨ START YOUR MAGICAL PRACTICE ✨
              </Button>
            </form>

            {onReturningUser && (
              <div className="mt-4 text-center">
                <p className="text-white/60 text-sm mb-2">Already have an account?</p>
                <Button
                  type="button"
                  onClick={onReturningUser}
                  variant="outline"
                  className="w-full border-2 border-white/30 text-white hover:bg-white/10"
                >
                  🔑 Returning User? Sign In with Email
                </Button>
              </div>
            )}

            {onPreviewPull && (
              <div className="mt-4 text-center">
                <p className="text-white/60 text-sm mb-2">Want to try first?</p>
                <Button
                  type="button"
                  onClick={onPreviewPull}
                  variant="outline"
                  className="w-full border-2 border-white/30 text-white hover:bg-white/10"
                >
                  👀 See a Free Preview Card
                </Button>
              </div>
            )}

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
              <p className="text-center text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">Connect with $VibeOfficial</p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => window.open('https://zora.co/vibeofficial', '_blank')}
                >
                  🎨 Zora
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => window.open('https://x.com/havehonorfaith', '_blank')}
                >
                  𝕏 X (Twitter)
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => window.open('https://discord.com/invite/JyCspthQTx', '_blank')}
                >
                  💬 Discord
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <p className="text-white/90 text-sm font-semibold">
            🎴 PRACTICE Deck: <span className="text-green-400">100% Free</span> (No Wallet Needed)
          </p>
          <p className="text-white/60 text-xs">
            💎 Connect Wallet for Exclusive Packs & Holder Benefits • Base Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
