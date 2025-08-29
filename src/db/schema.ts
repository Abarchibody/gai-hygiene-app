import Dexie, { type Table } from 'dexie';
import type { User, Class, Student, Reminder, ReminderAssignment, Notification, Event } from '../types';

export class GAIDatabase extends Dexie {
  users!: Table<User>;
  classes!: Table<Class>;
  students!: Table<Student>;
  reminders!: Table<Reminder>;
  reminderAssignments!: Table<ReminderAssignment>;
  notifications!: Table<Notification>;
  events!: Table<Event>;

  constructor() {
    super('GAIDatabase');
    this.version(1).stores({
      users: '++id, nom, prenom, email, password, type_utilisateur, created_at',
      classes: '++id, nom_classe, niveau, enseignant_id, created_at',
      students: '++id, utilisateur_id, classe_id, parent_id, created_at',
      reminders: '++id, titre, categorie, statut, createur_id, created_at',
      reminderAssignments: '++id, rappel_id, utilisateur_id, classe_id, created_at',
      notifications: '++id, type, status, recipient_id, reminder_id, scheduled_at, created_at'
    });
    this.version(2).stores({
      users: '++id, nom, prenom, email, password, type_utilisateur, created_at',
      classes: '++id, nom_classe, niveau, enseignant_id, created_at',
      students: '++id, utilisateur_id, classe_id, parent_id, created_at',
      reminders: '++id, titre, categorie, statut, createur_id, created_at',
      reminderAssignments: '++id, rappel_id, utilisateur_id, classe_id, created_at',
      notifications: '++id, type, status, recipient_id, reminder_id, scheduled_at, created_at',
      events: '++id, titre, type_activite, date_debut, responsable_id, created_at'
    });
  }
}

export const db = new GAIDatabase();