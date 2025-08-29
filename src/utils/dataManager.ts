import { db } from '../db/schema';
import type { User, Class, Student, Reminder, ReminderAssignment, Event } from '../types';

export interface DatabaseExport {
  users: User[];
  classes: Class[];
  students: Student[];
  reminders: Reminder[];
  reminderAssignments: ReminderAssignment[];
  events: Event[];
  exportDate: string;
  version: string;
}

export const exportData = async (): Promise<void> => {
  try {
    const users = await db.users.toArray();
    const classes = await db.classes.toArray();
    const students = await db.students.toArray();
    const reminders = await db.reminders.toArray();
    const reminderAssignments = await db.reminderAssignments.toArray();
    const events = await db.events.toArray();

    const exportData: DatabaseExport = {
      users,
      classes,
      students,
      reminders,
      reminderAssignments,
      events,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gai-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Données exportées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error);
    throw error;
  }
};

export const importData = async (file: File): Promise<void> => {
  try {
    const text = await file.text();
    const data: DatabaseExport = JSON.parse(text);

    // Validation basique
    if (!data.users || !data.classes || !data.students) {
      throw new Error('Format de fichier invalide');
    }

    // Vider la base de données
    await db.transaction('rw', [db.users, db.classes, db.students, db.reminders, db.reminderAssignments, db.events], async () => {
      await db.reminderAssignments.clear();
      await db.reminders.clear();
      await db.events.clear();
      await db.students.clear();
      await db.classes.clear();
      await db.users.clear();

      // Importer les données
      await db.users.bulkAdd(data.users);
      await db.classes.bulkAdd(data.classes);
      await db.students.bulkAdd(data.students);
      if (data.reminders) await db.reminders.bulkAdd(data.reminders);
      if (data.reminderAssignments) await db.reminderAssignments.bulkAdd(data.reminderAssignments);
      if (data.events) await db.events.bulkAdd(data.events);
    });

    console.log('✅ Données importées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  }
};

export const getStatistics = async () => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalParents,
      totalTeachers,
      totalClasses,
      totalRelations,
      totalReminders,
      activeReminders,
      totalEvents
    ] = await Promise.all([
      db.users.count(),
      db.users.where('type_utilisateur').equals('Élève').count(),
      db.users.where('type_utilisateur').equals('Parent').count(),
      db.users.where('type_utilisateur').equals('Enseignant').count(),
      db.classes.count(),
      db.students.count(),
      db.reminders.count(),
      db.reminders.where('statut').equals('Actif').count(),
      db.events.count()
    ]);

    return {
      totalUsers,
      totalStudents,
      totalParents,
      totalTeachers,
      totalClasses,
      totalRelations,
      totalReminders,
      activeReminders,
      totalEvents
    };
  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error);
    return {
      totalUsers: 0,
      totalStudents: 0,
      totalParents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      totalRelations: 0,
      totalReminders: 0,
      activeReminders: 0,
      totalEvents: 0
    };
  }
};