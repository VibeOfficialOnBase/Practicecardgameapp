
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { Home, Sparkles, Users, Trophy, Settings, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import OfflineIndicator from '../components/OfflineIndicator';
import InstallPrompt from '../components/InstallPrompt';
import CosmicBackground from '../components/CosmicBackground';
import BackgroundLayers from '../components/BackgroundLayers';
import XPBar from '../components/XPBar';
import NotificationManager from '../components/notifications/NotificationManager';

export default function Layout({ children, currentPageName }) {
  const [theme, setTheme] = React.useState('light');
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        const profiles = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
        if (profiles[0]?.theme) {
          setTheme(profiles[0].theme);
          document.body.className = profiles[0].theme === 'dark' ? 'dark' : '';
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
    
    document.body.className = theme === 'dark' ? 'dark' : '';

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);
  
  React.useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const navItems = [
    { name: 'Home', icon: Home, path: 'Dashboard' },
    { name: 'Practice', icon: Sparkles, path: 'Practice' },
    { name: 'Games', icon: Zap, path: 'Games' },
    { name: 'Community', icon: Users, path: 'Community' },
    { name: 'Profile', icon: Settings, path: 'Profile' }
  ];

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {isDark && <CosmicBackground />}
      {!isDark && <BackgroundLayers />}
      
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 ${isDark ? '' : 'bg-gradient-to-br from-[#FAF8FF] via-[#F5F0FF] to-[#EDE7FF]'}`}></div>
        
        <div className={`absolute inset-0 ${isDark ? 'opacity-40' : 'opacity-25'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(169,116,255,0.4),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(107,140,255,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(184,153,255,0.3),transparent_50%)]"></div>
        </div>
        
        {!isDark && [...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() > 0.7 ? '4px' : '2px',
              height: Math.random() > 0.7 ? '4px' : '2px',
              background: 'radial-gradient(circle, rgba(169,116,255,0.6), transparent)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {!isDark && (
          <>
            <motion.div
              className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(169,116,255,0.5) 0%, rgba(107,140,255,0.3) 40%, transparent 70%)',
                filter: 'blur(90px)',
                opacity: 0.4,
              }}
              animate={{
                scale: [1, 1.4, 1],
                x: [0, 80, 0],
                y: [0, -50, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-40 left-20 w-[450px] h-[450px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(119,51,255,0.5) 0%, rgba(94,45,212,0.3) 40%, transparent 70%)',
                filter: 'blur(90px)',
                opacity: 0.4,
              }}
              animate={{
                scale: [1, 1.5, 1],
                x: [0, -70, 0],
                y: [0, 70, 0],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(184,153,255,0.4) 0%, rgba(230,212,255,0.2) 40%, transparent 70%)',
                filter: 'blur(100px)',
                transform: 'translate(-50%, -50%)',
                opacity: 0.3,
              }}
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 360, 0],
              }}
              transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>
      
      <OfflineIndicator />
      <InstallPrompt />
      {user && <NotificationManager userEmail={user.email} />}
      
      {(currentPageName === 'ChakraBlasterMax' || currentPageName === 'ChallengeBubbles' || currentPageName === 'MemoryMatch') && user && (
        <div className="fixed top-4 right-4 z-30">
          <XPBar userEmail={user.email} />
        </div>
      )}
      
      <main className="pb-24 pt-6 px-4 max-w-6xl mx-auto">
        {children}
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-2xl z-50 border-t safe-area-bottom`} style={{ 
        background: isDark ? 'rgba(8, 3, 19, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? 'rgba(169, 116, 255, 0.3)' : 'rgba(119, 51, 255, 0.15)',
        boxShadow: isDark ? '0 -4px 32px rgba(138, 75, 255, 0.4)' : '0 -4px 32px rgba(119, 51, 255, 0.1)',
        width: '100%',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div className="w-full max-w-6xl mx-auto px-1 sm:px-4">
          <div className="flex items-center justify-between py-1.5 sm:py-3 gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex flex-col items-center gap-0.5 px-1 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl transition-all duration-300 relative ${
                    isActive
                      ? 'scale-105 sm:scale-110'
                      : ''
                  }`}
                  style={{
                    color: isActive ? '#FFFFFF' : (isDark ? '#C7B1FF' : '#7733FF'),
                    minWidth: 'fit-content',
                    flex: '1 1 0',
                    maxWidth: '80px'
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navHighlight"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl sm:rounded-2xl"
                      style={{ boxShadow: '0 0 20px rgba(169, 116, 255, 0.4)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="relative z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Icon 
                      className={`w-4 h-4 sm:w-6 sm:h-6 transition-all ${
                        isActive ? 'drop-shadow-[0_0_8px_rgba(216,180,255,0.6)]' : ''
                      }`} 
                      style={{
                        fill: isActive ? '#F2D6FF' : 'none'
                      }}
                    />
                  </motion.div>
                  <span className={`text-[9px] sm:text-xs font-medium font-heading relative z-10 whitespace-nowrap ${
                    isActive ? 'font-semibold' : ''
                  }`}
                  style={{
                    textShadow: isActive ? '0 0 10px rgba(216,180,255,0.5)' : 'none'
                  }}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="text-center py-4 text-xs ensure-readable" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        Built by Eddie Pabon
      </div>
    </div>
  );
}
