const CACHE_NAME = 'gai-hygiene-v1';
const urlsToCache = [];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes (cache-first strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Rappel d\'hygiène GAI',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir le rappel',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('GAI Hygiène', options)
  );
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/reminders')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Planificateur de notifications (vérifie toutes les minutes)
setInterval(() => {
  // Envoyer un message à l'application principale pour traiter les notifications
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'PROCESS_NOTIFICATIONS'
      });
    });
  });
}, 60000); // 1 minute