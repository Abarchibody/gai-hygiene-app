import { db } from '../db/schema';
import type { Notification, Reminder } from '../types';

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.checkPermission();
  }

  async checkPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Ce navigateur ne supporte pas les notifications');
      return false;
    }

    this.permission = Notification.permission;
    
    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission === 'granted';
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async scheduleReminderNotifications(reminder: Reminder): Promise<void> {
    try {
      // Récupérer les assignations du rappel
      const assignments = await db.reminderAssignments
        .where('rappel_id')
        .equals(reminder.id!)
        .toArray();

      const notifications: Omit<Notification, 'id'>[] = [];

      // Créer des notifications pour chaque utilisateur assigné
      for (const assignment of assignments) {
        if (assignment.utilisateur_id) {
          notifications.push({
            title: `Rappel d'hygiène : ${reminder.titre}`,
            message: reminder.description || `Il est temps de : ${reminder.titre}`,
            type: 'reminder',
            status: 'pending',
            recipient_id: assignment.utilisateur_id,
            reminder_id: reminder.id!,
            scheduled_at: this.calculateNextSchedule(reminder),
            created_at: new Date()
          });
        }

        // Pour les classes, créer des notifications pour tous les élèves
        if (assignment.classe_id) {
          const students = await db.students
            .where('classe_id')
            .equals(assignment.classe_id)
            .toArray();

          for (const student of students) {
            notifications.push({
              title: `Rappel d'hygiène : ${reminder.titre}`,
              message: reminder.description || `Il est temps de : ${reminder.titre}`,
              type: 'reminder',
              status: 'pending',
              recipient_id: student.utilisateur_id,
              reminder_id: reminder.id!,
              scheduled_at: this.calculateNextSchedule(reminder),
              created_at: new Date()
            });
          }
        }
      }

      // Sauvegarder les notifications
      if (notifications.length > 0) {
        await db.notifications.bulkAdd(notifications);
        console.log(`📅 ${notifications.length} notifications programmées pour le rappel: ${reminder.titre}`);
      }
    } catch (error) {
      console.error('Erreur lors de la programmation des notifications:', error);
    }
  }

  private calculateNextSchedule(reminder: Reminder): Date {
    const now = new Date();
    const [hours, minutes] = reminder.heure.split(':').map(Number);
    
    let nextSchedule = new Date(reminder.date_debut);
    nextSchedule.setHours(hours, minutes, 0, 0);

    // Si la date est dans le passé, calculer la prochaine occurrence
    while (nextSchedule <= now) {
      switch (reminder.recurrence) {
        case 'Quotidien':
          nextSchedule.setDate(nextSchedule.getDate() + 1);
          break;
        case 'Hebdomadaire':
          nextSchedule.setDate(nextSchedule.getDate() + 7);
          break;
        case 'Mensuel':
          nextSchedule.setMonth(nextSchedule.getMonth() + 1);
          break;
        case 'Unique':
          return nextSchedule; // Pas de répétition
      }
    }

    return nextSchedule;
  }

  async sendNotification(notification: Notification): Promise<boolean> {
    try {
      if (this.permission !== 'granted') {
        console.warn('Permission de notification non accordée');
        return false;
      }

      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `reminder-${notification.reminder_id}`,
        requireInteraction: true
      });

      // Marquer comme envoyée
      await db.notifications.update(notification.id!, {
        status: 'sent',
        sent_at: new Date()
      });

      // Gérer les clics sur la notification
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        this.markAsRead(notification.id!);
      };

      console.log(`🔔 Notification envoyée: ${notification.title}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      
      // Marquer comme échouée
      await db.notifications.update(notification.id!, {
        status: 'failed'
      });
      
      return false;
    }
  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      await db.notifications.update(notificationId, {
        status: 'read',
        read_at: new Date()
      });
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }

  async processPendingNotifications(): Promise<void> {
    try {
      const now = new Date();
      const pendingNotifications = await db.notifications
        .where('status')
        .equals('pending')
        .and(notification => notification.scheduled_at <= now)
        .toArray();

      console.log(`🔄 Traitement de ${pendingNotifications.length} notifications en attente`);

      for (const notification of pendingNotifications) {
        await this.sendNotification(notification);
        
        // Programmer la prochaine occurrence si récurrente
        const reminder = await db.reminders.get(notification.reminder_id!);
        if (reminder && reminder.recurrence !== 'Unique' && reminder.statut === 'Actif') {
          await this.scheduleReminderNotifications(reminder);
        }
      }
    } catch (error) {
      console.error('Erreur lors du traitement des notifications:', error);
    }
  }

  startNotificationScheduler(): void {
    // Vérifier les notifications toutes les minutes
    setInterval(() => {
      this.processPendingNotifications();
    }, 60000);

    console.log('📅 Planificateur de notifications démarré');
  }

  async scheduleBackgroundNotification(reminder: Reminder, scheduledTime: Date): Promise<void> {
    // Programmer une notification via Service Worker si disponible
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          data: {
            title: `Rappel d'hygiène : ${reminder.titre}`,
            body: reminder.description || `Il est temps de : ${reminder.titre}`,
            scheduledTime: scheduledTime.getTime(),
            reminderId: reminder.id
          }
        });
      } catch (error) {
        console.error('Erreur programmation notification background:', error);
      }
    }
  }

  async getNotificationStats() {
    try {
      const [total, pending, sent, read, failed] = await Promise.all([
        db.notifications.count(),
        db.notifications.where('status').equals('pending').count(),
        db.notifications.where('status').equals('sent').count(),
        db.notifications.where('status').equals('read').count(),
        db.notifications.where('status').equals('failed').count()
      ]);

      return { total, pending, sent, read, failed };
    } catch (error) {
      console.error('Erreur calcul statistiques notifications:', error);
      return { total: 0, pending: 0, sent: 0, read: 0, failed: 0 };
    }
  }
}

export const notificationService = new NotificationService();