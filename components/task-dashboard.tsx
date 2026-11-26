'use client';

import { useEffect, useMemo, useState } from 'react';
import { deadlineLabel, sortByPriority } from '@/lib/priority';
import { formatDate } from '@/lib/dates';
import type { Task, TaskResponse, TaskSource, TaskStatus } from '@/lib/types';

const employees = ['Priya Shah', 'Arjun Mehta', 'Neha Kapoor', 'Rohan Das', 'Ananya Iyer'];

const statuses: { id: TaskStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All statuses' },
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'done', label: 'Done' },
];

const statusLabel: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Done',
};

type SourceState = {
  tasks: Task[];
  error: string | null;
};

const emptySource: SourceState = { tasks: [], error: null };

async function loadSource(source: TaskSource, fail: boolean): Promise<SourceState> {
  const url = fail ? `/api/${source}/tasks?fail=1` : `/api/${source}/tasks`;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const body = (await response.json().catch(() => null)) as TaskResponse | { error?: string } | null;
    if (!response.ok) {
      const message = body && 'error' in body && body.error ? body.error : `${source} returned ${response.status}`;
      return { tasks: [], error: message };
    }
    if (!body || !('tasks' in body) || !Array.isArray(body.tasks)) {
      return { tasks: [], error: `${source} returned an unexpected response.` };
    }
    return { tasks: body.tasks, error: null };
  } catch {
    return { tasks: [], error: `Could not reach the ${source} service.` };
  }
}

