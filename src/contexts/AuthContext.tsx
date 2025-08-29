import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/schema';
import type { AuthUser } from '../types/auth';
import { getRoleByUserType } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('gai_auth_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Update role to latest structure
      parsedUser.role = getRoleByUserType(parsedUser.type_utilisateur);
      setUser(parsedUser);
      // Save updated user back to localStorage
      localStorage.setItem('gai_auth_user', JSON.stringify(parsedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try Supabase first if available
      try {
        const { supabase } = await import('../utils/supabaseClient');
        const { data: supabaseUsers, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        
        if (!error && supabaseUsers && supabaseUsers.password === password) {
          const authUser: AuthUser = {
            id: supabaseUsers.id,
            email: supabaseUsers.email,
            nom: supabaseUsers.nom,
            prenom: supabaseUsers.prenom,
            type_utilisateur: supabaseUsers.type_utilisateur,
            role: getRoleByUserType(supabaseUsers.type_utilisateur)
          };
          setUser(authUser);
          localStorage.setItem('gai_auth_user', JSON.stringify(authUser));
          
          // Force full sync from cloud after successful login
          try {
            const { syncService } = await import('../utils/syncService');
            console.log('🔄 Syncing data from cloud...');
            await syncService.syncFromCloud();
            console.log('✅ Data synced from cloud after login');
          } catch (syncError) {
            console.log('⚠️ Could not sync data from cloud:', syncError);
          }
          
          return true;
        }
      } catch (supabaseError) {
        console.log('Supabase not available, trying local data');
      }

      // Fallback to local IndexedDB
      const dbUser = await db.users.where('email').equals(email).first();
      if (dbUser && dbUser.password === password) {
        const authUser: AuthUser = {
          id: dbUser.id!,
          email: dbUser.email,
          nom: dbUser.nom,
          prenom: dbUser.prenom,
          type_utilisateur: dbUser.type_utilisateur as any,
          role: getRoleByUserType(dbUser.type_utilisateur)
        };
        setUser(authUser);
        localStorage.setItem('gai_auth_user', JSON.stringify(authUser));
        
        // If local login but no data, try to sync from cloud
        try {
          const userCount = await db.users.count();
          if (userCount <= 1) { // Only the logged-in user exists
            const { syncService } = await import('../utils/syncService');
            console.log('🔄 Local database seems empty, syncing from cloud...');
            await syncService.syncFromCloud();
            console.log('✅ Data synced from cloud');
          }
        } catch (syncError) {
          console.log('⚠️ Could not sync from cloud:', syncError);
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = async () => {
    // Sync local changes to cloud before logout
    try {
      const { syncService } = await import('../utils/syncService');
      await syncService.syncToCloud();
      console.log('✅ Data synced to cloud before logout');
    } catch (syncError) {
      console.log('⚠️ Could not sync data to cloud:', syncError);
    }
    
    setUser(null);
    localStorage.removeItem('gai_auth_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};