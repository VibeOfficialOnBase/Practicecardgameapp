import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/supabase';
import BottomNav from '../components/common/BottomNav';
import OfflineIndicator from '../components/OfflineIndicator';
import InstallPrompt from '../components/InstallPrompt';
import NotificationManager from '../components/notifications/NotificationManager';

export default function Layout({ children, currentPageName }) {
  const { user } = useAuth();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);

  // Determine current page name if not provided
  // This helps finding active nav item if currentPageName prop is missing
  const pageName = currentPageName || location.pathname.split('/').pop() || 'Practice';

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.id || user.email);
          setUserProfile(profile);
          // Apply theme if user has one saved
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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 pb-24">
      
      {/* Background Ambience - Minimal Ohara Style */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-primary)] opacity-5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-soft)] opacity-10 blur-[100px] rounded-full" />
      </div>

      <OfflineIndicator />
      <InstallPrompt />
      {user && <NotificationManager userEmail={user.email} />}

      <main className="max-w-md mx-auto min-h-screen relative px-4 pt-4 sm:pt-6">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
