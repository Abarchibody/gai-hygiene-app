import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { notificationService, notificationScheduler } from '../services';
import type { Notification } from '../types';

interface NotificationDialogProps {
  notification: Notification;
  onClose: () => void;
}

function NotificationDialog({ notification, onClose }: NotificationDialogProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <Bell className="w-5 h-5 text-gai-orange mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {notification.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {notification.message}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function NotificationManager() {
  const [dialogNotification, setDialogNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Request notification permission on mount
    notificationService.requestPermission();

    // Check for pending notifications every minute
    const checkNotifications = async () => {
      try {
        // First, generate new notifications from active reminders
        await notificationScheduler.generateNotificationsFromReminders();
        
        const pendingNotifications = await notificationService.getPending();
        
        for (const notification of pendingNotifications) {
          // Send browser notification
          const success = await notificationService.sendBrowserNotification(
            notification.title,
            notification.message
          );

          if (success) {
            // Mark as sent
            await notificationService.markAsSent(notification.id!);
            
            // Show in-app dialog
            setDialogNotification(notification);
            
            // Auto-close dialog after 5 seconds
            setTimeout(() => {
              setDialogNotification(null);
            }, 5000);
          } else {
            // Mark as failed
            await notificationService.markAsFailed(notification.id!, 'Browser notification failed');
          }
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    // Check immediately
    checkNotifications();

    // Set up interval to check every minute
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseDialog = async () => {
    if (dialogNotification) {
      await notificationService.markAsRead(dialogNotification.id!);
      setDialogNotification(null);
    }
  };

  return (
    <>
      {dialogNotification && (
        <NotificationDialog
          notification={dialogNotification}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}