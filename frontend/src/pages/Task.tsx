import { useEffect, useMemo, useState } from "react";

import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

import {
    useAppDispatch,
    useAppSelector,
} from "../stores";

import {
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setLoading,
    setError,
    type Task,
    type TaskPriority,
    type TaskStatus,
    type CreateTaskData,
    type UpdateTaskData,
} from "../stores/boardSlice";

import {
    getBoardTasks,
    createTask,
    updateTask as updateTaskApi,
    deleteTask,
} from "../api/tasks";

interface TaskPageProps {
    boardId: string;
}

type FilterStatus = "all" | TaskStatus;
type FilterPriority = "all" | TaskPriority;

export default function Task({ boardId }: TaskPageProps) {
    const dispatch = useAppDispatch();

    const { tasks, loading, error } = useAppSelector(
        (state) => state.board
    );

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<FilterStatus>("all");

    const [priorityFilter, setPriorityFilter] =
        useState<FilterPriority>("all");

    const [showForm, setShowForm] = useState(false);

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

    /*
     * Store the task ID here because TaskItem's
     * onDelete callback returns a task ID.
     */
    const [deletingTaskId, setDeletingTaskId] =
        useState<string | null>(null);

    /*
     * Find the complete task from the ID when
     * showing the delete confirmation.
     */
    const deletingTask = useMemo(() => {
        if (!deletingTaskId) return null;

        return (
            tasks.find((task) => task._id === deletingTaskId) ??
            null
        );
    }, [tasks, deletingTaskId]);

    async function loadTasks() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getBoardTasks(boardId);

            dispatch(setTasks(data));
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load tasks."
                )
            );
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        loadTasks();
    }, [boardId]);

    const filteredTasks = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();

        return tasks.filter((task) => {
            const searchMatch =
                normalizedSearch === "" ||
                task.title
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                task.description
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                task.tags?.some((tag) =>
                    tag.toLowerCase().includes(normalizedSearch)
                );

            const statusMatch =
                statusFilter === "all" ||
                task.status === statusFilter;

            const priorityMatch =
                priorityFilter === "all" ||
                task.priority === priorityFilter;

            return (
                searchMatch &&
                statusMatch &&
                priorityMatch
            );
        });
    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
    ]);

    const stats = {
        total: tasks.length,

        todo: tasks.filter(
            (task) => task.status === "todo"
        ).length,

        progress: tasks.filter(
            (task) => task.status === "in-progress"
        ).length,

        review: tasks.filter(
            (task) => task.status === "review"
        ).length,

        done: tasks.filter(
            (task) => task.status === "done"
        ).length,
    };

    /*
     * CREATE TASK
     */
    async function handleCreateTask(
        data: CreateTaskData
    ) {
        try {
            const created = await createTask(
                data
            );

            dispatch(addTask(created));

            setShowForm(false);
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to create task."
                )
            );
        }
    }

    /*
     * UPDATE TASK
     */
    async function handleUpdateTask(
        data: UpdateTaskData
    ) {
        if (!editingTask) return;

        try {
            const updated = await updateTaskApi(
                boardId,
                editingTask._id,
                data
            );

            dispatch(updateTask(updated));

            setEditingTask(null);
            setShowForm(false);
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to update task."
                )
            );
        }
    }

    /*
     * CHANGE STATUS
     *
     * TaskItem sends:
     * taskId + status
     */
    async function handleStatusChange(
        taskId: string,
        status: TaskStatus
    ) {
        try {
            const updated = await updateTaskApi(
                boardId,
                taskId,
                { status }
            );

            dispatch(updateTask(updated));
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to update status."
                )
            );
        }
    }

    /*
     * CHANGE PRIORITY
     *
     * TaskItem sends:
     * taskId + priority
     */
    async function handlePriorityChange(
        taskId: string,
        priority: TaskPriority
    ) {
        try {
            const updated = await updateTaskApi(
                boardId,
                taskId,
                { priority }
            );

            dispatch(updateTask(updated));
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to update priority."
                )
            );
        }
    }

    /*
     * DELETE TASK
     */
    async function handleDelete() {
        if (!deletingTaskId) return;

        try {
            await deleteTask(
                boardId,
                deletingTaskId
            );

            dispatch(
                removeTask(deletingTaskId)
            );

            setDeletingTaskId(null);
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete task."
                )
            );
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* HEADER */}
            <div className="border-b border-slate-800 bg-slate-950/90">
                <div className="mx-auto max-w-7xl px-6 py-7">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                                <span>Board</span>
                                <span>/</span>
                                <span className="text-slate-300">
                                    Tasks
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">
                                Tasks
                            </h1>

                            <p className="mt-1 text-sm text-slate-400">
                                Manage and track everything happening
                                on this board.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setEditingTask(null);
                                setShowForm(true);
                            }}
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                        >
                            + New Task
                        </button>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-7">

                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() => dispatch(setError(null))}
                            className="text-red-300 hover:text-white"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <StatCard
                        label="Total"
                        value={stats.total}
                    />

                    <StatCard
                        label="To Do"
                        value={stats.todo}
                    />

                    <StatCard
                        label="In Progress"
                        value={stats.progress}
                    />

                    <StatCard
                        label="Review"
                        value={stats.review}
                    />

                    <StatCard
                        label="Completed"
                        value={stats.done}
                    />
                </div>

                {/* FILTERS */}
                <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row">

                        <div className="relative flex-1">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                ⌕
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search tasks..."
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as FilterStatus
                                )
                            }
                            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500"
                        >
                            <option value="all">
                                All statuses
                            </option>

                            <option value="todo">
                                To Do
                            </option>

                            <option value="in-progress">
                                In Progress
                            </option>

                            <option value="review">
                                Review
                            </option>

                            <option value="done">
                                Done
                            </option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(
                                    e.target.value as FilterPriority
                                )
                            }
                            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500"
                        >
                            <option value="all">
                                All priorities
                            </option>

                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="critical">
                                Critical
                            </option>
                        </select>
                    </div>
                </div>

                {/* TASKS */}
                <div className="mt-7">

                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                                    />
                                )
                            )}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <EmptyState
                            search={search}
                            onCreate={() => {
                                setEditingTask(null);
                                setShowForm(true);
                            }}
                        />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredTasks.map((task) => (
                                <TaskItem
                                    key={task._id}
                                    task={task}

                                    onEdit={(selectedTask) => {
                                        setEditingTask(selectedTask);
                                        setShowForm(true);
                                    }}

                                    onView={(selectedTask) => {
                                        setSelectedTask(selectedTask);
                                    }}

                                    onDelete={(taskId) => {
                                        setDeletingTaskId(taskId);
                                    }}

                                    onStatusChange={(
                                        taskId,
                                        status
                                    ) => {
                                        handleStatusChange(
                                            taskId,
                                            status
                                        );
                                    }}

                                    onPriorityChange={(
                                        taskId,
                                        priority
                                    ) => {
                                        handlePriorityChange(
                                            taskId,
                                            priority
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* CREATE / EDIT FORM */}
            {showForm && (
                <TaskForm
                    task={editingTask}
                    boardId={boardId}
                    onSubmit={
                        editingTask
                            ? handleUpdateTask
                            : handleCreateTask
                    }
                    onClose={() => {
                        setShowForm(false);
                        setEditingTask(null);
                    }}
                />
            )}

            {/* TASK DETAILS */}
            {selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    onClose={() =>
                        setSelectedTask(null)
                    }
                    onEdit={() => {
                        setEditingTask(selectedTask);
                        setSelectedTask(null);
                        setShowForm(true);
                    }}
                />
            )}

            {/* DELETE CONFIRMATION */}
            {deletingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">

                        <h2 className="text-lg font-semibold text-white">
                            Delete task?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-white">
                                {deletingTask.title}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeletingTaskId(null)
                                }
                                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
                            >
                                Delete Task
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
                {value}
            </p>
        </div>
    );
}

/* =========================
   EMPTY STATE
========================= */

function EmptyState({
    search,
    onCreate,
}: {
    search: string;
    onCreate: () => void;
}) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                ✓
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
                {search
                    ? "No matching tasks"
                    : "No tasks yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {search
                    ? "Try changing your search or filters."
                    : "Create your first task to start organizing the work on this board."}
            </p>

            {!search && (
                <button
                    type="button"
                    onClick={onCreate}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                >
                    Create Task
                </button>
            )}
        </div>
    );
}

