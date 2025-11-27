import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Award, BarChart3, Gift, Trophy, Users, Heart,
  Calendar, Info, Menu, X, LogOut, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Desktop navigation: Pull Cards, Wins, Stats, Giveaway, Board, Social, Profile, Calendar, About
  const navItems = [
    { name: 'Pull Cards', icon: Sparkles, path: 'PullCards' },
    { name: 'Wins', icon: Award, path: 'Wins' },
    { name: 'Stats', icon: BarChart3, path: 'Stats' },
    { name: 'Giveaway', icon: Gift, path: 'Giveaway' },
    { name: 'Board', icon: Trophy, path: 'Board' },
    { name: 'Social', icon: Users, path: 'Social' },
    { name: 'Profile', icon: Heart, path: 'Profile' },
    { name: 'Calendar', icon: Calendar, path: 'Calendar' },
    { name: 'About', icon: Info, path: 'About' },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname.toLowerCase();
    const targetPath = path.toLowerCase();
    
    // Root path matches PullCards
    if (targetPath === 'pullcards' && (currentPath === '/' || currentPath === '/pullcards' || currentPath === '/pull' || currentPath === '/practice')) return true;
    if (targetPath === 'wins' && (currentPath === '/wins' || currentPath === '/achievements')) return true;
    if (targetPath === 'stats' && (currentPath === '/stats' || currentPath === '/leaderboard')) return true;
    if (targetPath === 'giveaway' && (currentPath === '/giveaway' || currentPath === '/giveaways' || currentPath === '/premiumpacks')) return true;
    if (targetPath === 'board' && (currentPath === '/board' || currentPath === '/games')) return true;
    if (targetPath === 'social' && (currentPath === '/social' || currentPath === '/community')) return true;
    
    return currentPath.includes(targetPath);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 safe-area-top">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/95 via-purple-900/95 to-slate-900/95 backdrop-blur-lg border-b border-white/10" />

      <div className="relative max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg group-hover:animate-logo-glow transition-all">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
             <div className="absolute inset-0.5 bg-black rounded-full flex items-center justify-center text-xs font-bold text-white">
                V
             </div>
          </div>
          <span className="font-heading text-xl tracking-widest font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 animate-practice-glow">
            PRACTICE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-white/20 text-white shadow-lg scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="lg:hidden flex items-center gap-2">
           {/* Hamburger Menu */}
           <button
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
           >
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-16 left-0 right-0 bg-gradient-to-b from-indigo-950/98 to-purple-900/98 backdrop-blur-xl border-b border-white/10 z-50 overflow-hidden rounded-b-2xl shadow-2xl"
            >
              <div className="flex flex-col py-2">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.path)}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 px-6 py-3 transition-all ${
                        active
                          ? 'bg-white/20 text-white border-l-4 border-purple-400'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-purple-300' : ''}`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}

                <div className="h-px bg-white/10 my-2 mx-6" />

                <button
                    onClick={() => { signOut(); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 px-6 py-3 text-red-300 hover:bg-white/5 hover:text-red-200 transition-colors text-left w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
