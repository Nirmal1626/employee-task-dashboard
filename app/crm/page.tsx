import Link from 'next/link';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { crmTasks } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Northwind CRM' };

export default function CrmHomePage() {
  const tasks = crmTasks();
  return (
    <AppChrome kind="crm">
      <h1 className="text-3xl font-semibold">Open deals</h1>
      <p className="mt-2 text-slate-600">This is the mock CRM. Dashboard links for CRM tasks land here.</p>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
        {tasks.map((task) => (
          <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-blue-800">{task.reference}</p>
              <Link className="font-semibold" href={task.href}>{task.title}</Link>
              <p className="text-sm text-slate-500">{task.account} · {task.employee} · {formatDate(task.deadline)}</p>
            </div>
          </li>
        ))}
      </ul>
    </AppChrome>
  );
}
