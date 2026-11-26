import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { deadlineLabel } from '@/lib/priority';
import { findHelpdeskTask } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { id: string } }) {
  const task = findHelpdeskTask(params.id);
  return { title: task ? `${task.reference} · Helpdesk` : 'Helpdesk ticket' };
}

export default function HelpdeskTicketPage({ params }: { params: { id: string } }) {
  const task = findHelpdeskTask(params.id);
  if (!task) notFound();
  return (
    <AppChrome kind="helpdesk">
      <div className="chrome-heading">
        <div>
          <p className="eyebrow">Help for the day-to-day</p>
          <p className="detail-reference">{task.reference}</p>
        </div>
        <Link className="button button-secondary" href="/helpdesk">← All tickets</Link>
      </div>
      <article className="detail-card">
        <h1 className="detail-title">{task.title}</h1>
        <p className="detail-summary">{task.summary}</p>
        <dl className="detail-fields">
          <Field label="Area" value={task.account} />
          <Field label="Assignee" value={task.employee} />
          <Field label="Status" value={labelStatus(task.status)} />
          <Field label="Urgency" value={labelWord(task.urgency)} />
          <Field label="Due" value={`${formatDate(task.deadline)} · ${deadlineLabel(task)}`} />
        </dl>
        <div className="detail-actions">
          <Link className="button button-secondary" href="/">View all tasks</Link>
        </div>
      </article>
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
    <div className="detail-field">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
