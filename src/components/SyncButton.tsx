import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Button from './ui/Button';

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Note: Sync functionality removed with IndexedDB migration
      console.log('Sync requested - data is now directly from Supabase');
      window.location.reload(); // Refresh to show current data
    } catch (error) {
      console.error('Refresh failed:', error);
      alert('Actualisation échouée.');
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