import { db } from './schema';
import type { User, Class } from '../types';
import { seedReminders } from './sampleReminders';
import { seedEvents } from './sampleEvents';

// Données de test pour les utilisateurs
const sampleUsers: Omit<User, 'id'>[] = [
  // Administrateur
  {
    nom: 'Administrateur',
    prenom: 'GAI',
    email: 'admin@gai.cd',
    telephone: '+243 80 000 0000',
    password: 'admin',
    type_utilisateur: 'Admin',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },

  // Enseignants
  {
    nom: 'Mukendi',
    prenom: 'Jean-Pierre',
    email: 'jp.mukendi@gai.cd',
    telephone: '+243 81 234 5678',
    password: 'teacher123',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15')
  },
  {
    nom: 'Kabongo',
    prenom: 'Marie-Claire',
    email: 'mc.kabongo@gai.cd',
    telephone: '+243 82 345 6789',
    password: 'teacher456',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20')
  },
  {
    nom: 'Tshilanda',
    prenom: 'Paul',
    email: 'p.tshilanda@gai.cd',
    telephone: '+243 83 456 7890',
    password: 'teacher789',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01')
  },

  // Parents
  {
    nom: 'Mbuyi',
    prenom: 'Françoise',
    email: 'f.mbuyi@gai.cd',
    telephone: '+243 84 567 8901',
    password: 'parent123',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-02-10'),
    updated_at: new Date('2024-02-10')
  },
  {
    nom: 'Kasongo',
    prenom: 'Robert',
    email: 'r.kasongo@ygai.cd',
    telephone: '+243 85 678 9012',
    password: 'parent456',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-15')
  },
  {
    nom: 'Ngandu',
    prenom: 'Célestine',
    email: 'c.ngandu@hgai.cd',
    telephone: '+243 86 789 0123',
    password: 'parent789',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-02-20'),
    updated_at: new Date('2024-02-20')
  },
  {
    nom: 'Ilunga',
    prenom: 'Joseph',
    email: 'j.ilunga@gai.cd',
    telephone: '+243 87 890 1234',
    password: 'parent000',
    type_utilisateur: 'Parent',
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01')
  },

  // Élèves
  {
    nom: 'Mbuyi',
    prenom: 'Grace',
    email: 'grace.mbuyi@gai.cd',
    telephone: '',
    password: 'student123',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-05'),
    updated_at: new Date('2024-03-05')
  },
  {
    nom: 'Mbuyi',
    prenom: 'David',
    email: 'david.mbuyi@gai.cd',
    telephone: '',
    password: 'student456',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-05'),
    updated_at: new Date('2024-03-05')
  },
  {
    nom: 'Kasongo',
    prenom: 'Sarah',
    email: 'sarah.kasongo@gai.cd',
    telephone: '',
    password: 'student789',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-10'),
    updated_at: new Date('2024-03-10')
  },
  {
    nom: 'Ngandu',
    prenom: 'Emmanuel',
    email: 'emmanuel.ngandu@gai.cd',
    telephone: '',
    password: 'student000',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-12'),
    updated_at: new Date('2024-03-12')
  },
  {
    nom: 'Ngandu',
    prenom: 'Esther',
    email: 'esther.ngandu@gai.cd',
    telephone: '',
    password: 'student111',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-12'),
    updated_at: new Date('2024-03-12')
  },
  {
    nom: 'Ilunga',
    prenom: 'Samuel',
    email: 'samuel.ilunga@gai.cd',
    telephone: '',
    password: 'student222',
    type_utilisateur: 'Élève',
    created_at: new Date('2024-03-15'),
    updated_at: new Date('2024-03-15')
  }
];

// Données de test pour les classes
const sampleClasses: Omit<Class, 'id' | 'enseignant_id'>[] = [
  {
    nom_classe: '6ème A',
    niveau: 'Secondaire',
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25')
  },
  {
    nom_classe: '5ème B',
    niveau: 'Secondaire',
    created_at: new Date('2024-01-30'),
    updated_at: new Date('2024-01-30')
  },
  {
    nom_classe: 'CP1',
    niveau: 'Primaire',
    created_at: new Date('2024-02-05'),
    updated_at: new Date('2024-02-05')
  },
  {
    nom_classe: 'CP2',
    niveau: 'Primaire',
    created_at: new Date('2024-02-08'),
    updated_at: new Date('2024-02-08')
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Début du seeding de la base de données...');

    // Vider les tables existantes
    await db.students.clear();
    await db.classes.clear();
    await db.users.clear();

    // Ajouter les utilisateurs
    const userIds = await db.users.bulkAdd(sampleUsers, { allKeys: true });
    console.log(`✅ ${userIds.length} utilisateurs ajoutés`);

    // Récupérer les IDs des enseignants pour les assigner aux classes
    const teachers = await db.users
      .where('type_utilisateur')
      .equals('Enseignant')
      .toArray();

    // Ajouter les classes avec enseignants assignés
    const classesWithTeachers: Omit<Class, 'id'>[] = sampleClasses.map(
      (classe, index) => ({
        ...classe,
        enseignant_id: teachers[index % teachers.length]?.id
      })
    );

    const classIds = await db.classes.bulkAdd(classesWithTeachers, {
      allKeys: true
    });
    console.log(`✅ ${classIds.length} classes ajoutées`);

    // Créer les relations parent-élève et élève-classe
    const parents = await db.users
      .where('type_utilisateur')
      .equals('Parent')
      .toArray();
    const students = await db.users
      .where('type_utilisateur')
      .equals('Élève')
      .toArray();
    const classes = await db.classes.toArray();

    const studentRelations = [];

    // Relations parent-élève basées sur les noms de famille
    for (const student of students) {
      const parent = parents.find(p => p.nom === student.nom);
      const assignedClass = classes[Math.floor(Math.random() * classes.length)];

      studentRelations.push({
        utilisateur_id: student.id!,
        classe_id: assignedClass.id!,
        parent_id: parent?.id,
        created_at: new Date()
      });
    }

    await db.students.bulkAdd(studentRelations);
    console.log(
      `✅ ${studentRelations.length} relations élève-classe-parent créées`
    );

    // Ajouter les rappels d'hygiène de test
    const reminderResult = await seedReminders();
    console.log(`✅ ${reminderResult.reminders} rappels d'hygiène ajoutés`);
    if (reminderResult.assignments) {
      console.log(`✅ ${reminderResult.assignments} assignations de rappels créées`);
    }

    // Ajouter les événements de programmation
    const eventResult = await seedEvents();
    console.log(`✅ ${eventResult.events} événements de programmation ajoutés`);

    console.log('🎉 Seeding terminé avec succès !');

    return {
      users: userIds.length,
      classes: classIds.length,
      relations: studentRelations.length,
      reminders: reminderResult.reminders,
      assignments: reminderResult.assignments || 0,
      events: eventResult.events
    };
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    console.log('🗑️ Suppression de toutes les données...');

    await db.notifications.clear();
    await db.reminderAssignments.clear();
    await db.reminders.clear();
    await db.events.clear();
    await db.students.clear();
    await db.classes.clear();
    await db.users.clear();

    console.log('✅ Base de données vidée');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
};