/* =========================
   TASK DETAILS
========================= */

function TaskDetails({
    task,
    onClose,
    onEdit,
}: {
    task: Task;
    onClose: () => void;
    onEdit: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">

                <div className="flex items-start justify-between border-b border-slate-800 p-6">

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                            Task details
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-white">
                            {task.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-slate-500 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-6 p-6">

                    {task.description && (
                        <div>
                            <h3 className="mb-2 text-sm font-semibold text-slate-300">
                                Description
                            </h3>

                            <p className="text-sm leading-7 text-slate-400">
                                {task.description}
                            </p>
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">

                        <DetailItem
                            label="Status"
                            value={task.status}
                        />

                        <DetailItem
                            label="Priority"
                            value={task.priority}
                        />

                        <DetailItem
                            label="Due date"
                            value={
                                task.dueDate
                                    ? new Date(
                                        task.dueDate
                                    ).toLocaleDateString()
                                    : "No due date"
                            }
                        />

                        <DetailItem
                            label="Created"
                            value={
                                task.createdAt
                                    ? new Date(
                                        task.createdAt
                                    ).toLocaleDateString()
                                    : "Unknown"
                            }
                        />
                    </div>

                    {task.tags?.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-slate-300">
                                Tags
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {task.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-800 p-6">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={onEdit}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                        Edit Task
                    </button>

                </div>
            </div>
        </div>
    );
}

/* =========================
   DETAIL ITEM
========================= */

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">

            <p className="text-xs text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-slate-200">
                {value.replace("-", " ")}
            </p>
        </div>
    );
}
