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
    created_at: new Date('2025-08-01'),
    updated_at: new Date('2025-08-30')
  },

  // Enseignants (6 enseignants)
  {
    nom: 'Mukendi',
    prenom: 'Jean-Pierre',
    email: 'jp.mukendi@gai.cd',
    telephone: '+243 81 234 5678',
    password: 'Password123!',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2025-08-15'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kabongo',
    prenom: 'Marie-Claire',
    email: 'mc.kabongo@gai.cd',
    telephone: '+243 82 345 6789',
    password: 'Password123!',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2025-08-20'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Tshilanda',
    prenom: 'Paul',
    email: 'p.tshilanda@gai.cd',
    telephone: '+243 83 456 7890',
    password: 'Password123!',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2025-08-22'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Lumingu',
    prenom: 'Antoinette',
    email: 'a.lumingu@gai.cd',
    telephone: '+243 84 567 8901',
    password: 'Password123!',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2025-08-23'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kalala',
    prenom: 'François',
    email: 'f.kalala@gai.cd',
    telephone: '+243 85 678 9012',
    password: 'Password123!',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2025-08-24'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Mbala',
    prenom: 'Thérèse',
    email: 't.mbala@gai.cd',
    telephone: '+243 86 789 0123',
    password: 'Password123!',
    type_utilisateur: 'Enseignant',
    created_at: new Date('2025-08-25'),
    updated_at: new Date('2025-08-30')
  },

  // Parents (10 parents)
  {
    nom: 'Mbuyi',
    prenom: 'Françoise',
    email: 'f.mbuyi@gai.cd',
    telephone: '+243 87 890 1234',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-26'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kasongo',
    prenom: 'Robert',
    email: 'r.kasongo@gai.cd',
    telephone: '+243 88 901 2345',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-26'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Ngandu',
    prenom: 'Célestine',
    email: 'c.ngandu@gai.cd',
    telephone: '+243 89 012 3456',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-27'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Ilunga',
    prenom: 'Joseph',
    email: 'j.ilunga@gai.cd',
    telephone: '+243 90 123 4567',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-27'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kalonji',
    prenom: 'Bernadette',
    email: 'b.kalonji@gai.cd',
    telephone: '+243 91 234 5678',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-28'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Mutombo',
    prenom: 'André',
    email: 'a.mutombo@gai.cd',
    telephone: '+243 92 345 6789',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-28'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kabila',
    prenom: 'Jeanne',
    email: 'j.kabila@gai.cd',
    telephone: '+243 93 456 7890',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-29'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Lumumba',
    prenom: 'Patrick',
    email: 'p.lumumba@gai.cd',
    telephone: '+243 94 567 8901',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-29'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Tshisekedi',
    prenom: 'Olive',
    email: 'o.tshisekedi@gai.cd',
    telephone: '+243 95 678 9012',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-29'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Bemba',
    prenom: 'Claude',
    email: 'c.bemba@gai.cd',
    telephone: '+243 96 789 0123',
    password: 'Password123!',
    type_utilisateur: 'Parent',
    created_at: new Date('2025-08-29'),
    updated_at: new Date('2025-08-30')
  },

  // Élèves (20 élèves)
  {
    nom: 'Mbuyi',
    prenom: 'Grace',
    email: 'grace.mbuyi@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Mbuyi',
    prenom: 'David',
    email: 'david.mbuyi@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kasongo',
    prenom: 'Sarah',
    email: 'sarah.kasongo@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kasongo',
    prenom: 'Michel',
    email: 'michel.kasongo@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Ngandu',
    prenom: 'Emmanuel',
    email: 'emmanuel.ngandu@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Ngandu',
    prenom: 'Esther',
    email: 'esther.ngandu@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Ilunga',
    prenom: 'Samuel',
    email: 'samuel.ilunga@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Ilunga',
    prenom: 'Ruth',
    email: 'ruth.ilunga@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kalonji',
    prenom: 'Daniel',
    email: 'daniel.kalonji@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kalonji',
    prenom: 'Marie',
    email: 'marie.kalonji@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Mutombo',
    prenom: 'Jean',
    email: 'jean.mutombo@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Mutombo',
    prenom: 'Prisca',
    email: 'prisca.mutombo@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kabila',
    prenom: 'Joseph',
    email: 'joseph.kabila@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Kabila',
    prenom: 'Gloire',
    email: 'gloire.kabila@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Lumumba',
    prenom: 'Patrice',
    email: 'patrice.lumumba@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Lumumba',
    prenom: 'Julienne',
    email: 'julienne.lumumba@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Tshisekedi',
    prenom: 'Félix',
    email: 'felix.tshisekedi@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Tshisekedi',
    prenom: 'Denise',
    email: 'denise.tshisekedi@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Bemba',
    prenom: 'Bemba',
    email: 'bemba.bemba@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom: 'Bemba',
    prenom: 'Claudine',
    email: 'claudine.bemba@gai.cd',
    telephone: '',
    password: 'Password123!',
    type_utilisateur: 'Élève',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
  }
];

// Données de test pour les classes
const sampleClasses: Omit<Class, 'id' | 'enseignant_id'>[] = [
  // Classes Primaires
  {
    nom_classe: 'CP1 A',
    niveau: 'Primaire',
    created_at: new Date('2025-08-25'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom_classe: 'CP1 B',
    niveau: 'Primaire',
    created_at: new Date('2025-08-26'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom_classe: 'CP2 A',
    niveau: 'Primaire',
    created_at: new Date('2025-08-27'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom_classe: 'CE1 A',
    niveau: 'Primaire',
    created_at: new Date('2025-08-28'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom_classe: 'CE2 A',
    niveau: 'Primaire',
    created_at: new Date('2025-08-29'),
    updated_at: new Date('2025-08-30')
  },
  // Classes Secondaires
  {
    nom_classe: '6ème A',
    niveau: 'Secondaire',
    created_at: new Date('2025-08-29'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom_classe: '5ème A',
    niveau: 'Secondaire',
    created_at: new Date('2025-08-29'),
    updated_at: new Date('2025-08-30')
  },
  {
    nom_classe: '4ème A',
    niveau: 'Secondaire',
    created_at: new Date('2025-08-30'),
    updated_at: new Date('2025-08-30')
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

    // Relations parent-élève basées sur les noms de famille + distribution équitable dans les classes
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const parent = parents.find(p => p.nom === student.nom);
      // Distribuer équitablement les élèves dans les classes
      const assignedClass = classes[i % classes.length];

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

    // Ajouter les rappels d'hygiène de test avec assignations complètes
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