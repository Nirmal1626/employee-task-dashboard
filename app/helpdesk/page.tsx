import Link from 'next/link';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { helpdeskTasks } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Lumen Helpdesk' };

export default function HelpdeskHomePage() {
  const tasks = helpdeskTasks();
  return (
    <AppChrome kind="helpdesk">
      <h1 className="text-3xl font-semibold">Ticket queue</h1>
      <p className="mt-2 text-slate-600">This is the mock Helpdesk. Dashboard links for support tasks land here.</p>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
        {tasks.map((task) => (
          <li key={task.id} className="px-4 py-3">
            <p className="text-xs font-semibold text-teal-800">{task.reference}</p>
            <Link className="font-semibold" href={task.href}>{task.title}</Link>
            <p className="text-sm text-slate-500">{task.account} · {task.employee} · {formatDate(task.deadline)}</p>
          </li>
        ))}
      </ul>
    </AppChrome>
  );
}
