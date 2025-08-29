import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (à remplacer par vos vraies clés)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la synchronisation
export interface SyncStatus {
  lastSync: Date | null;
  isOnline: boolean;
  pendingChanges: number;
  syncInProgress: boolean;
}

export interface SyncConfig {
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number; // en minutes
}