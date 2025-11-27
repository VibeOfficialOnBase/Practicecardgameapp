import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, BarChart3, Menu, Gift, Trophy, Users, Heart, Calendar, Info, X } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Primary bottom tabs: Pull Cards, Wins, Stats
  const primaryItems = [
    { name: 'Pull Cards', path: 'PullCards', icon: Sparkles },
    { name: 'Wins', path: 'Wins', icon: Award },
    { name: 'Stats', path: 'Stats', icon: BarChart3 },
  ];

  // Dropdown menu items: Giveaway, Board, Social, Profile, Calendar, About
  const menuItems = [
    { name: 'Giveaway', path: 'Giveaway', icon: Gift },
    { name: 'Board', path: 'Board', icon: Trophy },
    { name: 'Social', path: 'Social', icon: Users },
    { name: 'Profile', path: 'Profile', icon: Heart },
    { name: 'Calendar', path: 'Calendar', icon: Calendar },
    { name: 'About', path: 'About', icon: Info },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname.toLowerCase();
    const targetPath = path.toLowerCase();

    if (targetPath === 'pullcards' && (currentPath === '/' || currentPath === '/pullcards' || currentPath === '/pull' || currentPath === '/practice')) return true;
    if (targetPath === 'wins' && (currentPath === '/wins' || currentPath === '/achievements')) return true;
    if (targetPath === 'stats' && (currentPath === '/stats' || currentPath === '/leaderboard')) return true;
    if (targetPath === 'giveaway' && (currentPath === '/giveaway' || currentPath === '/giveaways' || currentPath === '/premiumpacks')) return true;
    if (targetPath === 'board' && (currentPath === '/board' || currentPath === '/games')) return true;
    if (targetPath === 'social' && (currentPath === '/social' || currentPath === '/community')) return true;
    
    return currentPath.includes(targetPath);
  };

  const isMenuItemActive = menuItems.some(item => isActive(item.path));

  return (
    <>
      {/* Dropdown Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-20 left-4 right-4 bg-gradient-to-b from-indigo-950/98 to-purple-900/98 backdrop-blur-xl border border-white/10 rounded-2xl z-50 overflow-hidden shadow-2xl lg:hidden"
            >
              <div className="p-2">
                <div className="grid grid-cols-3 gap-2">
                  {menuItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={createPageUrl(item.path)}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-1 ${active ? 'text-purple-300' : ''}`} />
                        <span className="text-xs font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none lg:hidden">
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        <div className="bg-indigo-950/95 backdrop-blur-xl border-t border-white/10 pointer-events-auto pb-safe">
          <div className="flex items-center justify-around">
            {/* Primary Navigation Items */}
            {primaryItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  to={createPageUrl(item.path)}
                  key={item.name}
                  className="relative flex flex-col items-center justify-center w-20 h-[56px] group shrink-0"
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

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative flex flex-col items-center justify-center w-20 h-[56px] group shrink-0"
            >
              {isMenuItemActive && !isMenuOpen && (
                <motion.div
                  layoutId="mobile-nav-menu-glow"
                  className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-t-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <motion.div
                animate={{
                  y: isMenuOpen ? -2 : 0,
                  scale: isMenuOpen ? 1.1 : 1
                }}
                className={`relative z-10 flex flex-col items-center gap-1 ${
                  isMenuOpen || isMenuItemActive ? 'text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-white/50'
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
                <span className="text-[9px] font-medium tracking-wide whitespace-nowrap">
                  {isMenuOpen ? 'Close' : 'More'}
                </span>
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
