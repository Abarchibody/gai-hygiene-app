import { supabase } from '../utils/supabaseClient';
import type { User } from '../types';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // First try Supabase auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        // Fallback to local user lookup
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError || !users) {
          return { user: null, error: 'Email ou mot de passe incorrect' };
        }

        // Simple password check (in production, use proper hashing)
        if (users.password !== password) {
          return { user: null, error: 'Email ou mot de passe incorrect' };
        }

        this.currentUser = users;
        return { user: users, error: null };
      }

      // Get user profile from our users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError || !userProfile) {
        return { user: null, error: 'Profil utilisateur non trouvé' };
      }

      this.currentUser = userProfile;
      return { user: userProfile, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Erreur de connexion' };
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
      this.currentUser = null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.type_utilisateur === role;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isTeacher(): boolean {
    return this.hasRole('Enseignant');
  }

  isParent(): boolean {
    return this.hasRole('Parent');
  }

  isStudent(): boolean {
    return this.hasRole('Élève');
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error: string | null }> {
    if (!this.currentUser) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      // Check old password
      if (this.currentUser.password !== oldPassword) {
        return { success: false, error: 'Ancien mot de passe incorrect' };
      }

      // Update password in database
      const { error } = await supabase
        .from('users')
        .update({ password: newPassword, updated_at: new Date().toISOString() })
        .eq('id', this.currentUser.id);

      if (error) {
        return { success: false, error: 'Erreur lors de la mise à jour' };
      }

      // Update current user
      this.currentUser.password = newPassword;
      return { success: true, error: null };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Erreur système' };
    }
  }

  async updateProfile(
    updates: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    if (!this.currentUser) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', this.currentUser.id);

      if (error) {
        return { success: false, error: 'Erreur lors de la mise à jour' };
      }

      // Update current user
      this.currentUser = { ...this.currentUser, ...updates };
      return { success: true, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Erreur système' };
    }
  }
}

export const authService = AuthService.getInstance();
