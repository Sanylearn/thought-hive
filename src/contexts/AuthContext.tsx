
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  avatar_url?: string;
  full_name?: string;
}

interface AuthContextProps {
  user: any | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session and set the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      console.log("Auth session check:", session?.user ? `User logged in: ${session.user.email}` : "No active session");
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change event:", _event);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      console.log(`Fetching profile for user ID: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Profile fetched successfully:", data.role);
        setProfile(data as UserProfile);
      } else {
        console.log("No profile found for this user");
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log(`Attempting to sign in user: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }

      if (data.user) {
        console.log("User signed in successfully:", data.user.email);
        
        // Fetch the profile to check role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile after login:", profileError);
        } else if (profileData && profileData.role !== 'admin') {
          // If not admin, sign them out
          console.log(`User role: ${profileData.role} - Not an admin, signing out`);
          await supabase.auth.signOut();
          throw new Error("Access denied. Only administrators can access this area.");
        } else {
          console.log("Admin access granted");
          toast({
            title: "Successfully logged in",
            description: "Welcome back!",
          });
          navigate('/admin');
        }
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw to allow handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
