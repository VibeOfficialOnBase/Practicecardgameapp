import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, Zap, User, Users } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: 'Practice', icon: Home },
    { name: 'Games', path: 'Games', icon: Zap },
    { name: 'Social', path: 'Community', icon: Users },
    { name: 'Profile', path: 'Profile', icon: User }
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 z-50 pointer-events-none flex justify-center">
      <div className="bg-[var(--bg-primary)]/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.15)] rounded-[32px] px-6 py-4 pointer-events-auto flex items-center gap-2 md:gap-8 w-full max-w-md justify-between">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link to={createPageUrl(item.path)} key={item.path} className="relative group">
              <div className={`relative z-10 p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                <item.icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
              </div>
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white shadow-sm rounded-2xl -z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
