import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { deadlineLabel } from '@/lib/priority';
import { findCrmTask } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { id: string } }) {
  const task = findCrmTask(params.id);
  return { title: task ? `${task.reference} · CRM` : 'CRM task' };
}

export default function CrmTaskPage({ params }: { params: { id: string } }) {
  const task = findCrmTask(params.id);
  if (!task) notFound();
  return (
    <AppChrome kind="crm">
      <div className="chrome-heading">
        <div>
          <p className="eyebrow">Customer relationship</p>
          <p className="detail-reference">{task.reference}</p>
        </div>
        <Link className="button button-secondary" href="/crm">← All deals</Link>
      </div>
      <article className="detail-card">
        <h1 className="detail-title">{task.title}</h1>
        <p className="detail-summary">{task.summary}</p>
        <dl className="detail-fields">
          <Field label="Account" value={task.account} />
          <Field label="Owner" value={task.employee} />
          <Field label="Stage" value={labelStatus(task.status)} />
          <Field label="Urgency" value={labelWord(task.urgency)} />
          <Field label="Close date" value={`${formatDate(task.deadline)} · ${deadlineLabel(task)}`} />
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
