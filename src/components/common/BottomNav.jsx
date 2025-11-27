import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Award, BarChart3, Trophy, Heart } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const location = useLocation();

  // Bottom tabs with icons only: Pull Cards, Wins, Stats, Games, Profile
  const navItems = [
    { name: 'Pull', path: 'PullCards', icon: Sparkles },
    { name: 'Wins', path: 'Wins', icon: Award },
    { name: 'Stats', path: 'Stats', icon: BarChart3 },
    { name: 'Games', path: 'Games', icon: Trophy },
    { name: 'Profile', path: 'Profile', icon: Heart },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname.toLowerCase();
    const targetPath = path.toLowerCase();

    if (targetPath === 'pullcards' && (currentPath === '/' || currentPath === '/pullcards' || currentPath === '/pull' || currentPath === '/practice')) return true;
    if (targetPath === 'wins' && (currentPath === '/wins' || currentPath === '/achievements')) return true;
    if (targetPath === 'stats' && (currentPath === '/stats' || currentPath === '/leaderboard')) return true;
    if (targetPath === 'games' && (currentPath === '/board' || currentPath === '/games')) return true;
    if (targetPath === 'profile' && currentPath === '/profile') return true;
    
    return currentPath.includes(targetPath);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none lg:hidden">
      {/* Gradient fade at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      <div className="bg-indigo-950/95 backdrop-blur-xl border-t border-white/10 pointer-events-auto pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                to={createPageUrl(item.path)}
                key={item.name}
                className="relative flex flex-col items-center justify-center w-16 h-[56px] group shrink-0"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-nav-glow"
                    className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-t-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <motion.div
                  animate={{
                    y: active ? -2 : 0,
                    scale: active ? 1.1 : 1
                  }}
                  className={`relative z-10 flex flex-col items-center gap-1 ${
                    active ? 'text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-white/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
                  <span className="text-[9px] font-medium tracking-wide whitespace-nowrap">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
