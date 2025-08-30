import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
        isOnline
          ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
          : 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className='w-3 h-3' />
          <span>En ligne</span>
        </>
      ) : (
        <>
          <WifiOff className='w-3 h-3' />
          <span>Hors ligne</span>
        </>
      )}
    </div>
  );
}
