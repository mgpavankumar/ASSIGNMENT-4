# Reminder REST API · Hono & TypeScript

A reminder API learning project using Hono, with a service class and two server examples.

**Author:** [M. G. Pavan Kumar](https://github.com/mgpavankumar)  
**Status:** Educational project

## Features

- Create, retrieve, update, and delete reminders
- Mark reminders completed or incomplete
- Service methods for completed, incomplete, and due-today reminders

## Getting started

Install Node.js and npm. Clone this repository:

```bash
git clone https://github.com/mgpavankumar/ASSIGNMENT-4.git
cd ASSIGNMENT-4
```

```bash
npm install
npm run reminder
```

## Project structure

| Path | Purpose |
| --- | --- |
| `src/reminder.ts` | Fuller reminder HTTP API |
| `src/ReminderService.ts` | Reminder operations and filters |
| `src/rem_id.ts` | Minimal create/read HTTP example |
| `src/index.ts` | Standalone Hono greeting server |

## Current behavior and limitations

`npm run reminder` runs the fuller server; `npm run rem-id` runs the smaller create/read example. Run only one server at a time because both use port 3000. The current `test` script watches a service file and is not an automated test suite. The committed package-lock.json contains ignore-file text rather than a valid npm lockfile; regenerate it before using npm ci. Static filter paths are declared after `/reminders/:id` and should be checked for route conflicts. Data is held in memory.

## Routes declared in the source

The static-route matching limitation above applies to this inventory.

| Method | Path |
| --- | --- |
| GET | `/` |
| POST | `/reminders` |
| GET | `/reminders/:id` |
| GET | `/reminders` |
| PATCH | `/reminders/:id` |
| DELETE | `/reminders/:id` |
| POST | `/reminders/:id/mark-completed` |
| POST | `/reminders/:id/unmark-completed` |
| GET | `/reminders/completed` |
| GET | `/reminders/not-completed` |
| GET | `/reminders/due-today` |

## Example request

With the fuller reminder server running:

```bash
curl -X POST http://localhost:3000/reminders -H "Content-Type: application/json" -d '{"id":"reminder-1","title":"Study","description":"Review TypeScript","dueDate":"2026-10-15","isCompleted":false}'
curl http://localhost:3000/reminders/reminder-1
```

On Windows PowerShell, use `curl.exe` or an API client and send the same JSON body.

## Planned improvements

- Regenerate a valid dependency lockfile
- Check static route matching and improve request validation
- Add persistence and actual API tests

## Contributing

Open an issue describing the problem or proposed improvement. Keep pull requests focused and include the steps used to verify changes. Use sample data and keep credentials out of commits.

## Verification

This documentation was checked against the committed source files, dependency declarations, and route definitions. Installation, compilation, database setup, and runtime behavior have not been verified by this documentation update. There is no automated test suite in the current repository.
