import type { User, Class, Reminder, Notification } from '../types';

class IndexedDBService {
  private static instance: IndexedDBService;
  public db: IDBDatabase | null = null;
  private dbName = 'gai_hygiene_db';
  private version = 2;

  private constructor() {}

  static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('type', 'type_utilisateur');
        }

        // Classes store
        if (!db.objectStoreNames.contains('classes')) {
          const classStore = db.createObjectStore('classes', { keyPath: 'id' });
          classStore.createIndex('enseignant_id', 'enseignant_id');
        }

        // Reminders store
        if (!db.objectStoreNames.contains('reminders')) {
          const reminderStore = db.createObjectStore('reminders', { keyPath: 'id' });
          reminderStore.createIndex('createur_id', 'createur_id');
          reminderStore.createIndex('statut', 'statut');
        }

        // Notifications store
        if (!db.objectStoreNames.contains('notifications')) {
          const notificationStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notificationStore.createIndex('recipient_id', 'recipient_id');
          notificationStore.createIndex('status', 'status');
          notificationStore.createIndex('scheduled_at', 'scheduled_at');
        }

        // Events store
        if (!db.objectStoreNames.contains('events')) {
          const eventStore = db.createObjectStore('events', { keyPath: 'id' });
          eventStore.createIndex('responsable_id', 'responsable_id');
          eventStore.createIndex('statut', 'statut');
          eventStore.createIndex('date_debut', 'date_debut');
        }

        // Pending operations store for offline sync
        if (!db.objectStoreNames.contains('pending_operations')) {
          db.createObjectStore('pending_operations', { keyPath: 'id' });
        }

        // Sync metadata store
        if (!db.objectStoreNames.contains('sync_metadata')) {
          db.createObjectStore('sync_metadata', { keyPath: 'table' });
        }
      };
    });
  }

  // Generic CRUD operations
  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(storeName: string, id: number): Promise<T | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: number): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Specific methods for each entity type
  async cacheUsers(users: User[]): Promise<void> {
    for (const user of users) {
      await this.put('users', user);
    }
  }

  async getCachedUsers(): Promise<User[]> {
    return this.getAll<User>('users');
  }

  async cacheClasses(classes: Class[]): Promise<void> {
    for (const cls of classes) {
      await this.put('classes', cls);
    }
  }

  async getCachedClasses(): Promise<Class[]> {
    return this.getAll<Class>('classes');
  }

  async cacheReminders(reminders: Reminder[]): Promise<void> {
    for (const reminder of reminders) {
      await this.put('reminders', reminder);
    }
  }

  async getCachedReminders(): Promise<Reminder[]> {
    return this.getAll<Reminder>('reminders');
  }

  async cacheNotifications(notifications: Notification[]): Promise<void> {
    for (const notification of notifications) {
      await this.put('notifications', notification);
    }
  }

  async getCachedNotifications(): Promise<Notification[]> {
    return this.getAll<Notification>('notifications');
  }
}

export const indexedDBService = IndexedDBService.getInstance();