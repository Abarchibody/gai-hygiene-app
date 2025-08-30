import { supabase } from '../utils/supabaseClient';
import type { Reminder } from '../types';

export class ReminderService {
  private static instance: ReminderService;

  private constructor() {}

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  async getList(): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        createur:users!reminders_createur_id_fkey(id, nom, prenom)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getOne(id: number): Promise<Reminder | null> {
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        createur:users!reminders_createur_id_fkey(id, nom, prenom)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(reminder: Omit<Reminder, 'id' | 'created_at'>): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        ...reminder,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updates: Partial<Reminder>): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getAssignments(reminderId: number) {
    const { data, error } = await supabase
      .from('reminder_assignments')
      .select(`
        *,
        utilisateur:users!reminder_assignments_utilisateur_id_fkey(id, nom, prenom, type_utilisateur),
        classe:classes!reminder_assignments_classe_id_fkey(id, nom_classe, niveau)
      `)
      .eq('rappel_id', reminderId);

    if (error) throw error;
    return data || [];
  }

  async assignToUser(reminderId: number, userId: number) {
    const { data, error } = await supabase
      .from('reminder_assignments')
      .insert({
        rappel_id: reminderId,
        utilisateur_id: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async assignToClass(reminderId: number, classId: number) {
    const { data, error } = await supabase
      .from('reminder_assignments')
      .insert({
        rappel_id: reminderId,
        classe_id: classId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeAssignment(reminderId: number, userId?: number, classId?: number): Promise<void> {
    let query = supabase
      .from('reminder_assignments')
      .delete()
      .eq('rappel_id', reminderId);

    if (userId) {
      query = query.eq('utilisateur_id', userId);
    }
    if (classId) {
      query = query.eq('classe_id', classId);
    }

    const { error } = await query;
    if (error) throw error;
  }

  async getForUser(userId: number): Promise<Reminder[]> {
    // Get reminders assigned directly to user or through their class
    const { data: userClassData } = await supabase
      .from('students')
      .select('classe_id')
      .eq('utilisateur_id', userId);

    const classIds = userClassData?.map(s => s.classe_id) || [];

    const { data, error } = await supabase
      .from('reminder_assignments')
      .select(`
        reminders(*)
      `)
      .or(`utilisateur_id.eq.${userId},classe_id.in.(${classIds.join(',')})`);

    if (error) throw error;
    return data?.map((item: any) => item.reminders).filter(Boolean) || [];
  }
}

export const reminderService = ReminderService.getInstance();