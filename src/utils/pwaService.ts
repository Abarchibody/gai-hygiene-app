class PWAService {
  private swRegistration: ServiceWorkerRegistration | null = null;

  async registerServiceWorker(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker enregistré:', this.swRegistration);
        
        // Écouter les messages du Service Worker
        navigator.serviceWorker.addEventListener('message', this.handleSWMessage);
        
        return true;
      } catch (error) {
        console.error('❌ Erreur Service Worker:', error);
        return false;
      }
    }
    return false;
  }

  private handleSWMessage = (event: MessageEvent) => {
    if (event.data?.type === 'PROCESS_NOTIFICATIONS') {
      // Note: Notification processing would be handled by NotificationService
      console.log('Notification processing requested by Service Worker');
    }
  };

  async requestPushPermission(): Promise<boolean> {
    if (!this.swRegistration) {
      console.warn('Service Worker non enregistré');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erreur permission push:', error);
      return false;
    }
  }

  isInstallable(): boolean {
    return 'beforeinstallprompt' in window;
  }

  async checkForUpdates(): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      const registration = await this.swRegistration.update();
      return registration.waiting !== null;
    } catch (error) {
      console.error('Erreur vérification mise à jour:', error);
      return false;
    }
  }

  async activateUpdate(): Promise<void> {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
}

export const pwaService = new PWAService();