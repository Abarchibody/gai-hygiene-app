import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Button from './ui/Button';

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { syncService } = await import('../utils/syncService');
      await syncService.syncFromCloud();
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Synchronisation échouée. Vérifiez votre connexion.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={syncing}
      variant="secondary"
      size="sm"
      className="flex items-center"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Synchronisation...' : 'Synchroniser'}
    </Button>
  );
}