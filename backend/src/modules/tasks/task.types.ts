import type { Types } from "mongoose";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface ITask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  board: Types.ObjectId;
  assignee: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const TASK_FIELDS = [
  "title",
  "description",
  "status",
  "priority",
  "assignee",
  "dueDate",
] as const;

export interface TaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string | null;
  dueDate?: string | Date | null;
}
