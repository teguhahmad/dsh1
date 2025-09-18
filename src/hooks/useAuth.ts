import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, getProfile } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'superadmin';
  managed_accounts: string[];
  created_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check current session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) setLoading(false);
          return;
        }

        if (session?.user) {
          const { data: profileData, error: profileError } = await getProfile(session.user.id);
          
          if (profileError) {
            console.error('Profile error:', profileError);
            // If profile doesn't exist, create a basic user object
            if (mounted) {
              setUser({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'user',
                managed_accounts: [],
                created_at: new Date().toISOString(),
              });
            }
          } else if (profileData && mounted) {
            setProfile(profileData);
            setUser({
              id: session.user.id,
              name: profileData.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: profileData.is_super_admin ? 'superadmin' : 'user',
              managed_accounts: [],
              created_at: profileData.created_at,
            });
          }
        } else if (mounted) {
          // No session, user is not logged in
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);

        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
          const { data: profileData, error: profileError } = await getProfile(session.user.id);
          
          if (profileError) {
            console.error('Profile fetch error on sign in:', profileError);
            // Create basic user if profile doesn't exist
            setUser({
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: 'user',
              managed_accounts: [],
              created_at: new Date().toISOString(),
            });
          } else if (profileData) {
            setProfile(profileData);
            setUser({
              id: session.user.id,
              name: profileData.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: profileData.is_super_admin ? 'superadmin' : 'user',
              managed_accounts: [],
              created_at: profileData.created_at,
            });
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  };
};