export function TaskDashboard() {
  const [employee, setEmployee] = useState('all');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [failCrm, setFailCrm] = useState(false);
  const [failHelpdesk, setFailHelpdesk] = useState(false);
  const [crm, setCrm] = useState<SourceState>(emptySource);
  const [helpdesk, setHelpdesk] = useState<SourceState>(emptySource);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([loadSource('crm', failCrm), loadSource('helpdesk', failHelpdesk)]).then(([crmResult, helpdeskResult]) => {
      if (cancelled) return;
      setCrm(crmResult);
      setHelpdesk(helpdeskResult);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [failCrm, failHelpdesk, reloadKey]);

  const merged = useMemo(() => sortByPriority([...crm.tasks, ...helpdesk.tasks]), [crm.tasks, helpdesk.tasks]);
  const visible = merged.filter((task) => {
    if (employee !== 'all' && task.employee !== employee) return false;
    if (status !== 'all' && task.status !== status) return false;
    return true;
  });
  const active = visible.filter((task) => task.status !== 'done');
  const overdue = active.filter((task) => deadlineLabel(task).startsWith('Overdue')).length;
  const dueToday = active.filter((task) => deadlineLabel(task) === 'Due today').length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Internal tools</p>
            <p className="text-lg font-semibold">Employee Task Dashboard</p>
          </div>
          <div className="flex gap-2 text-sm">
            <a className="rounded-full border border-line px-3 py-1.5 font-medium text-blue-800" href="/crm">CRM</a>
            <a className="rounded-full border border-line px-3 py-1.5 font-medium text-teal-800" href="/helpdesk">Helpdesk</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">Today’s work, ranked</h1>
          <p className="mt-2 text-slate-600">
            Tasks are fetched from the CRM and Helpdesk APIs, then ordered by deadline and urgency. Completed work stays at the bottom.
          </p>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Showing" value={loading ? '—' : String(visible.length)} />
          <Stat label="Overdue" value={loading ? '—' : String(overdue)} tone={overdue > 0 ? 'alert' : 'normal'} />
          <Stat label="Due today" value={loading ? '—' : String(dueToday)} />
          <Stat label="Sources" value={loading ? '—' : sourceSummary(crm.error, helpdesk.error)} />
        </section>

        {(crm.error || helpdesk.error) && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            <p className="font-semibold">One or more sources did not load.</p>
            {crm.error && <p className="mt-1">CRM: {crm.error}</p>}
            {helpdesk.error && <p className="mt-1">Helpdesk: {helpdesk.error}</p>}
            <p className="mt-1">Tasks from the source that responded are still listed.</p>
          </div>
        )}

        <section className="mt-4 rounded-2xl border border-line bg-white p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="block text-sm font-medium">
              Employee
              <select
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2"
                value={employee}
                onChange={(event) => setEmployee(event.target.value)}
              >
                <option value="all">All employees</option>
                {employees.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Task status
              <select
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2"
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus | 'all')}
              >
                {statuses.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <button
              className="self-end rounded-xl border border-line px-4 py-2 text-sm font-semibold"
              type="button"
              onClick={() => {
                setEmployee('all');
                setStatus('all');
              }}
            >
              Reset filters
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="font-medium text-ink">Demo the error handling</span>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={failCrm} onChange={(event) => setFailCrm(event.target.checked)} />
              CRM unavailable
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={failHelpdesk} onChange={(event) => setFailHelpdesk(event.target.checked)} />
              Helpdesk unavailable
            </label>
            <button className="font-semibold text-blue-800" type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Retry
            </button>
          </div>
        </section>

        <section className="mt-4 space-y-3">
          {loading && <p className="rounded-2xl border border-line bg-white px-4 py-8 text-center text-slate-500">Loading tasks from both services…</p>}
          {!loading && visible.length === 0 && (
            <p className="rounded-2xl border border-line bg-white px-4 py-8 text-center text-slate-500">
              No tasks match these filters.
            </p>
          )}
          {!loading && visible.map((task, index) => (
            <article key={task.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-white">
                      {task.status === 'done' ? 'Done' : `P${index + 1}`}
                    </span>
                    <span className={task.source === 'crm' ? 'rounded-full bg-blue-50 px-2 py-1 text-blue-800' : 'rounded-full bg-teal-50 px-2 py-1 text-teal-800'}>
                      {task.source === 'crm' ? 'CRM' : 'Helpdesk'}
                    </span>
                    <span className={urgencyClass(task.urgency)}>{task.urgency}</span>
                    <span className={deadlineClass(deadlineLabel(task))}>{deadlineLabel(task)}</span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold">
                    <a className="hover:text-blue-800" href={task.href}>{task.title}</a>
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {task.reference} · {task.employee} · {statusLabel[task.status]} · {task.account}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Deadline {formatDate(task.deadline)}</p>
                </div>
                <a
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  href={task.href}
                >
                  Open in {task.source === 'crm' ? 'CRM' : 'Helpdesk'}
                </a>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function sourceSummary(crmError: string | null, helpdeskError: string | null) {
  if (crmError && helpdeskError) return 'Both down';
  if (crmError) return 'Helpdesk only';
  if (helpdeskError) return 'CRM only';
  return 'Both online';
}

function Stat({ label, value, tone = 'normal' }: { label: string; value: string; tone?: 'normal' | 'alert' }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone === 'alert' ? 'text-red-700' : ''}`}>{value}</p>
    </div>
  );
}

function urgencyClass(urgency: Task['urgency']) {
  if (urgency === 'critical') return 'rounded-full bg-red-50 px-2 py-1 capitalize text-red-800';
  if (urgency === 'high') return 'rounded-full bg-orange-50 px-2 py-1 capitalize text-orange-800';
  if (urgency === 'medium') return 'rounded-full bg-amber-50 px-2 py-1 capitalize text-amber-900';
  return 'rounded-full bg-slate-100 px-2 py-1 capitalize text-slate-700';
}

function deadlineClass(label: string) {
  if (label.startsWith('Overdue')) return 'rounded-full bg-red-700 px-2 py-1 text-white';
  if (label === 'Due today') return 'rounded-full bg-amber-500 px-2 py-1 text-white';
  if (label === 'Completed') return 'rounded-full bg-emerald-50 px-2 py-1 text-emerald-800';
  return 'rounded-full bg-slate-100 px-2 py-1 text-slate-700';
}
