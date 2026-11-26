import Link from 'next/link';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { helpdeskTasks } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Helpdesk' };

export default function HelpdeskHomePage() {
  const tasks = helpdeskTasks();
  return (
    <AppChrome kind="helpdesk">
      <div className="chrome-heading">
        <div>
          <p className="eyebrow">Help for the day-to-day</p>
          <h1>Support tickets</h1>
          <p>Small fixes and urgent requests, tracked without the fuss.</p>
        </div>
        <Link className="button button-secondary" href="/">← All tasks</Link>
      </div>
      <div className="chrome-list">
        <table className="chrome-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Area</th>
              <th>Assignee</th>
              <th>Due date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <Link className="table-primary" href={task.href}>{task.title}</Link>
                  <span className="table-reference">{task.reference}</span>
                </td>
                <td>{task.account}</td>
                <td>{task.employee}</td>
                <td>{formatDate(task.deadline)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppChrome>
  );
}
