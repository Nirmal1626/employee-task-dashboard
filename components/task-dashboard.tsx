'use client';

import { useEffect, useMemo, useState } from 'react';
import { deadlineLabel, sortByPriority } from '@/lib/priority';
import { formatDate } from '@/lib/dates';
import type { Task, TaskResponse, TaskSource, TaskStatus } from '@/lib/types';

const employees = ['Priya Shah', 'Arjun Mehta', 'Neha Kapoor', 'Rohan Das', 'Ananya Iyer'];

const statuses: { id: TaskStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All tasks' },
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

async function loadSource(source: TaskSource): Promise<SourceState> {
  try {
    const response = await fetch(`/api/${source}/tasks`, { cache: 'no-store' });
    const body = (await response.json().catch(() => null)) as TaskResponse | { error?: string } | null;
    if (!response.ok) {
      const message = body && 'error' in body && body.error ? body.error : `Request failed (${response.status})`;
      return { tasks: [], error: message };
    }
    if (!body || !('tasks' in body) || !Array.isArray(body.tasks)) {
      return { tasks: [], error: 'Unexpected response.' };
    }
    return { tasks: body.tasks, error: null };
  } catch {
    return { tasks: [], error: 'Could not reach the server.' };
  }
}

export function TaskDashboard() {
  const [employee, setEmployee] = useState('all');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [crm, setCrm] = useState<SourceState>(emptySource);
  const [helpdesk, setHelpdesk] = useState<SourceState>(emptySource);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([loadSource('crm'), loadSource('helpdesk')]).then(([crmResult, helpdeskResult]) => {
      if (cancelled) return;
      setCrm(crmResult);
      setHelpdesk(helpdeskResult);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const merged = useMemo(() => sortByPriority([...crm.tasks, ...helpdesk.tasks]), [crm.tasks, helpdesk.tasks]);
  const normalizedQuery = query.trim().toLowerCase();
  const visible = merged.filter((task) => {
    if (employee !== 'all' && task.employee !== employee) return false;
    if (status !== 'all' && task.status !== status) return false;
    if (
      normalizedQuery &&
      ![task.title, task.reference, task.employee, task.account].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      )
    ) return false;
    return true;
  });
  const overdue = merged.filter((task) => task.status !== 'done' && deadlineLabel(task).startsWith('Overdue')).length;
  const openCount = merged.filter((task) => task.status !== 'done').length;
  const blockedCount = merged.filter((task) => task.status === 'blocked').length;
  const dateLabel = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="/" aria-label="Workboard home">
            <span className="brand-mark" aria-hidden="true">w</span>
            <span>workboard</span>
          </a>
          <nav className="primary-nav" aria-label="Main navigation">
            <a className="nav-link nav-link-active" href="/">Overview</a>
            <a className="nav-link" href="/crm">CRM</a>
            <a className="nav-link" href="/helpdesk">Helpdesk</a>
          </nav>
          <span className="header-note">Your team, in sync</span>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">{dateLabel}</p>
            <h1 className="page-title">Good work starts with a clear view.</h1>
            <p className="page-intro">The team's CRM and support work, together in one place.</p>
          </div>
          <button
            className="button button-secondary refresh-button"
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            disabled={loading}
          >
            <span aria-hidden="true" className={loading ? 'refresh-icon is-spinning' : 'refresh-icon'}>↻</span>
            {loading ? 'Refreshing' : 'Refresh'}
          </button>
        </div>

        <section className="summary-grid" aria-label="Task summary">
          <article className="summary-card">
            <span className="summary-label">In the queue</span>
            <strong className="summary-number">{loading ? '—' : openCount}</strong>
            <span className="summary-note">tasks still in progress</span>
          </article>
          <article className="summary-card summary-card-warm">
            <span className="summary-label">Past their due date</span>
            <strong className="summary-number">{loading ? '—' : overdue}</strong>
            <span className="summary-note">could use a follow-up</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Waiting on someone</span>
            <strong className="summary-number">{loading ? '—' : blockedCount}</strong>
            <span className="summary-note">blocked tasks</span>
          </article>
        </section>

        {(crm.error || helpdesk.error) && (
          <div className="notice notice-error" role="alert">
            <div>
              <strong>Some tasks couldn’t be loaded.</strong>
              {crm.error && <p>CRM: {crm.error}</p>}
              {helpdesk.error && <p>Helpdesk: {helpdesk.error}</p>}
              <p>The other list is still available.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Try again
            </button>
          </div>
        )}

        <section className="task-section" aria-labelledby="task-list-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The work list</p>
              <h2 id="task-list-heading">Tasks that need a look</h2>
            </div>
            <span className="result-count" aria-live="polite">
              {loading ? 'Loading tasks…' : `${visible.length} ${visible.length === 1 ? 'task' : 'tasks'}`}
            </span>
          </div>

          <div className="filter-panel">
            <div className="status-filters" role="group" aria-label="Filter by status">
              {statuses.map((item) => (
                <button
                  className={`filter-button${status === item.id ? ' filter-button-active' : ''}`}
                  key={item.id}
                  type="button"
                  aria-pressed={status === item.id}
                  onClick={() => setStatus(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="secondary-filters">
              <label className="select-wrap">
                <span className="sr-only">Filter by employee</span>
                <select value={employee} onChange={(event) => setEmployee(event.target.value)}>
                  <option value="all">Everyone</option>
                  {employees.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label className="search-wrap">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <span className="sr-only">Search tasks</span>
                <input
                  type="search"
                  placeholder="Find a task"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="task-list">
            {loading && <div className="empty-state"><span className="loading-dot" />Loading the latest tasks…</div>}
            {!loading && visible.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-mark" aria-hidden="true">✓</span>
                <strong>Nothing to see here.</strong>
                <span>Try another status or search for something else.</span>
              </div>
            )}
            {!loading && visible.map((task) => {
              const due = deadlineLabel(task);
              return (
                <article className="task-row" key={`${task.source}-${task.id}`}>
                  <div className={`task-priority priority-${task.urgency}`} aria-hidden="true" />
                  <div className="task-primary">
                    <a className="task-title" href={task.href}>{task.title}</a>
                    <div className="task-meta">
                      <span>{task.reference}</span>
                      <span className="meta-divider" aria-hidden="true">·</span>
                      <span>{task.account}</span>
                    </div>
                  </div>
                  <div className="task-owner">
                    <span className="avatar" aria-hidden="true">{initials(task.employee)}</span>
                    <span>{task.employee}</span>
                  </div>
                  <div className="task-labels">
                    <span className={`status-pill status-${task.status}`}>{statusLabel[task.status]}</span>
                    <span className={`urgency-label urgency-text-${task.urgency}`}>{labelWord(task.urgency)} priority</span>
                  </div>
                  <div className={`task-due${due.startsWith('Overdue') ? ' task-due-overdue' : due === 'Due today' ? ' task-due-today' : ''}`}>
                    <span>{formatDate(task.deadline)}</span>
                    <small>{due}</small>
                  </div>
                  <a className="source-link" href={task.href} aria-label={`Open ${task.reference}`}>
                    {task.source === 'crm' ? 'CRM' : 'Support'} <span aria-hidden="true">↗</span>
                  </a>
                </article>
              );
            })}
          </div>
          <p className="list-footnote">Sorted by what’s due soonest and most urgent.</p>
        </section>
      </main>
      <footer className="site-footer">
        <span>workboard</span>
        <span>A little more clarity, every day.</span>
      </footer>
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('');
}

function labelWord(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
