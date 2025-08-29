import { useState, useEffect } from 'react';
import { db } from '../db/schema';
import { useAuth } from '../contexts/AuthContext';

export default function DebugGrace() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (user?.email === 'grace.mbuyi@gai-school.cd') {
      checkGraceData();
    }
  }, [user]);

  const checkGraceData = async () => {
    try {
      const info: any = {};
      
      // Get Grace's user record
      info.user = await db.users.where('email').equals('grace.mbuyi@gai-school.cd').first();
      
      // Get Grace's student record
      if (info.user) {
        info.studentRecord = await db.students.where('utilisateur_id').equals(info.user.id).first();
        
        // Get individual assignments
        info.userAssignments = await db.reminderAssignments.where('utilisateur_id').equals(info.user.id).toArray();
        
        // Get class assignments if student record exists
        if (info.studentRecord?.classe_id) {
          info.classAssignments = await db.reminderAssignments.where('classe_id').equals(info.studentRecord.classe_id).toArray();
        } else {
          info.classAssignments = [];
        }
        
        // Get all reminder IDs that should be visible
        const reminderIds = new Set<number>();
        info.userAssignments.forEach((a: any) => reminderIds.add(a.rappel_id));
        info.classAssignments.forEach((a: any) => reminderIds.add(a.rappel_id));
        
        // Get the actual reminders
        if (reminderIds.size > 0) {
          info.visibleReminders = await db.reminders.where('id').anyOf(Array.from(reminderIds)).toArray();
        } else {
          info.visibleReminders = [];
        }
      }
      
      // Get all reminders for comparison
      info.allReminders = await db.reminders.toArray();
      info.allAssignments = await db.reminderAssignments.toArray();
      
      setDebugInfo(info);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
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