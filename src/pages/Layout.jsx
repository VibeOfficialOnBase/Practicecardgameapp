import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/supabase';
import Header from '../components/layout/Header';
import BottomNav from '../components/common/BottomNav';
import SparklesBackground from '../components/particles/SparklesBackground';
import MagicalParticles from '../components/particles/MagicalParticles';
import OfflineIndicator from '../components/OfflineIndicator';
import InstallPrompt from '../components/InstallPrompt';
import NotificationManager from '../components/notifications/NotificationManager';

export default function Layout({ children, currentPageName }) {
  const { user } = useAuth();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.id || user.email);
          setUserProfile(profile);
          if (profile?.theme) {
            if (profile.theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        } catch (err) {
          console.error('Failed to load profile', err);
        }
      }
    };
    loadProfile();
  }, [user]);

  // Determine if we should show the header/nav based on route (e.g. hide on login/signup if handled there, but Layout wraps all?)
  // Assuming Layout wraps authenticated routes mainly.
  const isGame = location.pathname.includes('ChakraBlaster') || location.pathname.includes('VibeAGotchi');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans">
      
      {/* Global Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 opacity-10 dark:opacity-100 transition-opacity duration-500" />
        <SparklesBackground />
        <MagicalParticles />
      </div>

      <OfflineIndicator />
      <InstallPrompt />
      {user && <NotificationManager userEmail={user.email} />}

      {!isGame && <Header />}

      <main
        className={`max-w-6xl mx-auto min-h-screen relative px-4 pb-24 transition-all duration-300 ${
            !isGame ? 'pt-20 sm:pt-24' : ''
        }`}
      >
        {children}
      </main>

      {!isGame && <BottomNav />}
    </div>
  );
}
