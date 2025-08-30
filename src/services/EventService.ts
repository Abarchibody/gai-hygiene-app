import { supabase } from '../utils/supabaseClient';
import { indexedDBService } from './IndexedDBService';
import { offlineService } from './OfflineService';
import type { Event } from '../types';

export class EventService {
  private static instance: EventService;

  private constructor() {}

  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  async getList(): Promise<Event[]> {
    try {
      // Always try local first (offline-first approach)
      const cachedEvents = await indexedDBService.getAll<Event>('events');
      
      // If we have local data, return it immediately
      if (cachedEvents && cachedEvents.length > 0) {
        return cachedEvents.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
      }
      
      // If no local data and online, try to fetch from cloud
      if (offlineService.getOnlineStatus()) {
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date_debut', { ascending: false });

          if (!error && data) {
            for (const event of data) {
              await indexedDBService.put('events', event);
            }
            return data;
          }
        } catch (error) {
          console.warn('Cloud sync failed, using local data:', error);
        }
      }
      
      return cachedEvents || [];
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }

  async getOne(id: number): Promise<Event | null> {
    const cachedEvent = await indexedDBService.getById<Event>('events', id);
    
    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          await indexedDBService.put('events', data);
          return data;
        }
      } catch (error) {
        console.warn('Failed to fetch event from cloud:', error);
      }
    }
    
    return cachedEvent;
  }

  async create(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const tempId = Date.now();
    const newEvent: Event = {
      ...eventData,
      id: tempId,
      created_at: new Date(),
      updated_at: new Date()
    };

    await indexedDBService.put('events', newEvent);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .insert({
            ...eventData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.delete('events', tempId);
          await indexedDBService.put('events', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'events',
          operation: 'create',
          data: eventData
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'events',
        operation: 'create',
        data: eventData
      });
    }

    return newEvent;
  }

  async update(id: number, updates: Partial<Event>): Promise<Event> {
    const currentEvent = await indexedDBService.getById<Event>('events', id);
    if (!currentEvent) throw new Error('Event not found');

    const updatedEvent = {
      ...currentEvent,
      ...updates,
      updated_at: new Date()
    };

    await indexedDBService.put('events', updatedEvent);

    if (offlineService.getOnlineStatus()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await indexedDBService.put('events', data);
          return data;
        }
      } catch (error) {
        await offlineService.queueOperation({
          table: 'events',
          operation: 'update',
          data: updates,
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'events',
        operation: 'update',
        data: updates,
        recordId: id
      });
    }

    return updatedEvent;
  }

  async delete(id: number): Promise<void> {
    await indexedDBService.delete('events', id);

    if (offlineService.getOnlineStatus()) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        await offlineService.queueOperation({
          table: 'events',
          operation: 'delete',
          recordId: id
        });
      }
    } else {
      await offlineService.queueOperation({
        table: 'events',
        operation: 'delete',
        recordId: id
      });
    }
  }

  async getByResponsable(responsableId: number): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('responsable_id', responsableId)
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByStatus(status: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('statut', status)
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date_debut', startDate.toISOString())
      .lte('date_debut', endDate.toISOString())
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const eventService = EventService.getInstance();