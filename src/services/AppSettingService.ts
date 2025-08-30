import { supabase } from '../utils/supabaseClient';
import { indexedDBService } from './IndexedDBService';
import { offlineService } from './OfflineService';
import type { AppSetting, SettingCategory } from '../types';

export class AppSettingService {
  private static instance: AppSettingService;

  private constructor() {}

  static getInstance(): AppSettingService {
    if (!AppSettingService.instance) {
      AppSettingService.instance = new AppSettingService();
    }
    return AppSettingService.instance;
  }

  async getList(): Promise<AppSetting[]> {
    const cachedSettings = await indexedDBService.getAll<AppSetting>('appSettings');
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .order('category', { ascending: true });

        if (!error && data) {
          for (const setting of data) {
            await indexedDBService.put('appSettings', setting);
          }
          return data;
        }
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
    
    return cachedSettings;
  }

  async getOne(id: number): Promise<AppSetting | null> {
    const cachedSetting = await indexedDBService.getById<AppSetting>('appSettings', id);
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          await indexedDBService.put('appSettings', data);
          return data;
        }
      } catch (error) {
        console.warn('Failed to fetch setting from cloud:', error);
      }
    }
    
    return cachedSetting;
  }

  async getByKey(key: string): Promise<AppSetting | null> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) return null;
    return data;
  }

  async getByCategory(category: SettingCategory): Promise<AppSetting[]> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('category', category)
      .order('key', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async create(settingData: Omit<AppSetting, 'id' | 'created_at' | 'updated_at'>): Promise<AppSetting> {
    const tempId = Date.now();
    const newSetting: AppSetting = {
      ...settingData,
      id: tempId,
      created_at: new Date(),
      updated_at: new Date()
    };

    await indexedDBService.put('appSettings', newSetting);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .insert({
            ...settingData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.delete('appSettings', tempId);
          await indexedDBService.put('appSettings', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'app_settings',
          operation: 'create',
          data: settingData
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'app_settings',
        operation: 'create',
        data: settingData
      });
    }

    return newSetting;
  }

  async update(id: number, updates: Partial<AppSetting>): Promise<AppSetting> {
    const currentSetting = await indexedDBService.getById<AppSetting>('appSettings', id);
    if (!currentSetting) throw new Error('Setting not found');

    const updatedSetting = {
      ...currentSetting,
      ...updates,
      updated_at: new Date()
    };

    await indexedDBService.put('appSettings', updatedSetting);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.put('appSettings', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'app_settings',
          operation: 'update',
          data: updates,
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'app_settings',
        operation: 'update',
        data: updates,
        recordId: id
      });
    }

    return updatedSetting;
  }

  async updateByKey(key: string, value: any): Promise<void> {
    const setting = await this.getByKey(key);
    if (setting) {
      await this.update(setting.id!, { value });
    } else {
      await this.create({
        key,
        value,
        category: 'general'
      });
    }
  }

  async delete(id: number): Promise<void> {
    await indexedDBService.delete('appSettings', id);

    if (offlineService.getOnlineStatus()) {
      try {
        const { error } = await supabase
          .from('app_settings')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        await offlineService.queueOperation({
          table: 'app_settings',
          operation: 'delete',
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'app_settings',
        operation: 'delete',
        recordId: id
      });
    }
  }
}

export const appSettingService = AppSettingService.getInstance();