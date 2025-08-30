import { indexedDBService } from './IndexedDBService';
import { supabase } from '../utils/supabaseClient';

interface PendingOperation {
  id: string;
  table: string;
  operation: 'create' | 'update' | 'delete';
  data?: any;
  recordId?: number;
  timestamp: number;
}

export class OfflineService {
  private static instance: OfflineService;
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  private constructor() {
    this.setupNetworkListeners();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingOperations();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async queueOperation(operation: Omit<PendingOperation, 'id' | 'timestamp'>): Promise<void> {
    // Check if store exists before accessing
    if (!indexedDBService.db?.objectStoreNames.contains('pending_operations')) {
      console.warn('Pending operations store not available');
      return;
    }
    
    const pendingOp: PendingOperation = {
      ...operation,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now()
    };

    await indexedDBService.put('pending_operations', pendingOp);
  }

  async syncPendingOperations(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;
    try {
      // Check if store exists before accessing
      if (!indexedDBService.db?.objectStoreNames.contains('pending_operations')) {
        return;
      }
      
      const operations = await indexedDBService.getAll<PendingOperation>('pending_operations');
      
      for (const op of operations.sort((a, b) => a.timestamp - b.timestamp)) {
        try {
          await this.executePendingOperation(op);
          await this.deletePendingOperation(op.id);
        } catch (error) {
          console.error('Failed to sync operation:', op, error);
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async executePendingOperation(op: PendingOperation): Promise<void> {
    switch (op.operation) {
      case 'create':
        await supabase.from(op.table).insert(op.data);
        break;
      case 'update':
        await supabase.from(op.table).update(op.data).eq('id', op.recordId);
        break;
      case 'delete':
        await supabase.from(op.table).delete().eq('id', op.recordId);
        break;
    }
  }

  private async deletePendingOperation(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!indexedDBService.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }
      
      const transaction = indexedDBService.db.transaction(['pending_operations'], 'readwrite');
      const store = transaction.objectStore('pending_operations');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }
}

export const offlineService = OfflineService.getInstance();