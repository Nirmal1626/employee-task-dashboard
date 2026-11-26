# Employee Task Dashboard

Workboard is a small dashboard that brings a team's CRM follow-ups and helpdesk tickets together in one prioritized task list. It uses sample data served by local Next.js API routes; it does not connect to live CRM or support services.

## Features

- View CRM tasks and helpdesk tickets together, or browse each list separately.
- Filter the overview by employee and status, and search by task title, reference, employee, or account.
- See task owner, source, status, urgency, and deadline, with overdue and due-today labels.
- Open a task or ticket for its summary and details.
- Refresh the dashboard; if one data source is unavailable, the other remains visible and can be retried.
- Sort unfinished tasks by deadline and urgency, with completed tasks at the bottom.

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To create and run a production build:

```bash
npm run build
npm start
```

## How it works

The overview requests both task collections from the app's API. The API returns sample records whose deadlines are calculated relative to the current date. Task types, sample records, and deadline-priority helpers live in `lib/`.

| Route | Purpose |
| --- | --- |
| `/` | Combined dashboard with summary counts, filters, search, and prioritized tasks |
| `/crm` | CRM deals list; select a deal to view its details |
| `/helpdesk` | Support tickets list; select a ticket to view its details |
| `/api/crm/tasks` | CRM task data |
| `/api/helpdesk/tasks` | Helpdesk task data |

Both API endpoints return `{ "source": "...", "tasks": [...] }`. Add `?fail=1` to either API URL to simulate a `503` response and see the dashboard's partial-failure and retry behavior.

## Project structure

- `app/` — Next.js App Router pages, API routes, and global styles
- `components/` — shared app navigation and the interactive dashboard
- `lib/types.ts` — task, status, urgency, and API response types
- `lib/tasks.ts` — sample CRM and helpdesk records and lookup helpers
- `lib/priority.ts`, `lib/dates.ts` — sorting, deadline labels, and date formatting

## Tech stack

Next.js 14, React 18, and TypeScript, with Tailwind CSS and PostCSS configured for styling.
