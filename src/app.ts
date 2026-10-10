import { bodyLimit } from 'hono/body-limit';
import { secureHeaders } from 'hono/secure-headers';
import { Hono } from 'hono';
import { ReminderError, ReminderService, type Reminder } from './ReminderService.js';

export function createApp() {
  const app = new Hono();
  app.use('*', secureHeaders());
  app.use('*', bodyLimit({ maxSize: 64 * 1024, onError: c => c.json({ error: 'Request body exceeds 64 KiB' }, 413) }));
  const service = new ReminderService();
  app.onError((error, c) => {
    if (error instanceof ReminderError) return c.json({ error: error.message }, error.status);
    if (error instanceof SyntaxError || error instanceof TypeError) return c.json({ error: 'Invalid JSON request body' }, 400);
    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  });
  app.get('/', c => c.text('Reminder API'));
  app.get('/reminders/completed', c => c.json(service.getCompletedReminders()));
  app.get('/reminders/not-completed', c => c.json(service.getNotCompletedReminders()));
  app.get('/reminders/due-today', c => c.json(service.getDueTodayReminders()));
  app.get('/reminders', c => c.json(service.getAllReminders()));
  app.post('/reminders', async c => {
    const { id, title, description, dueDate, isCompleted } = await c.req.json<Reminder>();
    return c.json(service.createReminder(id, title, description, dueDate, isCompleted), 201);
  });
  app.get('/reminders/:id', c => c.json(service.getReminder(c.req.param('id'))));
  app.patch('/reminders/:id', async c => c.json(service.updateReminder(c.req.param('id'), await c.req.json())));
  app.delete('/reminders/:id', c => c.json(service.deleteReminder(c.req.param('id'))));
  app.post('/reminders/:id/mark-completed', c => c.json(service.markCompleted(c.req.param('id'))));
  app.post('/reminders/:id/unmark-completed', c => c.json(service.unmarkCompleted(c.req.param('id'))));
  return app;
}
