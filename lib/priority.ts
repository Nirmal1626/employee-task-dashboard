import { daysUntil } from './dates';
import type { Task, Urgency } from './types';

const urgencyWeight: Record<Urgency, number> = {
  critical: 40,
  high: 30,
  medium: 20,
  low: 10,
};

export function priorityScore(task: Task, now = new Date()) {
  if (task.status === 'done') return -1;
  const days = daysUntil(task.deadline, now);
  const deadlineWeight = days < 0 ? 100 + Math.min(30, -days) : days === 0 ? 80 : days <= 2 ? 60 : days <= 7 ? 40 : 20;
  const blockedBoost = task.status === 'blocked' ? 5 : 0;
  return deadlineWeight * 10 + urgencyWeight[task.urgency] + blockedBoost;
}

export function deadlineLabel(task: Task, now = new Date()) {
  if (task.status === 'done') return 'Completed';
  const days = daysUntil(task.deadline, now);
  if (days < 0) return days === -1 ? 'Overdue by 1 day' : `Overdue by ${-days} days`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
}

export function sortByPriority(tasks: Task[], now = new Date()) {
  return [...tasks].sort((left, right) => {
    const score = priorityScore(right, now) - priorityScore(left, now);
    if (score !== 0) return score;
    if (left.deadline !== right.deadline) return left.deadline < right.deadline ? -1 : 1;
    return left.title.localeCompare(right.title);
  });
}
