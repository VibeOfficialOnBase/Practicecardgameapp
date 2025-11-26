import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for leaderboard entries
 */
export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 glass-card rounded-lg">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for card collection
 */
export function CollectionSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="aspect-[2/3]">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for analytics dashboard
 */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-lg space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="glass-card p-6 rounded-lg space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for community feed
 */
export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass-card p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for achievements grid
 */
export function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="glass-card p-6 rounded-lg space-y-3">
          <Skeleton className="w-12 h-12 rounded-lg mx-auto" />
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}
