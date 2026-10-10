export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

export class ReminderError extends Error {
  constructor(message: string, public status: 400 | 404 | 409) { super(message); }
}

export class ReminderService {
  private reminders = new Map<string, Reminder>();

  private validate(reminder: Reminder): void {
    const date = new Date(reminder.dueDate);
    if (![reminder.id, reminder.title, reminder.description].every(value => typeof value === 'string' && value.trim()) ||
        typeof reminder.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(reminder.dueDate) ||
        !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== reminder.dueDate ||
        typeof reminder.isCompleted !== 'boolean') {
      throw new ReminderError('Invalid reminder details', 400);
    }
  }

  createReminder(id: string, title: string, description: string, dueDate: string, isCompleted: boolean) {
    const reminder = { id, title, description, dueDate, isCompleted };
    this.validate(reminder);
    if (this.reminders.has(id)) throw new ReminderError('Reminder ID already exists', 409);
    this.reminders.set(id, reminder);
    return { message: 'Reminder created successfully' };
  }

  getReminder(id: string): Reminder {
    const reminder = this.reminders.get(id);
    if (!reminder) throw new ReminderError('Reminder not found', 404);
    return { ...reminder };
  }
  getAllReminders(): Reminder[] { return Array.from(this.reminders.values(), reminder => ({ ...reminder })); }
  updateReminder(id: string, updates: Partial<Omit<Reminder, 'id'>>) {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates) ||
        Object.keys(updates).some(key => !['title', 'description', 'dueDate', 'isCompleted'].includes(key))) {
      throw new ReminderError('Invalid update fields', 400);
    }
    const reminder = { ...this.getReminder(id), ...updates };
    this.validate(reminder);
    this.reminders.set(id, reminder);
    return { message: 'Reminder updated successfully' };
  }
  deleteReminder(id: string) {
    this.getReminder(id);
    this.reminders.delete(id);
    return { message: 'Reminder deleted successfully' };
  }
  markCompleted(id: string) { this.updateReminder(id, { isCompleted: true }); return { message: 'Reminder marked as completed' }; }
  unmarkCompleted(id: string) { this.updateReminder(id, { isCompleted: false }); return { message: 'Reminder unmarked as completed' }; }
  getCompletedReminders() { return this.getAllReminders().filter(reminder => reminder.isCompleted); }
  getNotCompletedReminders() { return this.getAllReminders().filter(reminder => !reminder.isCompleted); }
  getDueTodayReminders() {
    const today = new Date().toISOString().slice(0, 10);
    return this.getAllReminders().filter(reminder => reminder.dueDate === today);
  }
}
