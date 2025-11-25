import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Award, BarChart3 } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const location = useLocation();

  // Mobile nav shows only 4 primary tabs as per requirements
  const navItems = [
    { name: 'Pull', path: 'Practice', icon: Home },
    { name: 'Cards', path: 'MyCards', icon: BookOpen },
    { name: 'Wins', path: 'Achievements', icon: Award },
    { name: 'Stats', path: 'Leaderboard', icon: BarChart3 }
  ];

  const isActive = (path) => {
    if (path === 'Practice' && location.pathname === '/') return true;
    return location.pathname.includes(path);
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      <div className="bg-indigo-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-1 pointer-events-auto pb-safe">
        <div className="flex items-center justify-around w-full max-w-md mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                to={createPageUrl(item.path)}
                key={item.name}
                className="relative flex flex-col items-center justify-center w-16 h-[52px] group"
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
                    y: active ? -4 : 0,
                    scale: active ? 1.1 : 1
                  }}
                  className={`relative z-10 flex flex-col items-center gap-0.5 ${
                    active ? 'text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-white/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
                  <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
