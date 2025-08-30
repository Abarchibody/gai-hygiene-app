import { supabase } from '../utils/supabaseClient';
import { indexedDBService } from './IndexedDBService';
import { offlineService } from './OfflineService';
import type { Notification } from '../types';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getList(): Promise<Notification[]> {
    const cachedNotifications = await indexedDBService.getCachedNotifications();
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('scheduled_at', { ascending: false });

        if (!error && data) {
          await indexedDBService.cacheNotifications(data);
          return data;
        }
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
    
    return cachedNotifications;
  }

  async getOne(id: number): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const tempId = Date.now();
    const newNotification: Notification = {
      ...notification,
      id: tempId,
      created_at: new Date()
    };

    await indexedDBService.put('notifications', newNotification);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert({
            ...notification,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.delete('notifications', tempId);
          await indexedDBService.put('notifications', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'notifications',
          operation: 'create',
          data: notification
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'notifications',
        operation: 'create',
        data: notification
      });
    }

    return newNotification;
  }

  async update(id: number, updates: Partial<Notification>): Promise<Notification> {
    const currentNotification = await indexedDBService.getById<Notification>('notifications', id);
    if (!currentNotification) throw new Error('Notification not found');

    const updatedNotification = {
      ...currentNotification,
      ...updates
    };

    await indexedDBService.put('notifications', updatedNotification);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.put('notifications', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'notifications',
          operation: 'update',
          data: updates,
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'notifications',
        operation: 'update',
        data: updates,
        recordId: id
      });
    }

    return updatedNotification;
  }

  async delete(id: number): Promise<void> {
    await indexedDBService.delete('notifications', id);

    if (offlineService.getOnlineStatus()) {
      try {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        await offlineService.queueOperation({
          table: 'notifications',
          operation: 'delete',
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'notifications',
        operation: 'delete',
        recordId: id
      });
    }
  }

  async getForUser(userId: number): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPending(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async markAsSent(id: number): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  async markAsRead(id: number): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  async markAsFailed(id: number, errorMessage?: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        status: 'failed',
        error_message: errorMessage
      })
      .eq('id', id);

    if (error) throw error;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async sendBrowserNotification(title: string, body: string, icon?: string): Promise<boolean> {
    if (!await this.requestPermission()) {
      return false;
    }

    try {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico'
      });
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }
}

export const notificationService = NotificationService.getInstance();