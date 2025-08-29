import Dexie, { type Table } from 'dexie';
import type { User, Class, Student } from '../types';

export class GAIDatabase extends Dexie {
  users!: Table<User>;
  classes!: Table<Class>;
  students!: Table<Student>;

  constructor() {
    super('GAIDatabase');
    this.version(1).stores({
      users: '++id, nom, prenom, email, type_utilisateur, created_at',
      classes: '++id, nom_classe, niveau, enseignant_id, created_at',
      students: '++id, utilisateur_id, classe_id, parent_id, created_at'
    });
  }
}

export const db = new GAIDatabase();