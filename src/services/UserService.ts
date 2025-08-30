import { supabase } from '../utils/supabaseClient';
import { indexedDBService } from './IndexedDBService';
import { offlineService } from './OfflineService';
import type { User } from '../types';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getList(): Promise<User[]> {
    // Always return cached data first (offline-first)
    const cachedUsers = await indexedDBService.getCachedUsers();
    
    // If online, sync in background
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          await indexedDBService.cacheUsers(data);
          return data;
        }
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
    
    return cachedUsers;
  }

  async getOne(id: number): Promise<User | null> {
    // Try local first
    const cachedUser = await indexedDBService.getById<User>('users', id);
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          await indexedDBService.put('users', data);
          return data;
        }
      } catch (error) {
        console.warn('Failed to fetch user from cloud:', error);
      }
    }
    
    return cachedUser;
  }

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const tempId = Date.now(); // Temporary ID for offline
    const newUser: User = {
      ...user,
      id: tempId,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Always save locally first
    await indexedDBService.put('users', newUser);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert({
            ...user,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && data) {
          // Replace temp record with real one
          await indexedDBService.delete('users', tempId);
          await indexedDBService.put('users', data);
          return data;
        }
      } catch (error) {
        // Queue for later sync
        await offlineService.queueOperation({
          table: 'users',
          operation: 'create',
          data: user
        });
      }
    } else {
      // Queue for later sync
      await offlineService.queueOperation({
        table: 'users',
        operation: 'create',
        data: user
      });
    }

    return newUser;
  }

  async update(id: number, updates: Partial<User>): Promise<User> {
    // Get current user and update locally first
    const currentUser = await indexedDBService.getById<User>('users', id);
    if (!currentUser) throw new Error('User not found');

    const updatedUser = {
      ...currentUser,
      ...updates,
      updated_at: new Date()
    };

    await indexedDBService.put('users', updatedUser);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.put('users', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'users',
          operation: 'update',
          data: updates,
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'users',
        operation: 'update',
        data: updates,
        recordId: id
      });
    }

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    // Delete locally first
    await indexedDBService.delete('users', id);

    if (offlineService.getOnlineStatus()) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        await offlineService.queueOperation({
          table: 'users',
          operation: 'delete',
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'users',
        operation: 'delete',
        recordId: id
      });
    }
  }

  async getByType(type: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('type_utilisateur', type)
      .order('nom', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async search(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%,email.ilike.%${query}%`)
      .order('nom', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export const userService = UserService.getInstance();