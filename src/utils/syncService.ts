import { supabase, type SyncStatus, type SyncConfig } from './supabaseClient';
import { db } from '../db/schema';
import type { User, Class, Student, Reminder, ReminderAssignment, Notification, Event } from '../types';

class SyncService {
  private syncStatus: SyncStatus = {
    lastSync: null,
    isOnline: navigator.onLine,
    pendingChanges: 0,
    syncInProgress: false
  };

  private config: SyncConfig = {
    enabled: false,
    autoSync: true,
    syncInterval: 5 // 5 minutes
  };

  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Écouter les changements de connexion
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true;
      if (this.config.enabled && this.config.autoSync) {
        this.syncToCloud();
      }
    });

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
    });

    // Charger la configuration depuis localStorage
    this.loadConfig();
  }

  // Configuration
  enableSync(config: Partial<SyncConfig> = {}) {
    this.config = { ...this.config, ...config, enabled: true };
    this.saveConfig();
    
    if (this.config.autoSync) {
      this.startAutoSync();
    }
    
    console.log('🔄 Synchronisation Supabase activée');
  }

  disableSync() {
    this.config.enabled = false;
    this.saveConfig();
    this.stopAutoSync();
    console.log('⏸️ Synchronisation Supabase désactivée');
  }

  private startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.syncInProgress) {
        this.syncToCloud();
      }
    }, this.config.syncInterval * 60 * 1000);
  }

  private stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Synchronisation vers le cloud
  async syncToCloud(): Promise<boolean> {
    if (!this.config.enabled || !this.syncStatus.isOnline || this.syncStatus.syncInProgress) {
      return false;
    }

    this.syncStatus.syncInProgress = true;
    
    try {
      console.log('🔄 Début de la synchronisation vers Supabase...');
      
      // Synchroniser chaque table
      await this.syncTable('users', await db.users.toArray());
      await this.syncTable('classes', await db.classes.toArray());
      await this.syncTable('students', await db.students.toArray());
      await this.syncTable('reminders', await db.reminders.toArray());
      await this.syncTable('reminder_assignments', await db.reminderAssignments.toArray());
      await this.syncTable('notifications', await db.notifications.toArray());
      await this.syncTable('events', await db.events.toArray());
      
      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingChanges = 0;
      
      console.log('✅ Synchronisation terminée avec succès');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      return false;
    } finally {
      this.syncStatus.syncInProgress = false;
    }
  }

  // Synchronisation depuis le cloud
  async syncFromCloud(): Promise<boolean> {
    if (!this.config.enabled || !this.syncStatus.isOnline || this.syncStatus.syncInProgress) {
      return false;
    }

    this.syncStatus.syncInProgress = true;
    
    try {
      console.log('🔄 Début de la synchronisation depuis Supabase...');
      
      // Récupérer les données du cloud
      const [users, classes, students, reminders, reminderAssignments, notifications, events] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('classes').select('*'),
        supabase.from('students').select('*'),
        supabase.from('reminders').select('*'),
        supabase.from('reminder_assignments').select('*'),
        supabase.from('notifications').select('*'),
        supabase.from('events').select('*')
      ]);

      // Mettre à jour la base locale
      if (users.data) await this.updateLocalTable('users', users.data);
      if (classes.data) await this.updateLocalTable('classes', classes.data);
      if (students.data) await this.updateLocalTable('students', students.data);
      if (reminders.data) await this.updateLocalTable('reminders', reminders.data);
      if (reminderAssignments.data) await this.updateLocalTable('reminder_assignments', reminderAssignments.data);
      if (notifications.data) await this.updateLocalTable('notifications', notifications.data);
      if (events.data) await this.updateLocalTable('events', events.data);
      
      this.syncStatus.lastSync = new Date();
      
      console.log('✅ Synchronisation depuis le cloud terminée');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation depuis le cloud:', error);
      return false;
    } finally {
      this.syncStatus.syncInProgress = false;
    }
  }

  private async syncTable(tableName: string, data: any[]) {
    const { error } = await supabase
      .from(tableName)
      .upsert(data, { onConflict: 'id' });
    
    if (error) {
      throw new Error(`Erreur sync ${tableName}: ${error.message}`);
    }
  }

  private async updateLocalTable(tableName: string, data: any[]) {
    switch (tableName) {
      case 'users':
        await db.users.clear();
        await db.users.bulkAdd(data);
        break;
      case 'classes':
        await db.classes.clear();
        await db.classes.bulkAdd(data);
        break;
      case 'students':
        await db.students.clear();
        await db.students.bulkAdd(data);
        break;
      case 'reminders':
        await db.reminders.clear();
        await db.reminders.bulkAdd(data);
        break;
      case 'reminder_assignments':
        await db.reminderAssignments.clear();
        await db.reminderAssignments.bulkAdd(data);
        break;
      case 'notifications':
        await db.notifications.clear();
        await db.notifications.bulkAdd(data);
        break;
      case 'events':
        await db.events.clear();
        await db.events.bulkAdd(data);
        break;
    }
  }

  // Synchronisation bidirectionnelle intelligente
  async smartSync(): Promise<boolean> {
    if (!this.config.enabled || !this.syncStatus.isOnline) {
      return false;
    }

    try {
      // D'abord synchroniser vers le cloud (données locales prioritaires)
      await this.syncToCloud();
      
      // Puis récupérer les éventuelles nouvelles données du cloud
      await this.syncFromCloud();
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation intelligente:', error);
      return false;
    }
  }

  // Getters pour l'état
  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  getConfig(): SyncConfig {
    return { ...this.config };
  }

  // Gestion de la configuration
  private saveConfig() {
    localStorage.setItem('gai-sync-config', JSON.stringify(this.config));
  }

  private loadConfig() {
    const saved = localStorage.getItem('gai-sync-config');
    if (saved) {
      this.config = { ...this.config, ...JSON.parse(saved) };
    }
  }

  // Test de connexion
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export const syncService = new SyncService();