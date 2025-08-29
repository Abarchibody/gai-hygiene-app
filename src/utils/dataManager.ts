import { db } from '../db/schema';
import type { User, Class, Student } from '../types';

export interface DatabaseExport {
  users: User[];
  classes: Class[];
  students: Student[];
  exportDate: string;
  version: string;
}

export const exportData = async (): Promise<void> => {
  try {
    const users = await db.users.toArray();
    const classes = await db.classes.toArray();
    const students = await db.students.toArray();

    const exportData: DatabaseExport = {
      users,
      classes,
      students,
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
    await db.transaction('rw', [db.users, db.classes, db.students], async () => {
      await db.students.clear();
      await db.classes.clear();
      await db.users.clear();

      // Importer les données
      await db.users.bulkAdd(data.users);
      await db.classes.bulkAdd(data.classes);
      await db.students.bulkAdd(data.students);
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
      totalRelations
    ] = await Promise.all([
      db.users.count(),
      db.users.where('type_utilisateur').equals('Élève').count(),
      db.users.where('type_utilisateur').equals('Parent').count(),
      db.users.where('type_utilisateur').equals('Enseignant').count(),
      db.classes.count(),
      db.students.count()
    ]);

    return {
      totalUsers,
      totalStudents,
      totalParents,
      totalTeachers,
      totalClasses,
      totalRelations
    };
  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error);
    return {
      totalUsers: 0,
      totalStudents: 0,
      totalParents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      totalRelations: 0
    };
  }
};