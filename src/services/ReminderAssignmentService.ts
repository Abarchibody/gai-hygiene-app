import { supabase } from '../utils/supabaseClient';
import { indexedDBService } from './IndexedDBService';
import { offlineService } from './OfflineService';
import type { ReminderAssignment } from '../types';

export class ReminderAssignmentService {
  private static instance: ReminderAssignmentService;

  private constructor() {}

  static getInstance(): ReminderAssignmentService {
    if (!ReminderAssignmentService.instance) {
      ReminderAssignmentService.instance = new ReminderAssignmentService();
    }
    return ReminderAssignmentService.instance;
  }

  async getList(): Promise<ReminderAssignment[]> {
    const cachedAssignments = await indexedDBService.getAll<ReminderAssignment>('reminderAssignments');
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('reminder_assignments')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          for (const assignment of data) {
            await indexedDBService.put('reminderAssignments', assignment);
          }
          return data;
        }
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
    
    return cachedAssignments;
  }

  async getOne(id: number): Promise<ReminderAssignment | null> {
    const cachedAssignment = await indexedDBService.getById<ReminderAssignment>('reminderAssignments', id);
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('reminder_assignments')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          await indexedDBService.put('reminderAssignments', data);
          return data;
        }
      } catch (error) {
        console.warn('Failed to fetch assignment from cloud:', error);
      }
    }
    
    return cachedAssignment;
  }

  async create(assignmentData: Omit<ReminderAssignment, 'id' | 'created_at'>): Promise<ReminderAssignment> {
    const tempId = Date.now();
    const newAssignment: ReminderAssignment = {
      ...assignmentData,
      id: tempId,
      created_at: new Date()
    };

    await indexedDBService.put('reminderAssignments', newAssignment);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('reminder_assignments')
          .insert({
            ...assignmentData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.delete('reminderAssignments', tempId);
          await indexedDBService.put('reminderAssignments', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'reminder_assignments',
          operation: 'create',
          data: assignmentData
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'reminder_assignments',
        operation: 'create',
        data: assignmentData
      });
    }

    return newAssignment;
  }

  async delete(id: number): Promise<void> {
    await indexedDBService.delete('reminderAssignments', id);

    if (offlineService.getOnlineStatus()) {
      try {
        const { error } = await supabase
          .from('reminder_assignments')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        await offlineService.queueOperation({
          table: 'reminder_assignments',
          operation: 'delete',
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'reminder_assignments',
        operation: 'delete',
        recordId: id
      });
    }
  }

  async getByReminder(reminderId: number): Promise<ReminderAssignment[]> {
    const { data, error } = await supabase
      .from('reminder_assignments')
      .select('*')
      .eq('rappel_id', reminderId);

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: number): Promise<ReminderAssignment[]> {
    const { data, error } = await supabase
      .from('reminder_assignments')
      .select('*')
      .eq('utilisateur_id', userId);

    if (error) throw error;
    return data || [];
  }

  async getByClass(classId: number): Promise<ReminderAssignment[]> {
    const { data, error } = await supabase
      .from('reminder_assignments')
      .select('*')
      .eq('classe_id', classId);

    if (error) throw error;
    return data || [];
  }
}

export const reminderAssignmentService = ReminderAssignmentService.getInstance();