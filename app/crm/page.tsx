import Link from 'next/link';
import { AppChrome } from '@/components/app-chrome';
import { formatDate } from '@/lib/dates';
import { crmTasks } from '@/lib/tasks';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'CRM' };

export default function CrmHomePage() {
  const tasks = crmTasks();
  return (
    <AppChrome kind="crm">
      <div className="chrome-heading">
        <div>
          <p className="eyebrow">Customer relationships</p>
          <h1>Deals</h1>
          <p>Keep an eye on the conversations moving business forward.</p>
        </div>
        <Link className="button button-secondary" href="/">← All tasks</Link>
      </div>
      <div className="chrome-list">
        <table className="chrome-table">
          <thead>
            <tr>
              <th>Deal</th>
              <th>Account</th>
              <th>Owner</th>
              <th>Close date</th>
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
