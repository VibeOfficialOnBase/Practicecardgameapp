import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isDemoMode } from '@/lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In demo mode, simulate a session if one was "stored" (not really possible without local storage mock,
    // but for now we just start unauthenticated or let the mock login handle it)
    if (isDemoMode) {
      // Check if we have a "demo session" in localStorage
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        const parsedSession = JSON.parse(demoSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
      }
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (data) => {
    if (isDemoMode) {
      // Mock successful login
      const mockUser = {
        id: 'demo-user-id',
        email: data.email,
        user_metadata: { full_name: 'Demo User' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      const mockSession = {
        access_token: 'demo-token',
        user: mockUser,
      };

      localStorage.setItem('demo_session', JSON.stringify(mockSession));
      setSession(mockSession);
      setUser(mockUser);
      return { data: { user: mockUser, session: mockSession }, error: null };
    }
    return supabase.auth.signInWithPassword(data);
  };

  const signUp = async (data) => {
    if (isDemoMode) {
      // Mock successful signup
      const mockUser = {
        id: 'demo-user-id',
        email: data.email,
        user_metadata: data.options?.data || {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      const mockSession = {
        access_token: 'demo-token',
        user: mockUser,
      };

      localStorage.setItem('demo_session', JSON.stringify(mockSession));
      setSession(mockSession);
      setUser(mockUser);
      return { data: { user: mockUser, session: mockSession }, error: null };
    }
    return supabase.auth.signUp(data);
  };

  const signOut = async () => {
    if (isDemoMode) {
      localStorage.removeItem('demo_session');
      setSession(null);
      setUser(null);
      return { error: null };
    }
    return supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    if (isDemoMode) {
        const mockUser = {
            id: 'demo-google-user-id',
            email: 'demo@gmail.com',
            user_metadata: { full_name: 'Google Demo User' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            app_metadata: { provider: 'google' }
        };
        const mockSession = {
            access_token: 'demo-google-token',
            user: mockUser,
        };

        localStorage.setItem('demo_session', JSON.stringify(mockSession));
        setSession(mockSession);
        setUser(mockUser);
        return { data: { user: mockUser, session: mockSession }, error: null };
    }
    return supabase.auth.signInWithOAuth({
        provider: 'google',
    });
  }

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
