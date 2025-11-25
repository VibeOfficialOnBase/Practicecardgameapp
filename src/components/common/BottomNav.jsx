import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Award, BarChart3, Gift, Users, User, Trophy, Calendar, Gamepad2 } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const location = useLocation();

  // Full list of 9 items for mobile scrollable nav
  const navItems = [
    { name: 'Pull', path: 'Practice', icon: Home },
    { name: 'Cards', path: 'MyCards', icon: BookOpen },
    { name: 'Stats', path: 'Leaderboard', icon: BarChart3 },
    { name: 'Board', path: 'Games', icon: Trophy },
    { name: 'Giveaways', path: 'PremiumPacks', icon: Gift },
    { name: 'Social', path: 'Community', icon: Users },
    { name: 'Profile', path: 'Profile', icon: User },
    { name: 'Games', path: 'Games', icon: Gamepad2 },
    { name: 'Calendar', path: 'Calendar', icon: Calendar }
  ];

  const isActive = (path) => {
    if (path === 'Practice' && (location.pathname === '/' || location.pathname === '/Practice')) return true;
    return location.pathname.includes(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none lg:hidden">
      {/* Gradient fade at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      <div className="bg-indigo-950/95 backdrop-blur-xl border-t border-white/10 pointer-events-auto pb-safe overflow-x-auto no-scrollbar">
        <div className="flex items-center px-2 py-1 min-w-max">
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
