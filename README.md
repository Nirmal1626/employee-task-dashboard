# Employee Task Dashboard

A small React app. The home page loads tasks from two mock APIs, a CRM and a helpdesk, and sorts them by deadline and urgency.

## Setup

Node 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`npm run build` and `npm start` run the production build.

## Using it

Filter by employee and status. Each row links to the deal or ticket it came from.

`GET /api/crm/tasks` and `GET /api/helpdesk/tasks` return `{ source, tasks }`.

If one of those calls fails, the dashboard still shows the other list and a retry button. Add `?fail=1` to either URL to force a 503.

Done tasks stay at the bottom. The rest are ordered by how close the deadline is, then by urgency.
