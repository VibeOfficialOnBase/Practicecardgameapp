import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isDemoMode } from '@/lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get registered users from localStorage in demo mode
  const getRegisteredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('demo_registered_users') || '[]');
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        const parsedSession = JSON.parse(demoSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (data) => {
    if (isDemoMode) {
      const users = getRegisteredUsers();
      const existingUser = users.find(u => u.email === data.email);

      if (!existingUser) {
        return { data: { user: null, session: null }, error: { message: "User not registered. Please sign up or use Google." } };
      }

      // Simple password check (in a real app this would be hashed, but for demo mode strictness, we can check basic match if we stored it,
      // but to follow the prompt's spirit of "unregistered user", checking email existence is the main step.
      // The previous implementation allowed ANY email. Now we restrict to registered ones.
      // We didn't store passwords in the previous mock, so we'll trust the password if the user exists for now,
      // OR we can update signUp to store the password. Let's update signUp to store it for consistency.)
      if (existingUser.password !== data.password) {
         return { data: { user: null, session: null }, error: { message: "Invalid credentials." } };
      }

      const mockSession = {
        access_token: 'demo-token',
        user: existingUser,
      };

      localStorage.setItem('demo_session', JSON.stringify(mockSession));
      setSession(mockSession);
      setUser(existingUser);
      return { data: { user: existingUser, session: mockSession }, error: null };
    }
    return supabase.auth.signInWithPassword(data);
  };

  const signUp = async (data) => {
    if (isDemoMode) {
      const users = getRegisteredUsers();
      if (users.find(u => u.email === data.email)) {
        return { data: { user: null, session: null }, error: { message: "User already exists." } };
      }

      const mockUser = {
        id: `demo-user-${Date.now()}`,
        email: data.email,
        password: data.password, // Storing password in local storage for demo verification
        user_metadata: data.options?.data || {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      users.push(mockUser);
      localStorage.setItem('demo_registered_users', JSON.stringify(users));

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
        // For Google login in demo mode, we can auto-register them if they don't exist,
        // effectively treating it as "Sign up or Login with Google"
        const email = 'demo@gmail.com';
        let users = getRegisteredUsers();
        let user = users.find(u => u.email === email);

        if (!user) {
            user = {
                id: 'demo-google-user-id',
                email: email,
                user_metadata: { full_name: 'Google Demo User' },
                aud: 'authenticated',
                created_at: new Date().toISOString(),
                app_metadata: { provider: 'google' }
            };
            users.push(user);
            localStorage.setItem('demo_registered_users', JSON.stringify(users));
        }

        const mockSession = {
            access_token: 'demo-google-token',
            user: user,
        };

        localStorage.setItem('demo_session', JSON.stringify(mockSession));
        setSession(mockSession);
        setUser(user);
        return { data: { user: user, session: mockSession }, error: null };
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
