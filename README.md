# Reminder REST API · Hono & TypeScript

[![CI](https://github.com/mgpavankumar/ASSIGNMENT-4/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mgpavankumar/ASSIGNMENT-4/actions/workflows/ci.yml)

A reminder HTTP API with a typed service, request validation, and automated lifecycle checks.

**Author:** [M. G. Pavan Kumar](https://github.com/mgpavankumar)
**Status:** Educational project

## Features

- Create, retrieve, update, and delete reminders
- Mark reminders completed or incomplete
- Filter reminders by completion or UTC due date

## Getting started

Install Node.js 22 or newer and npm. Clone this repository:

```bash
git clone https://github.com/mgpavankumar/ASSIGNMENT-4.git
cd ASSIGNMENT-4
```

```bash
npm ci
```

```bash
npm run build
npm start
```

`npm start` runs the TypeScript entry point with the Node.js `tsx` loader. `npm run build` emits JavaScript into `dist/src`. `npm run dev` watches source files. The server listens on port 3000 unless `PORT` is set.

## Tests

```bash
npm run typecheck
npm test
```

See [TEST_RESULTS.md](TEST_RESULTS.md) for recorded local verification and its limits.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/ReminderService.ts` | Typed reminder operations and validation |
| `src/app.ts` | HTTP application, routes, and request validation |
| `src/index.ts` | Server entry point |
| `src/rem_id.ts` | Application logic and/or demonstration |
| `src/reminder.ts` | Server entry point |
| `tests/` | Automated regression checks |
| `tsconfig.json` | Strict ESM compilation settings |

## Current behavior and limitations

Records are held in memory and disappear when the process stops. This learning API has no authentication or access control. Due dates use `YYYY-MM-DD`; the due-today filter uses UTC. `npm run reminder` and `npm run rem-id` are compatibility aliases for the same repaired server. Empty lists return HTTP 200 with an empty array.

## HTTP routes

| Method | Path |
| --- | --- |
| GET | `/` |
| GET | `/reminders/completed` |
| GET | `/reminders/not-completed` |
| GET | `/reminders/due-today` |
| GET | `/reminders` |
| POST | `/reminders` |
| GET | `/reminders/:id` |
| PATCH | `/reminders/:id` |
| DELETE | `/reminders/:id` |
| POST | `/reminders/:id/mark-completed` |
| POST | `/reminders/:id/unmark-completed` |

## Try the API

With the server running, create a synthetic reminder:

```bash
curl -i http://localhost:3000/reminders -H 'Content-Type: application/json' -d '{"id":"demo-study","title":"Study","description":"Review TypeScript","dueDate":"2026-12-31","isCompleted":false}'
curl -i http://localhost:3000/reminders/demo-study
curl -i -X POST http://localhost:3000/reminders/demo-study/mark-completed
```

Expect HTTP 201 for creation and HTTP 200 for retrieval and completion. Reusing the same ID returns 409. On Windows PowerShell use `curl.exe`.

## Contributing

Keep changes focused, use synthetic data, and include steps or tests demonstrating the fix. Do not commit local configuration or credentials.
