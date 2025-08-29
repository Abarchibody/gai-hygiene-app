import { db } from '../db/schema';
import { exportData } from './dataManager';

interface BackupConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  maxBackups: number;
  lastBackup?: string;
}

interface BackupFile {
  id: string;
  timestamp: string;
  size: number;
  recordCount: number;
}

class BackupService {
  private config: BackupConfig = {
    enabled: true,
    frequency: 'weekly',
    maxBackups: 5
  };

  constructor() {
    this.loadConfig();
    this.startScheduler();
  }

  private loadConfig() {
    const saved = localStorage.getItem('gai-backup-config');
    if (saved) {
      this.config = { ...this.config, ...JSON.parse(saved) };
    }
  }

  private saveConfig() {
    localStorage.setItem('gai-backup-config', JSON.stringify(this.config));
  }

  async createBackup(): Promise<BackupFile> {
    try {
      const [users, classes, students, reminders, reminderAssignments, notifications] = await Promise.all([
        db.users.toArray(),
        db.classes.toArray(),
        db.students.toArray(),
        db.reminders.toArray(),
        db.reminderAssignments.toArray(),
        db.notifications.toArray()
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          users,
          classes,
          students,
          reminders,
          reminderAssignments,
          notifications
        }
      };

      const backupId = `backup-${Date.now()}`;
      const backupJson = JSON.stringify(backupData, null, 2);
      
      // Stocker dans localStorage avec clé unique
      localStorage.setItem(`gai-backup-${backupId}`, backupJson);
      
      const backupFile: BackupFile = {
        id: backupId,
        timestamp: backupData.timestamp,
        size: new Blob([backupJson]).size,
        recordCount: users.length + classes.length + students.length + reminders.length + reminderAssignments.length + notifications.length
      };

      // Mettre à jour la liste des sauvegardes
      this.addToBackupList(backupFile);
      this.cleanOldBackups();
      
      this.config.lastBackup = backupData.timestamp;
      this.saveConfig();

      console.log(`✅ Sauvegarde créée: ${backupId} (${backupFile.recordCount} enregistrements)`);
      return backupFile;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  private addToBackupList(backup: BackupFile) {
    const backups = this.getBackupList();
    backups.push(backup);
    backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    localStorage.setItem('gai-backup-list', JSON.stringify(backups));
  }

  getBackupList(): BackupFile[] {
    const saved = localStorage.getItem('gai-backup-list');
    return saved ? JSON.parse(saved) : [];
  }

  private cleanOldBackups() {
    const backups = this.getBackupList();
    if (backups.length > this.config.maxBackups) {
      const toDelete = backups.slice(this.config.maxBackups);
      toDelete.forEach(backup => {
        localStorage.removeItem(`gai-backup-${backup.id}`);
      });
      
      const remaining = backups.slice(0, this.config.maxBackups);
      localStorage.setItem('gai-backup-list', JSON.stringify(remaining));
    }
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      const backupData = localStorage.getItem(`gai-backup-${backupId}`);
      if (!backupData) {
        throw new Error('Sauvegarde introuvable');
      }

      const backup = JSON.parse(backupData);
      const { data } = backup;

      // Vider la base de données
      await db.transaction('rw', [db.users, db.classes, db.students, db.reminders, db.reminderAssignments, db.notifications], async () => {
        await db.notifications.clear();
        await db.reminderAssignments.clear();
        await db.reminders.clear();
        await db.students.clear();
        await db.classes.clear();
        await db.users.clear();

        // Restaurer les données
        if (data.users?.length) await db.users.bulkAdd(data.users);
        if (data.classes?.length) await db.classes.bulkAdd(data.classes);
        if (data.students?.length) await db.students.bulkAdd(data.students);
        if (data.reminders?.length) await db.reminders.bulkAdd(data.reminders);
        if (data.reminderAssignments?.length) await db.reminderAssignments.bulkAdd(data.reminderAssignments);
        if (data.notifications?.length) await db.notifications.bulkAdd(data.notifications);
      });

      console.log(`✅ Sauvegarde restaurée: ${backupId}`);
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      throw error;
    }
  }

  deleteBackup(backupId: string) {
    localStorage.removeItem(`gai-backup-${backupId}`);
    const backups = this.getBackupList().filter(b => b.id !== backupId);
    localStorage.setItem('gai-backup-list', JSON.stringify(backups));
  }

  downloadBackup(backupId: string) {
    const backupData = localStorage.getItem(`gai-backup-${backupId}`);
    if (!backupData) return;

    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gai-backup-${backupId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private startScheduler() {
    if (!this.config.enabled) return;

    const checkInterval = 60 * 60 * 1000; // 1 heure
    setInterval(() => {
      this.checkAndBackup();
    }, checkInterval);

    // Vérifier au démarrage
    setTimeout(() => this.checkAndBackup(), 5000);
  }

  private async checkAndBackup() {
    if (!this.config.enabled) return;

    const now = new Date();
    const lastBackup = this.config.lastBackup ? new Date(this.config.lastBackup) : null;
    
    if (!lastBackup || this.shouldBackup(lastBackup, now)) {
      try {
        await this.createBackup();
      } catch (error) {
        console.error('Sauvegarde automatique échouée:', error);
      }
    }
  }

  private shouldBackup(lastBackup: Date, now: Date): boolean {
    const diffMs = now.getTime() - lastBackup.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    switch (this.config.frequency) {
      case 'daily': return diffDays >= 1;
      case 'weekly': return diffDays >= 7;
      case 'monthly': return diffDays >= 30;
      default: return false;
    }
  }

  getConfig(): BackupConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<BackupConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  getStorageUsage(): { used: number; total: number; percentage: number } {
    let used = 0;
    const backups = this.getBackupList();
    
    backups.forEach(backup => {
      const data = localStorage.getItem(`gai-backup-${backup.id}`);
      if (data) used += data.length;
    });

    // Estimation de l'espace total disponible (5MB pour localStorage)
    const total = 5 * 1024 * 1024;
    const percentage = Math.round((used / total) * 100);

    return { used, total, percentage };
  }
}

export const backupService = new BackupService();