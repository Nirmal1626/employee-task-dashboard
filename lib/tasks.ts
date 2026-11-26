import { shiftDate } from './dates';
import type { Task } from './types';

export function crmTasks(now = new Date()): Task[] {
  const on = (days: number) => shiftDate(now, days);
  return [
    {
      id: 'crm-1842',
      reference: 'CRM-1842',
      title: 'Sagar & Co renewal — call back',
      employee: 'Priya Shah',
      status: 'in_progress',
      urgency: 'high',
      deadline: on(-3),
      source: 'crm',
      href: '/crm/tasks/crm-1842',
      account: 'Sagar & Co',
      summary: 'Renewal still isn\'t signed. Need the seat count before I resend the quote.',
    },
    {
      id: 'crm-1860',
      reference: 'CRM-1860',
      title: 'Brightline quote',
      employee: 'Arjun Mehta',
      status: 'open',
      urgency: 'critical',
      deadline: on(0),
      source: 'crm',
      href: '/crm/tasks/crm-1860',
      account: 'Brightline Logistics',
      summary: 'Revised quote is ready. They asked for it today.',
    },
    {
      id: 'crm-1877',
      reference: 'CRM-1877',
      title: 'Greenleaf PO',
      employee: 'Neha Kapoor',
      status: 'blocked',
      urgency: 'high',
      deadline: on(1),
      source: 'crm',
      href: '/crm/tasks/crm-1877',
      account: 'Greenleaf Cafe',
      summary: 'Waiting on their accounts person. Chased once on Monday.',
    },
    {
      id: 'crm-1790',
      reference: 'CRM-1790',
      title: 'Orbit Payroll demo follow-up',
      employee: 'Rohan Das',
      status: 'done',
      urgency: 'low',
      deadline: on(-5),
      source: 'crm',
      href: '/crm/tasks/crm-1790',
      account: 'Orbit Payroll',
      summary: 'Sent the demo notes last week.',
    },
    {
      id: 'crm-1904',
      reference: 'CRM-1904',
      title: 'Kaveri Schools — missing contacts',
      employee: 'Priya Shah',
      status: 'open',
      urgency: 'medium',
      deadline: on(5),
      source: 'crm',
      href: '/crm/tasks/crm-1904',
      account: 'Kaveri Schools',
      summary: 'Two contacts are missing on the account.',
    },
    {
      id: 'crm-1911',
      reference: 'CRM-1911',
      title: 'Patel order discount',
      employee: 'Ananya Iyer',
      status: 'open',
      urgency: 'medium',
      deadline: on(2),
      source: 'crm',
      href: '/crm/tasks/crm-1911',
      account: 'Patel Stationery',
      summary: 'They want 8% off the repeat order. Checking with the sales lead.',
    },
  ];
}

export function helpdeskTasks(now = new Date()): Task[] {
  const on = (days: number) => shiftDate(now, days);
  return [
    {
      id: 'hd-441',
      reference: 'HD-441',
      title: 'accounts@ mail bouncing',
      employee: 'Priya Shah',
      status: 'in_progress',
      urgency: 'critical',
      deadline: on(-1),
      source: 'helpdesk',
      href: '/helpdesk/tickets/hd-441',
      account: 'Accounts',
      summary: 'Outbound mail from accounts@ has been bouncing since yesterday.',
    },
    {
      id: 'hd-458',
      reference: 'HD-458',
      title: 'Support chat alerts stopped',
      employee: 'Ananya Iyer',
      status: 'blocked',
      urgency: 'high',
      deadline: on(0),
      source: 'helpdesk',
      href: '/helpdesk/tickets/hd-458',
      account: 'Support',
      summary: 'Mentions stopped after the app update. Need an admin to approve it.',
    },
    {
      id: 'hd-402',
      reference: 'HD-402',
      title: 'Floor 2 printer',
      employee: 'Neha Kapoor',
      status: 'done',
      urgency: 'low',
      deadline: on(-1),
      source: 'helpdesk',
      href: '/helpdesk/tickets/hd-402',
      account: 'Office',
      summary: 'Fixed. Test page came out fine.',
    },
    {
      id: 'hd-470',
      reference: 'HD-470',
      title: 'Spare laptop for client visit',
      employee: 'Arjun Mehta',
      status: 'open',
      urgency: 'low',
      deadline: on(12),
      source: 'helpdesk',
      href: '/helpdesk/tickets/hd-470',
      account: 'Sales',
      summary: 'Spare is in the cupboard. Hand it over when they are back from the visit.',
    },
    {
      id: 'hd-473',
      reference: 'HD-473',
      title: 'Meeting room monitor flickering',
      employee: 'Priya Shah',
      status: 'open',
      urgency: 'medium',
      deadline: on(4),
      source: 'helpdesk',
      href: '/helpdesk/tickets/hd-473',
      account: 'Office',
      summary: 'Flickers after about 20 minutes. Tried another cable, same thing.',
    },
  ];
}

export function findCrmTask(id: string, now = new Date()) {
  return crmTasks(now).find((task) => task.id === id);
}

export function findHelpdeskTask(id: string, now = new Date()) {
  return helpdeskTasks(now).find((task) => task.id === id);
}
