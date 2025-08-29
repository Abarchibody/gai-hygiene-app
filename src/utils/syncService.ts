import { supabase, type SyncStatus, type SyncConfig } from './supabaseClient';
import { db } from '../db/schema';
import type {
  User,
  Class,
  Student,
  Reminder,
  ReminderAssignment,
  Notification,
  Event,
  SyncStatus as SyncStatusType,
  AppSetting
} from '../types';

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
      // Process offline settings queue when coming back online
      this.processOfflineSettingsQueue();
      if (this.config.enabled && this.config.autoSync) {
        this.syncToCloud();
      }
    });

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
    });

    // Charger la configuration depuis localStorage puis cloud
    this.loadConfig();
    this.initializeFromCloud();
  }

  // Configuration
  enableSync(config: Partial<SyncConfig> = {}) {
    this.config = { ...this.config, ...config, enabled: true };
    this.saveConfig();

    if (this.config.autoSync) {
      this.startAutoSync();
    }
  }

  disableSync() {
    this.config.enabled = false;
    this.saveConfig();
    this.stopAutoSync();
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
    if (
      !this.config.enabled ||
      !this.syncStatus.isOnline ||
      this.syncStatus.syncInProgress
    ) {
      return false;
    }

    this.syncStatus.syncInProgress = true;

    try {
      // Synchroniser chaque table
      await this.syncTable('users', await db.users.toArray());
      await this.syncTable('classes', await db.classes.toArray());
      await this.syncTable('students', await db.students.toArray());
      await this.syncTable('reminders', await db.reminders.toArray());
      await this.syncTable(
        'reminder_assignments',
        await db.reminderAssignments.toArray()
      );
      await this.syncTable('notifications', await db.notifications.toArray());
      await this.syncTable('events', await db.events.toArray());
      // Sync app_settings from Supabase (they are the source of truth)
      const { data: localSettings } = await supabase
        .from('app_settings')
        .select('*');
      if (localSettings) {
        await this.syncTable('app_settings', localSettings);
      }

      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingChanges = 0;

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
    if (
      !this.config.enabled ||
      !this.syncStatus.isOnline ||
      this.syncStatus.syncInProgress
    ) {
      return false;
    }

    this.syncStatus.syncInProgress = true;

    try {
      // Récupérer les données du cloud
      const [
        users,
        classes,
        students,
        reminders,
        reminderAssignments,
        notifications,
        events,
        appSettings
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('classes').select('*'),
        supabase.from('students').select('*'),
        supabase.from('reminders').select('*'),
        supabase.from('reminder_assignments').select('*'),
        supabase.from('notifications').select('*'),
        supabase.from('events').select('*'),
        supabase.from('app_settings').select('*')
      ]);

      // Mettre à jour la base locale
      if (users.data) await this.updateLocalTable('users', users.data);
      if (classes.data) await this.updateLocalTable('classes', classes.data);
      if (students.data) await this.updateLocalTable('students', students.data);
      if (reminders.data)
        await this.updateLocalTable('reminders', reminders.data);
      if (reminderAssignments.data)
        await this.updateLocalTable(
          'reminder_assignments',
          reminderAssignments.data
        );
      if (notifications.data)
        await this.updateLocalTable('notifications', notifications.data);
      if (events.data) await this.updateLocalTable('events', events.data);
      // Note: app_settings are managed directly in Supabase, no local copy needed

      this.syncStatus.lastSync = new Date();

      return true;
    } catch (error) {
      console.error(
        '❌ Erreur lors de la synchronisation depuis le cloud:',
        error
      );
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
      await this.updateSyncStatus(tableName, 'to_cloud', error.message);
      throw new Error(`Erreur sync ${tableName}: ${error.message}`);
    } else {
      await this.updateSyncStatus(tableName, 'to_cloud');
    }
  }

  private async updateSyncStatus(
    tableName: string,
    direction: 'to_cloud' | 'from_cloud' | 'bidirectional',
    error?: string
  ) {
    try {
      if (!this.config.enabled) return;

      const { data: existing } = await supabase
        .from('sync_status')
        .select('*')
        .eq('table_name', tableName)
        .single();

      if (existing) {
        await supabase
          .from('sync_status')
          .update({
            last_sync_at: new Date().toISOString(),
            last_sync_direction: direction,
            sync_count: existing.sync_count + 1,
            last_error: error || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('sync_status').insert({
          table_name: tableName,
          last_sync_at: new Date().toISOString(),
          last_sync_direction: direction,
          sync_count: 1,
          last_error: error || null
        });
      }
    } catch (syncError) {
      console.warn('Erreur mise à jour statut sync:', syncError);
    }
  }

  async getSyncHistory(): Promise<SyncStatusType[]> {
    try {
      if (!this.config.enabled) return [];

      const { data, error } = await supabase
        .from('sync_status')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn("Impossible de récupérer l'historique de sync:", error);
      return [];
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
      // app_settings are not stored locally, managed directly in Supabase
    }
  }

  // Synchronisation bidirectionnelle intelligente
  async smartSync(): Promise<boolean> {
    if (!this.config.enabled || !this.syncStatus.isOnline) {
      return false;
    }

    try {
      // Process offline settings queue first
      await this.processOfflineSettingsQueue();

      // D'abord synchroniser vers le cloud (données locales prioritaires)
      await this.syncToCloud();

      // Puis récupérer les éventuelles nouvelles données du cloud
      await this.syncFromCloud();

      // Synchroniser les paramètres depuis le cloud (cloud prioritaire)
      await this.syncSettingsFromCloud();

      // Mettre à jour le statut global
      await this.updateSyncStatus('all_tables', 'bidirectional');

      return true;
    } catch (error) {
      console.error(
        '❌ Erreur lors de la synchronisation intelligente:',
        error
      );
      return false;
    }
  }

  // Getters pour l'état
  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      if (!this.config.enabled) {
        return null;
      }

      const { data, error } = await supabase
        .from('sync_status')
        .select('last_sync_at')
        .not('last_sync_at', 'is', null)
        .order('last_sync_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching sync status:', error);
        return null;
      }

      if (!data || data.length === 0 || !data[0]?.last_sync_at) {
        return null;
      }

      const lastSync = new Date(data[0].last_sync_at);

      return lastSync;
    } catch (error) {
      console.error('Exception in getLastSyncTime:', error);
      return null;
    }
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

  private async initializeFromCloud() {
    try {
      // Charger l'intervalle de sync depuis le cloud
      const syncInterval = await this.getSetting('sync_interval');
      if (syncInterval && typeof syncInterval === 'number') {
        this.config.syncInterval = syncInterval;
      }

      // Charger l'état de sync depuis le cloud
      const syncEnabled = await this.getSetting('sync_enabled');
      if (syncEnabled === true && !this.config.enabled) {
        this.config.enabled = true;
      }
    } catch (error) {
      console.warn('Impossible de charger la config depuis le cloud:', error);
    }
  }

  // Test de connexion
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('users').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  // Sync automatique pour les opérations CRUD
  async syncRecordToCloud(
    tableName: string,
    record: any,
    operation: 'create' | 'update' | 'delete'
  ): Promise<boolean> {
    if (!this.config.enabled || !this.syncStatus.isOnline) {
      return false;
    }

    try {
      switch (operation) {
        case 'create':
        case 'update':
          const { error: upsertError } = await supabase
            .from(tableName)
            .upsert(record, { onConflict: 'id' });
          if (upsertError) throw upsertError;
          break;

        case 'delete':
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .eq('id', record.id);
          if (deleteError) throw deleteError;
          break;
      }

      await this.updateSyncStatus(tableName, 'to_cloud');

      return true;
    } catch (error) {
      console.warn(`❌ Erreur sync ${operation} ${tableName}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.updateSyncStatus(tableName, 'to_cloud', errorMessage);
      return false;
    }
  }

  // Méthodes helper pour chaque type d'opération
  async createRecord(tableName: string, record: any): Promise<boolean> {
    return this.syncRecordToCloud(tableName, record, 'create');
  }

  async updateRecord(tableName: string, record: any): Promise<boolean> {
    return this.syncRecordToCloud(tableName, record, 'update');
  }

  async deleteRecord(tableName: string, record: any): Promise<boolean> {
    return this.syncRecordToCloud(tableName, record, 'delete');
  }

  // Gestion des paramètres avec résolution de conflits
  async getSetting(key: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value, updated_at')
        .eq('key', key)
        .single();

      if (error) {
        // Fallback to localStorage for offline
        const cached = localStorage.getItem(`gai-setting-${key}`);
        return cached ? JSON.parse(cached) : null;
      }

      // Cache with timestamp for offline use
      localStorage.setItem(`gai-setting-${key}`, JSON.stringify(data.value));
      localStorage.setItem(`gai-setting-${key}-timestamp`, data.updated_at);

      return data?.value;
    } catch (error) {
      console.warn(`Impossible de récupérer le paramètre ${key}:`, error);
      const cached = localStorage.getItem(`gai-setting-${key}`);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async setSetting(
    key: string,
    value: any,
    category: string = 'general'
  ): Promise<void> {
    const now = new Date().toISOString();

    // Always save locally first
    localStorage.setItem(`gai-setting-${key}`, JSON.stringify(value));
    localStorage.setItem(`gai-setting-${key}-timestamp`, now);

    if (this.syncStatus.isOnline) {
      try {
        await this.syncSettingToCloud(key, value, category, now);
      } catch (error) {
        // Queue for later sync if online sync fails
        this.queueOfflineSettingUpdate(key, value, category, now);
      }
    } else {
      // Queue for sync when online
      this.queueOfflineSettingUpdate(key, value, category, now);
    }
  }

  private async syncSettingToCloud(
    key: string,
    value: any,
    category: string,
    timestamp: string
  ): Promise<void> {
    // Check for conflicts before updating
    const { data: existing } = await supabase
      .from('app_settings')
      .select('updated_at')
      .eq('key', key)
      .single();

    const localTimestamp = localStorage.getItem(`gai-setting-${key}-timestamp`);

    if (existing && localTimestamp) {
      const cloudTime = new Date(existing.updated_at).getTime();
      const localTime = new Date(localTimestamp).getTime();

      if (cloudTime > localTime) {
        return;
      }
    }

    const { error } = await supabase.from('app_settings').upsert(
      {
        key,
        value,
        category,
        updated_at: timestamp
      },
      { onConflict: 'key' }
    );

    if (error) throw error;

    await this.updateSyncStatus('app_settings', 'to_cloud');
  }

  private queueOfflineSettingUpdate(
    key: string,
    value: any,
    category: string,
    timestamp: string
  ): void {
    const queue = JSON.parse(
      localStorage.getItem('gai-settings-queue') || '[]'
    );

    // Remove existing entry for this key
    const filtered = queue.filter((item: any) => item.key !== key);

    // Add new entry
    filtered.push({ key, value, category, timestamp });

    localStorage.setItem('gai-settings-queue', JSON.stringify(filtered));
  }

  async processOfflineSettingsQueue(): Promise<void> {
    if (!this.syncStatus.isOnline) return;

    const queue = JSON.parse(
      localStorage.getItem('gai-settings-queue') || '[]'
    );
    if (queue.length === 0) return;

    for (const item of queue) {
      try {
        await this.syncSettingToCloud(
          item.key,
          item.value,
          item.category,
          item.timestamp
        );
      } catch (error) {
        console.warn(`Erreur sync paramètre ${item.key}:`, error);
      }
    }

    // Clear queue after processing
    localStorage.removeItem('gai-settings-queue');
  }

  // Sync all settings from cloud to ensure consistency
  async syncSettingsFromCloud(): Promise<void> {
    try {
      const { data, error } = await supabase.from('app_settings').select('*');

      if (error) throw error;

      // Update localStorage cache with cloud data
      if (data) {
        data.forEach(setting => {
          localStorage.setItem(
            `gai-setting-${setting.key}`,
            JSON.stringify(setting.value)
          );
        });

        await this.updateSyncStatus('app_settings', 'from_cloud');
      }
    } catch (error) {
      console.warn('Erreur sync paramètres depuis cloud:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.updateSyncStatus('app_settings', 'from_cloud', errorMessage);
    }
  }
}

export const syncService = new SyncService();
