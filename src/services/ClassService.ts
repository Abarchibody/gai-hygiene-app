import { supabase } from '../utils/supabaseClient';
import { indexedDBService } from './IndexedDBService';
import { offlineService } from './OfflineService';
import type { Class } from '../types';

export class ClassService {
  private static instance: ClassService;

  private constructor() {}

  static getInstance(): ClassService {
    if (!ClassService.instance) {
      ClassService.instance = new ClassService();
    }
    return ClassService.instance;
  }

  async getList(): Promise<Class[]> {
    const cachedClasses = await indexedDBService.getCachedClasses();
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select(
            `
            *,
            enseignant:users!classes_enseignant_id_fkey(id, nom, prenom)
          `
          )
          .order('nom_classe', { ascending: true });

        if (!error && data) {
          await indexedDBService.cacheClasses(data);
          return data;
        }
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
    
    return cachedClasses;
  }

  async getOne(id: number): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .select(
        `
        *,
        enseignant:users!classes_enseignant_id_fkey(id, nom, prenom)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(
    classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Class> {
    const tempId = Date.now();
    const newClass: Class = {
      ...classData,
      id: tempId,
      created_at: new Date(),
      updated_at: new Date()
    };

    await indexedDBService.put('classes', newClass);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('classes')
          .insert({
            ...classData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.delete('classes', tempId);
          await indexedDBService.put('classes', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'classes',
          operation: 'create',
          data: classData
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'classes',
        operation: 'create',
        data: classData
      });
    }

    return newClass;
  }

  async update(id: number, updates: Partial<Class>): Promise<Class> {
    const currentClass = await indexedDBService.getById<Class>('classes', id);
    if (!currentClass) throw new Error('Class not found');

    const updatedClass = {
      ...currentClass,
      ...updates,
      updated_at: new Date()
    };

    await indexedDBService.put('classes', updatedClass);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('classes')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.put('classes', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'classes',
          operation: 'update',
          data: updates,
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'classes',
        operation: 'update',
        data: updates,
        recordId: id
      });
    }

    return updatedClass;
  }

  async delete(id: number): Promise<void> {
    await indexedDBService.delete('classes', id);

    if (offlineService.getOnlineStatus()) {
      try {
        const { error } = await supabase.from('classes').delete().eq('id', id);
        if (error) throw error;
      } catch (error) {
        await offlineService.queueOperation({
          table: 'classes',
          operation: 'delete',
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'classes',
        operation: 'delete',
        recordId: id
      });
    }
  }

  async getStudents(classId: number) {
    const { data, error } = await supabase
      .from('students')
      .select(
        `
        *,
        utilisateur:users!students_utilisateur_id_fkey(id, nom, prenom, email),
        parent:users!students_parent_id_fkey(id, nom, prenom, email)
      `
      )
      .eq('classe_id', classId);

    if (error) throw error;
    return data || [];
  }

  async assignStudent(classId: number, studentId: number, parentId?: number) {
    const { data, error } = await supabase
      .from('students')
      .insert({
        classe_id: classId,
        utilisateur_id: studentId,
        parent_id: parentId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeStudent(classId: number, studentId: number): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('classe_id', classId)
      .eq('utilisateur_id', studentId);

    if (error) throw error;
  }
}

export const classService = ClassService.getInstance();
