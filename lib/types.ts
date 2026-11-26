export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 'open' | 'in_progress' | 'blocked' | 'done';

export type TaskSource = 'crm' | 'helpdesk';

export type Task = {
  id: string;
  reference: string;
  title: string;
  employee: string;
  status: TaskStatus;
  urgency: Urgency;
  deadline: string;
  source: TaskSource;
  href: string;
  summary: string;
  account: string;
};

export type TaskResponse = {
  source: TaskSource;
  tasks: Task[];
};

export type ApiError = {
  error: string;
};
