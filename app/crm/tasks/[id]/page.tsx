import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { deadlineLabel } from '@/lib/priority';
import { findCrmTask } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { id: string } }) {
  const task = findCrmTask(params.id);
  return { title: task ? `${task.reference} — Northwind CRM` : 'CRM task' };
}

export default function CrmTaskPage({ params }: { params: { id: string } }) {
  const task = findCrmTask(params.id);
  if (!task) notFound();
  return (
    <AppChrome kind="crm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">{task.reference}</p>
      <h1 className="mt-2 text-3xl font-semibold">{task.title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{task.summary}</p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <Field label="Account" value={task.account} />
        <Field label="Owner" value={task.employee} />
        <Field label="Stage" value={labelStatus(task.status)} />
        <Field label="Urgency" value={labelWord(task.urgency)} />
        <Field label="Close date" value={formatDate(task.deadline)} />
        <Field label="Timing" value={deadlineLabel(task)} />
      </dl>
      <Link className="mt-6 inline-block text-sm font-semibold text-blue-800" href="/crm">All CRM deals</Link>
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
