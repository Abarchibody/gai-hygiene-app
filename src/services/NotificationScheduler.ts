import { reminderService, notificationService } from './index';
import { indexedDBService } from './IndexedDBService';
import type { Reminder } from '../types';

export class NotificationScheduler {
  private static instance: NotificationScheduler;

  private constructor() {}

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  async generateNotificationsFromReminders(): Promise<void> {
    try {
      // Use cached reminders for offline-first approach
      const cachedReminders = await indexedDBService.getCachedReminders();
      const activeReminders = cachedReminders.filter(r => r.statut === 'Actif');

      for (const reminder of activeReminders) {
        await this.createNotificationsForReminder(reminder);
      }
    } catch (error) {
      console.error('Error generating notifications:', error);
    }
  }

  private async createNotificationsForReminder(reminder: Reminder): Promise<void> {
    if (!reminder.id) return;

    const assignments = await reminderService.getAssignments(reminder.id);
    const now = new Date();
    const scheduledTime = this.getNextScheduledTime(reminder, now);

    if (!scheduledTime) return;

    // Clean up old pending notifications for this reminder
    await this.cleanupOldNotifications(reminder.id);

    // Check if notification already exists for this exact time (use cached data)
    const existingNotifications = await indexedDBService.getCachedNotifications();
    const alreadyExists = existingNotifications.some(n => 
      n.reminder_id === reminder.id &&
      n.status === 'pending' &&
      Math.abs(new Date(n.scheduled_at).getTime() - scheduledTime.getTime()) < 60000
    );

    if (alreadyExists) return;

    // Create notifications for each assignment
    for (const assignment of assignments) {
      if (assignment.utilisateur_id) {
        await notificationService.create({
          title: `Rappel: ${reminder.titre}`,
          message: reminder.description || `Il est temps de ${reminder.titre.toLowerCase()}`,
          type: 'reminder',
          status: 'pending',
          recipient_id: assignment.utilisateur_id,
          reminder_id: reminder.id,
          scheduled_at: scheduledTime,

        });
      }
    }
  }

  private async cleanupOldNotifications(reminderId: number): Promise<void> {
    try {
      // Use cached notifications for cleanup
      const allNotifications = await indexedDBService.getCachedNotifications();
      const oldPendingNotifications = allNotifications.filter(n => 
        n.reminder_id === reminderId && 
        n.status === 'pending' &&
        new Date(n.scheduled_at) < new Date()
      );

      for (const notification of oldPendingNotifications) {
        if (notification.id) {
          await notificationService.delete(notification.id);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }

  private getNextScheduledTime(reminder: Reminder, from: Date): Date | null {
    const [hours, minutes] = reminder.heure.split(':').map(Number);
    const scheduledTime = new Date(from);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for next occurrence
    if (scheduledTime <= from) {
      switch (reminder.recurrence) {
        case 'Quotidien':
          scheduledTime.setDate(scheduledTime.getDate() + 1);
          break;
        case 'Hebdomadaire':
          scheduledTime.setDate(scheduledTime.getDate() + 7);
          break;
        case 'Mensuel':
          scheduledTime.setMonth(scheduledTime.getMonth() + 1);
          break;
        case 'Unique':
          return null; // Don't reschedule unique reminders
      }
    }

    return scheduledTime;
  }
}

export const notificationScheduler = NotificationScheduler.getInstance();