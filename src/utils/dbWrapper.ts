import { db } from '../db/schema';
import { syncService } from './syncService';
import type { User, Class, Student, Reminder, ReminderAssignment, Notification, Event } from '../types';

class DatabaseWrapper {
  // Users
  async createUser(user: Omit<User, 'id'>): Promise<number> {
    const id = await db.users.add(user) as number;
    await syncService.createRecord('users', { ...user, id });
    return id;
  }

  async updateUser(id: number, changes: Partial<User>): Promise<void> {
    await db.users.update(id, changes);
    const updated = await db.users.get(id);
    if (updated) {
      await syncService.updateRecord('users', updated);
    }
  }

  async deleteUser(id: number): Promise<void> {
    const user = await db.users.get(id);
    await db.users.delete(id);
    if (user) {
      await syncService.deleteRecord('users', user);
    }
  }

  // Classes
  async createClass(classe: Omit<Class, 'id'>): Promise<number> {
    const id = await db.classes.add(classe) as number;
    await syncService.createRecord('classes', { ...classe, id });
    return id;
  }

  async updateClass(id: number, changes: Partial<Class>): Promise<void> {
    await db.classes.update(id, changes);
    const updated = await db.classes.get(id);
    if (updated) {
      await syncService.updateRecord('classes', updated);
    }
  }

  async deleteClass(id: number): Promise<void> {
    const classe = await db.classes.get(id);
    await db.classes.delete(id);
    if (classe) {
      await syncService.deleteRecord('classes', classe);
    }
  }

  // Students
  async createStudent(student: Omit<Student, 'id'>): Promise<number> {
    const id = await db.students.add(student) as number;
    await syncService.createRecord('students', { ...student, id });
    return id;
  }

  async updateStudent(id: number, changes: Partial<Student>): Promise<void> {
    await db.students.update(id, changes);
    const updated = await db.students.get(id);
    if (updated) {
      await syncService.updateRecord('students', updated);
    }
  }

  async deleteStudent(id: number): Promise<void> {
    const student = await db.students.get(id);
    await db.students.delete(id);
    if (student) {
      await syncService.deleteRecord('students', student);
    }
  }

  // Reminders
  async createReminder(reminder: Omit<Reminder, 'id'>): Promise<number> {
    const id = await db.reminders.add(reminder) as number;
    await syncService.createRecord('reminders', { ...reminder, id });
    return id;
  }

  async updateReminder(id: number, changes: Partial<Reminder>): Promise<void> {
    await db.reminders.update(id, changes);
    const updated = await db.reminders.get(id);
    if (updated) {
      await syncService.updateRecord('reminders', updated);
    }
  }

  async deleteReminder(id: number): Promise<void> {
    const reminder = await db.reminders.get(id);
    await db.reminders.delete(id);
    if (reminder) {
      await syncService.deleteRecord('reminders', reminder);
    }
  }

  // Reminder Assignments
  async createReminderAssignment(assignment: Omit<ReminderAssignment, 'id'>): Promise<number> {
    const id = await db.reminderAssignments.add(assignment) as number;
    await syncService.createRecord('reminder_assignments', { ...assignment, id });
    return id;
  }

  async updateReminderAssignment(id: number, changes: Partial<ReminderAssignment>): Promise<void> {
    await db.reminderAssignments.update(id, changes);
    const updated = await db.reminderAssignments.get(id);
    if (updated) {
      await syncService.updateRecord('reminder_assignments', updated);
    }
  }

  async deleteReminderAssignment(id: number): Promise<void> {
    const assignment = await db.reminderAssignments.get(id);
    await db.reminderAssignments.delete(id);
    if (assignment) {
      await syncService.deleteRecord('reminder_assignments', assignment);
    }
  }

  // Notifications
  async createNotification(notification: Omit<Notification, 'id'>): Promise<number> {
    const id = await db.notifications.add(notification) as number;
    await syncService.createRecord('notifications', { ...notification, id });
    return id;
  }

  async updateNotification(id: number, changes: Partial<Notification>): Promise<void> {
    await db.notifications.update(id, changes);
    const updated = await db.notifications.get(id);
    if (updated) {
      await syncService.updateRecord('notifications', updated);
    }
  }

  async deleteNotification(id: number): Promise<void> {
    const notification = await db.notifications.get(id);
    await db.notifications.delete(id);
    if (notification) {
      await syncService.deleteRecord('notifications', notification);
    }
  }

  // Events
  async createEvent(event: Omit<Event, 'id'>): Promise<number> {
    const id = await db.events.add(event) as number;
    await syncService.createRecord('events', { ...event, id });
    return id;
  }

  async updateEvent(id: number, changes: Partial<Event>): Promise<void> {
    await db.events.update(id, changes);
    const updated = await db.events.get(id);
    if (updated) {
      await syncService.updateRecord('events', updated);
    }
  }

  async deleteEvent(id: number): Promise<void> {
    const event = await db.events.get(id);
    await db.events.delete(id);
    if (event) {
      await syncService.deleteRecord('events', event);
    }
  }

  // Bulk operations
  async bulkCreateReminderAssignments(assignments: Omit<ReminderAssignment, 'id'>[]): Promise<void> {
    const ids = await db.reminderAssignments.bulkAdd(assignments, { allKeys: true });
    
    // Sync each assignment to cloud
    for (let i = 0; i < assignments.length; i++) {
      const assignment = { ...assignments[i], id: ids[i] as number };
      await syncService.createRecord('reminder_assignments', assignment);
    }
  }

  async bulkDeleteReminderAssignments(rappelId: number): Promise<void> {
    const assignments = await db.reminderAssignments.where('rappel_id').equals(rappelId).toArray();
    await db.reminderAssignments.where('rappel_id').equals(rappelId).delete();
    
    // Sync deletions to cloud
    for (const assignment of assignments) {
      await syncService.deleteRecord('reminder_assignments', assignment);
    }
  }

  // Read operations (no sync needed, just pass through to db)
  get users() { return db.users; }
  get classes() { return db.classes; }
  get students() { return db.students; }
  get reminders() { return db.reminders; }
  get reminderAssignments() { return db.reminderAssignments; }
  get notifications() { return db.notifications; }
  get events() { return db.events; }
}

export const dbWrapper = new DatabaseWrapper();