import { useState, useEffect } from 'react';
import { authService } from '../services';

export default function DebugGrace() {
  const user = authService.getCurrentUser();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (user?.email === 'grace.mbuyi@gai-school.cd') {
      checkGraceData();
    }
  }, [user]);

  const checkGraceData = async () => {
    try {
      const info: any = {
        message: 'Debug component disabled - IndexedDB removed',
        user: user
      };
      
      setDebugInfo(info);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: (error as Error).message });
    }
  };

  if (user?.email !== 'grace.mbuyi@gai-school.cd') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-4 max-w-md max-h-96 overflow-auto text-xs">
      <h4 className="font-bold text-red-800 mb-2">Debug Info for Grace</h4>
      <pre className="text-red-700 whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={checkGraceData}
        className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
      >
        Refresh
      </button>
    </div>
  );
}