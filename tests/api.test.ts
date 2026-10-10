import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

const body = { id: 'one', title: 'Study', description: 'Notes', dueDate: new Date().toISOString().slice(0, 10), isCompleted: false };
const json = (method: string, data: unknown) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
test('create, filter, complete, update, and delete through HTTP', async () => {
  const app = createApp();
  assert.equal((await app.request('/reminders', json('POST', body))).status, 201);
  assert.equal((await (await app.request('/reminders/due-today')).json()).length, 1);
  assert.equal((await app.request('/reminders/one/mark-completed', { method: 'POST' })).status, 200);
  assert.equal((await (await app.request('/reminders/completed')).json()).length, 1);
  assert.equal((await (await app.request('/reminders/not-completed')).json()).length, 0);
  assert.equal((await app.request('/reminders/one', json('PATCH', { title: 'Updated' }))).status, 200);
  assert.equal((await (await app.request('/reminders/one')).json()).title, 'Updated');
  assert.equal((await app.request('/reminders/one', { method: 'DELETE' })).status, 200);
  assert.equal((await app.request('/reminders/one')).status, 404);
});
test('duplicate IDs and invalid update bodies do not corrupt data', async () => {
  const app = createApp();
  await app.request('/reminders', json('POST', body));
  assert.equal((await app.request('/reminders', json('POST', body))).status, 409);
  assert.equal((await app.request('/reminders/one', json('PATCH', { id: 'other' }))).status, 400);
  assert.equal((await app.request('/reminders/one', json('PATCH', { dueDate: '2026-02-30' }))).status, 400);
  assert.equal((await (await app.request('/reminders/one')).json()).id, 'one');
});
test('empty collections and malformed requests', async () => {
  const app = createApp();
  assert.deepEqual(await (await app.request('/reminders')).json(), []);
  assert.equal((await app.request('/reminders', json('POST', { ...body, isCompleted: 'false' }))).status, 400);
  assert.equal((await app.request('/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
});
