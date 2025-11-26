import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, Copy, Check } from 'lucide-react';
import Confetti from 'react-confetti';
import type { RaffleEntry } from '@/spacetime_module_bindings';

interface WinnerSelectorProps {
  raffleEntries: RaffleEntry[];
  onSelectWeightedWinner: () => void;
}

export function WinnerSelector({ raffleEntries, onSelectWeightedWinner }: WinnerSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [winner, setWinner] = useState<RaffleEntry | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectWinner = () => {
    if (raffleEntries.length === 0) return;

    setIsSelecting(true);
    setWinner(null);
    setShowConfetti(false);

    // Simulate selection animation
    setTimeout(() => {
      // Call the SpacetimeDB reducer to select winner
      onSelectWeightedWinner();

      // Locally select winner using weighted random selection
      // Weighted by USD value
      const totalWeight = raffleEntries.reduce((sum: number, entry: RaffleEntry) => {
        return sum + (entry.usdValue > 0 ? entry.usdValue : 0);
      }, 0);

      if (totalWeight > 0) {
        let random = Math.random() * totalWeight;
        let selectedWinner: RaffleEntry | null = null;

        for (const entry of raffleEntries) {
          const weight = entry.usdValue > 0 ? entry.usdValue : 0;
          random -= weight;
          if (random <= 0) {
            selectedWinner = entry;
            break;
          }
        }

        if (!selectedWinner) {
          selectedWinner = raffleEntries[raffleEntries.length - 1];
        }

        setWinner(selectedWinner);
      } else {
        // Fallback to uniform random if all weights are 0
        const randomIndex = Math.floor(Math.random() * raffleEntries.length);
        setWinner(raffleEntries[randomIndex]);
      }

      setIsSelecting(false);
      setShowConfetti(true);

      // Stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    }, 2000);
  };

  const copyAnnouncement = () => {
    if (!winner) return;

    const announcement = `🎉 WINNER ANNOUNCEMENT 🎉

Congratulations to our VibeOfficial Merch Raffle Winner!

👤 Username: ${winner.username}
💎 Token Holdings: ${winner.tokenBalance} $VibeOfficial ($${winner.usdValue.toFixed(2)})
📧 Email: ${winner.email}

We'll be reaching out shortly. Thank you to everyone who participated!

#VibeOfficial #PRACTICE #Winner`;

    navigator.clipboard.writeText(announcement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={500}
          colors={['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']}
        />
      )}

      <Card className="backdrop-blur-lg bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Winner Selection
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-center space-y-6">
            <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-400/30">
              <p className="text-white/90 mb-2">
                <strong>Total Entries:</strong> {raffleEntries.length}
              </p>
              <p className="text-white/70 text-sm">
                Winner will be selected using weighted random selection based on token holdings
              </p>
            </div>

            {!winner && !isSelecting && (
              <Button
                onClick={selectWinner}
                disabled={raffleEntries.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Select Winner Now!
              </Button>
            )}

            {isSelecting && (
              <div className="py-12">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mb-4"></div>
                <p className="text-white text-xl font-bold animate-pulse">Selecting Winner...</p>
                <p className="text-white/60 text-sm mt-2">Using weighted random selection</p>
              </div>
            )}

            {winner && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-8 rounded-xl border-2 border-yellow-400/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-500/10 to-yellow-400/10 animate-pulse"></div>
                  <div className="relative z-10">
                    <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-3xl font-bold text-white mb-2">🎉 Winner! 🎉</h2>
                    <div className="bg-white/10 p-6 rounded-lg mt-4 space-y-2">
                      <p className="text-white">
                        <strong className="text-yellow-300">Username:</strong> {winner.username}
                      </p>
                      <p className="text-white">
                        <strong className="text-yellow-300">Email:</strong> {winner.email}
                      </p>
                      <p className="text-white/70 font-mono text-sm">
                        <strong className="text-yellow-300">Wallet:</strong> {winner.wallet}
                      </p>
                      <p className="text-white">
                        <strong className="text-yellow-300">Holdings:</strong> {winner.tokenBalance} $VibeOfficial
                      </p>
                      <p className="text-white">
                        <strong className="text-yellow-300">USD Value:</strong> ${winner.usdValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={copyAnnouncement}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Winner Announcement
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    setWinner(null);
                    setShowConfetti(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Select Another Winner
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
