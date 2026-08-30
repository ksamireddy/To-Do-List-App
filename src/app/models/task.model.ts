/**
 * The fixed set of statuses a task can move through.
 * Kept as a const array (not just a union) so components can iterate
 * over it to build <select> options, filters, etc. without duplicating
 * the list in multiple places.
 */
export const TASK_STATUSES = [
  'New',
  'In Progress',
  'Rejected',
  'Verified',
  'Completed'
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

/** Shape used when creating or editing a task via the form component. */
export interface TaskFormValue {
  title: string;
  description: string;
  status: TaskStatus;
}
