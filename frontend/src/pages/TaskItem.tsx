
import { useState } from "react";
import type {
  Task,
  TaskStatus,
  TaskPriority,
} from "../stores/boardSlice";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
  onView: (task: Task) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

function getStatusClass(status: TaskStatus) {
  switch (status) {
    case "done":
      return "bg-green-100 text-green-700";
    case "review":
      return "bg-purple-100 text-purple-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getPriorityClass(priority: TaskPriority) {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function formatDate(date?: string | null) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUserName(user: Task["assignedTo"]) {
  if (!user) return null;

  if (typeof user === "string") {
    return user;
  }

  return user.name || user.email || "Assigned user";
}

function TaskItem({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
  onView,
}: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const assignedUser = getUserName(task.assignedTo);
  const dueDate = formatDate(task.dueDate);

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      {/* Top section */}
      <div className="flex items-start justify-between gap-4">
        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => onView(task)}
        >
          <h3
            className={`truncate text-lg font-semibold ${
              task.status === "done"
                ? "text-gray-400 line-through"
                : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
              {task.description}
            </p>
          )}
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ⋮
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-20 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onView(task);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                View
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(task._id);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {/* Status */}
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task._id, e.target.value as TaskStatus)
          }
          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusClass(
            task.status
          )}`}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={task.priority}
          onChange={(e) =>
            onPriorityChange(task._id, e.target.value as TaskPriority)
          }
          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getPriorityClass(
            task.priority
          )}`}
        >
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Due date */}
        {dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>📅</span>
            <span>{dueDate}</span>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        {/* Assigned user */}
        {assignedUser ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
              {assignedUser.charAt(0).toUpperCase()}
            </div>

            <span className="max-w-[180px] truncate text-sm text-gray-600">
              {assignedUser}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}

        {/* Created date */}
        <span className="text-xs text-gray-400">
          {task.createdAt
            ? `Created ${formatDate(task.createdAt)}`
            : ""}
        </span>
      </div>
    </div>
  );
}

export default TaskItem;
