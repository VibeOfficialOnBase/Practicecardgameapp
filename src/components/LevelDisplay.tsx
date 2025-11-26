import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLevelInfo, type LevelInfo } from '@/utils/xpTracking';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface LevelDisplayProps {
  username: string;
  compact?: boolean;
}

export function LevelDisplay({ username, compact = false }: LevelDisplayProps) {
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    level: 1,
    currentXP: 0,
    xpForNextLevel: 100,
    progressPercent: 0,
  });

  useEffect(() => {
    const info = getLevelInfo(username);
    setLevelInfo(info);
  }, [username]);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-3 py-1.5 rounded-full border border-purple-400/30">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-white font-bold text-sm">Level {levelInfo.level}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-lg p-4 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Level {levelInfo.level}</h3>
            <p className="text-white/60 text-xs">
              {levelInfo.currentXP} / {levelInfo.xpForNextLevel} XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-xs">Progress</p>
          <p className="text-white font-bold">{Math.floor(levelInfo.progressPercent)}%</p>
        </div>
      </div>
      
      <Progress 
        value={levelInfo.progressPercent} 
        className="h-2 bg-white/10"
      />
      
      <p className="text-white/60 text-xs mt-2 text-center">
        {levelInfo.xpForNextLevel - levelInfo.currentXP} XP until Level {levelInfo.level + 1}
      </p>
    </motion.div>
  );
}
