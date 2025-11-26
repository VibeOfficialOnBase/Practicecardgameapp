import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useGlobalLeaderboard } from '@/hooks/useGlobalLeaderboard';


export function Leaderboard() {
  const { leaderboard, isLoading, connected } = useGlobalLeaderboard();

  // Show top 10
  const topTen = leaderboard.slice(0, 10);

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
        <span className="text-white font-bold">$VibeOfficial</span>
      </div>

      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2" role="heading" aria-level={1}>
            <Trophy className="w-8 h-8 text-yellow-400" />
            Global Leaderboard
          </CardTitle>
          <p className="text-indigo-200 text-xs sm:text-sm">
            Top practitioners with the longest daily streaks worldwide
          </p>
          {!connected && (
            <p className="text-yellow-300 text-xs flex items-center gap-2 mt-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting to global leaderboard...
            </p>
          )}
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
              <span className="ml-2 text-white/60">Loading leaderboard...</span>
            </div>
          ) : topTen.length === 0 ? (
            <p className="text-white/60 text-center py-6 sm:py-8 text-sm">
              No entries yet. Be the first to start your PRACTICE journey!
            </p>
          ) : (
            <div className="space-y-3">
              {topTen.map((entry, index) => (
                <div
                  key={entry.wallet}
                  className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400/50'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-400/50'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-600/20 to-amber-700/20 border-2 border-orange-500/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center" aria-label={`Rank ${index + 1}`}>
                    {index === 0 && <Trophy className="w-8 h-8 text-yellow-400" aria-label="First place" />}
                    {index === 1 && <Trophy className="w-8 h-8 text-gray-300" aria-label="Second place" />}
                    {index === 2 && <Trophy className="w-8 h-8 text-orange-400" aria-label="Third place" />}
                    {index > 2 && (
                      <span className="text-white/80 font-bold text-lg">#{index + 1}</span>
                    )}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base sm:text-lg truncate">
                      {entry.username}
                    </p>
                    <p className="text-white/60 text-xs sm:text-sm">
                      Level {entry.level} • {entry.totalXp.toLocaleString()} XP
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-2 sm:gap-4 text-right flex-shrink-0">
                    <div>
                      <div className="flex items-center gap-1 text-indigo-300">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-lg font-bold text-white">{entry.streak}</span>
                      </div>
                      <p className="text-xs text-white/60">Streak</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-purple-300">
                        <Calendar className="w-4 h-4" />
                        <span className="text-lg font-bold text-white">{entry.totalPulls}</span>
                      </div>
                      <p className="text-xs text-white/60">Total</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-white/60 text-xs">
        Pull daily to climb the global leaderboard!
      </p>
    </div>
  );
}
