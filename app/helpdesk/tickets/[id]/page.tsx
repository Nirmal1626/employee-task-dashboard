import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { deadlineLabel } from '@/lib/priority';
import { findHelpdeskTask } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { id: string } }) {
  const task = findHelpdeskTask(params.id);
  return { title: task ? `${task.reference} — Lumen Helpdesk` : 'Helpdesk ticket' };
}

export default function HelpdeskTicketPage({ params }: { params: { id: string } }) {
  const task = findHelpdeskTask(params.id);
  if (!task) notFound();
  return (
    <AppChrome kind="helpdesk">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">{task.reference}</p>
      <h1 className="mt-2 text-3xl font-semibold">{task.title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{task.summary}</p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <Field label="Requester area" value={task.account} />
        <Field label="Assignee" value={task.employee} />
        <Field label="Status" value={labelStatus(task.status)} />
        <Field label="Severity" value={labelWord(task.urgency)} />
        <Field label="SLA deadline" value={formatDate(task.deadline)} />
        <Field label="Timing" value={deadlineLabel(task)} />
      </dl>
      <Link className="mt-6 inline-block text-sm font-semibold text-teal-800" href="/helpdesk">All tickets</Link>
    </AppChrome>
  );
}

function labelStatus(status: string) {
  if (status === 'in_progress') return 'In progress';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function labelWord(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
