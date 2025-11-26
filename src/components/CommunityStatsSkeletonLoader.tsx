import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CommunityStatsSkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card 
            key={i} 
            className="bg-gradient-to-br from-slate-900/40 to-gray-900/40 border-white/20 backdrop-blur-sm p-4"
          >
            <Skeleton className="h-4 w-4 mb-2 rounded-full" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>

      {/* Activity Feed Skeleton */}
      <Card className="bg-gradient-to-br from-slate-900/40 to-gray-900/40 border-white/20 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-1">
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
