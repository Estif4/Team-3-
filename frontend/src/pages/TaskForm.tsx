import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
    Task,
    TaskPriority,
    TaskStatus,
} from "../stores/boardSlice";

interface TaskFormProps {
    task?: Task | null;
    boardId: string;
    onSubmit: (data: {
        title: string;
        description: string;
        status: TaskStatus;
        priority: TaskPriority;
        dueDate: string | null;
        assignedTo: string | null;
        tags: string[];
        board: string;
    }) => Promise<void>;
    onClose: () => void;
}

const statusOptions: {
    value: TaskStatus;
    label: string;
}[] = [
        { value: "todo", label: "To Do" },
        { value: "in-progress", label: "In Progress" },
        { value: "review", label: "Review" },
        { value: "done", label: "Done" },
    ];

const priorityOptions: {
    value: TaskPriority;
    label: string;
}[] = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "critical", label: "Critical" },
    ];

export default function TaskForm({
    task,
    boardId,
    onSubmit,
    onClose,
}: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("todo");
    const [priority, setPriority] =
        useState<TaskPriority>("medium");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [tags, setTags] = useState("");

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || "");
            setStatus(task.status);
            setPriority(task.priority);

            setDueDate(
                task.dueDate
                    ? new Date(task.dueDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
            );

            if (
                typeof task.assignedTo === "object" &&
                task.assignedTo
            ) {
                setAssignedTo(task.assignedTo._id);
            } else {
                setAssignedTo(
                    typeof task.assignedTo === "string"
                        ? task.assignedTo
                        : (task.assignedTo as unknown as { _id?: string })?._id || ""
                );
            }

            setTags(task.tags?.join(", ") || "");
        }
    }, [task]);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!title.trim()) {
            setError("Task title is required.");
            return;
        }

        if (title.trim().length > 100) {
            setError("Task title cannot exceed 100 characters.");
            return;
        }

        if (description.length > 500) {
            setError(
                "Description cannot exceed 500 characters."
            );
            return;
        }

        try {
            setSaving(true);

            await onSubmit({
                board: boardId,
                title: title.trim(),
                description: description.trim(),
                status,
                priority,
                dueDate: dueDate || null,
                assignedTo: assignedTo.trim() || null,
                tags: tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save task."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            {task ? "Edit Task" : "Create New Task"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            {task
                                ? "Update task information and progress."
                                : "Add a new task to this board."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-h-[80vh] overflow-y-auto p-6"
                >
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Task title
                        </label>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Implement authentication"
                            maxLength={100}
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />

                        <div className="mt-1 text-right text-xs text-slate-600">
                            {title.length}/100
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Describe what needs to be done..."
                            rows={4}
                            maxLength={500}
                            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />

                        <div className="mt-1 text-right text-xs text-slate-600">
                            {description.length}/500
                        </div>
                    </div>

                    {/* Status + Priority */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as TaskStatus)
                                }
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value as TaskPriority
                                    )
                                }
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                            >
                                {priorityOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Due date + assigned user */}
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Due date
                            </label>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) =>
                                    setDueDate(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Assigned user
                            </label>

                            <input
                                value={assignedTo}
                                onChange={(e) =>
                                    setAssignedTo(e.target.value)
                                }
                                placeholder="User ID"
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                            />

                            <p className="mt-1 text-xs text-slate-600">
                                User selection can be connected to your
                                members API later.
                            </p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Tags
                        </label>

                        <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="frontend, authentication, urgent"
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                        />

                        <p className="mt-1 text-xs text-slate-600">
                            Separate tags with commas.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-7 flex justify-end gap-3 border-t border-slate-800 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : task
                                    ? "Save Changes"
                                    : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}