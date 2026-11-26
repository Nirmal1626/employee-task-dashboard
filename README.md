# Employee Task Dashboard

A small React and Node.js app. The dashboard loads tasks from two mock REST APIs, ranks them by deadline and urgency, and links each task to its source application.

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`npm run build` then `npm start` runs the production server.

## What you can do

- See CRM and Helpdesk tasks on one list, with overdue and due-today work first.
- Filter by employee and task status.
- Open a task in Northwind CRM (`/crm`) or Lumen Helpdesk (`/helpdesk`).
- Turn on “CRM unavailable” or “Helpdesk unavailable” to see a failed API while the other source still loads. Retry fetches both again.

## APIs

`GET /api/crm/tasks`

`GET /api/helpdesk/tasks`

Both return `{ "source": "crm" | "helpdesk", "tasks": [ ... ] }`.

Add `?fail=1` to either URL to receive `503` and `{ "error": "..." }`.

Deadlines are calculated from the server date, so the sample overdue and due-today tasks stay meaningful.

## Priority

Completed tasks stay at the bottom. Everything else is scored from how soon the deadline is, then from urgency (`critical`, `high`, `medium`, `low`). A blocked task gets a small extra boost. The dashboard shows that order as P1, P2, and so on.
