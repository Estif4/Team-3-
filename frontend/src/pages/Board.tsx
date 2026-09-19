import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  User as UserIcon,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { getBoards, createBoard } from "../api/boards";
import { getBoardTasks, createTask, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from "../api/tasks";
import { useAppDispatch, useAppSelector } from "../stores";
import { setBoards, setCurrentBoard, setTasks, addTask, updateTask, removeTask } from "../stores/boardSlice";
import type { Task, Board, TaskStatus, TaskPriority } from "../stores/boardSlice";

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export default function BoardPage({ boardId }: { boardId?: string } = {}) {
  const dispatch = useAppDispatch();
  const { boards, currentBoard, tasks } = useAppSelector((state) => state.board);
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modals
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");
  const [creatingBoard, setCreatingBoard] = useState(false);

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
  const [creatingTask, setCreatingTask] = useState(false);

  // Load Boards on Mount
  useEffect(() => {
    async function loadInitialBoards() {
      try {
        setLoading(true);
        setError(null);
        const fetchedBoards = await getBoards();
        dispatch(setBoards(fetchedBoards));

        if (fetchedBoards.length > 0) {
          const selected = (boardId ? fetchedBoards.find((b) => b._id === boardId) : null) || fetchedBoards[0];
          dispatch(setCurrentBoard(selected));
          loadTasksForBoard(selected._id);
        } else {
          // If no board exists, auto-create a default board for great user experience!
          const defaultBoard = await createBoard({
            title: "Main Project",
            description: "General workspace board for your team",
          });
          dispatch(setBoards([defaultBoard]));
          dispatch(setCurrentBoard(defaultBoard));
          loadTasksForBoard(defaultBoard._id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load boards.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialBoards();
  }, [dispatch]);

  const loadTasksForBoard = async (boardId: string) => {
    try {
      setTasksLoading(true);
      const boardTasks = await getBoardTasks(boardId);
      dispatch(setTasks(boardTasks));
    } catch (err: any) {
      console.error("Failed to load tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleSelectBoard = (board: Board) => {
    dispatch(setCurrentBoard(board));
    loadTasksForBoard(board._id);
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      setCreatingBoard(true);
      const board = await createBoard({
        title: newBoardTitle.trim(),
        description: newBoardDesc.trim(),
      });
      dispatch(setBoards([...boards, board]));
      dispatch(setCurrentBoard(board));
      dispatch(setTasks([]));
      setShowNewBoardModal(false);
      setNewBoardTitle("");
      setNewBoardDesc("");
    } catch (err: any) {
      alert(err.message || "Failed to create board");
    } finally {
      setCreatingBoard(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBoard || !newTaskTitle.trim()) return;

    try {
      setCreatingTask(true);
      const task = await createTask({
        board: currentBoard._id,
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim(),
        priority: newTaskPriority,
        status: newTaskStatus,
      });

      dispatch(addTask(task));
      setShowNewTaskModal(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
    } catch (err: any) {
      alert(err.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleStatusChange = async (task: Task, nextStatus: TaskStatus) => {
    if (!currentBoard || task.status === nextStatus) return;

    // Optimistic local update
    const updated = { ...task, status: nextStatus };
    dispatch(updateTask(updated));

    try {
      await updateTaskApi(currentBoard._id, task._id, { status: nextStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert if error
      dispatch(updateTask(task));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentBoard) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    dispatch(removeTask(taskId));
    try {
      await deleteTaskApi(currentBoard._id, taskId);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [tasks, search]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#0572B8]" />
          <p className="text-sm font-medium text-gray-500">Loading boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Project Boards</h1>
          <p className="mt-1 text-sm text-gray-500">Organize, track, and collaborate on team tasks</p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewBoardModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0572B8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0461a0]"
        >
          <Plus className="h-4 w-4" />
          <span>New Board</span>
        </button>
      </div>

      {/* Boards Carousel / List */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Your Boards</h2>
          <span className="text-xs font-semibold text-gray-400">{boards.length} total</span>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-2">
          {boards.map((b) => {
            const isSelected = currentBoard?._id === b._id;
            return (
              <button
                key={b._id}
                type="button"
                onClick={() => handleSelectBoard(b)}
                className={`min-w-[220px] max-w-[260px] rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-[#0572B8] bg-gradient-to-br from-[#EAF5FB] to-white shadow-sm ring-2 ring-[#0572B8]/20"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{b.title}</h3>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-[#0572B8] shrink-0" />}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
                  {b.description || "No description provided"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Board Actions & Search */}
      {currentBoard && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentBoard.title}</h2>
              {currentBoard.description && (
                <p className="mt-0.5 text-xs text-gray-500">{currentBoard.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter tasks..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-900 outline-none focus:border-[#0572B8]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewTaskStatus("todo");
                  setShowNewTaskModal(true);
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-black"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Kanban Columns */}
          {tasksLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#0572B8]" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {columns.map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col.id);

                return (
                  <div
                    key={col.id}
                    className="flex flex-col rounded-2xl border border-gray-200 bg-slate-50/70 p-3.5 min-h-[450px]"
                  >
                    {/* Col Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          {col.title}
                        </h3>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500 shadow-xs">
                          {colTasks.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewTaskStatus(col.id);
                          setShowNewTaskModal(true);
                        }}
                        className="rounded-lg p-1 text-gray-400 hover:bg-white hover:text-gray-700"
                        title="Add task to this column"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Task Cards */}
                    <div className="flex-1 space-y-2.5">
                      {colTasks.map((t) => {
                        const priorityStyles =
                          t.priority === "critical"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : t.priority === "high"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : t.priority === "medium"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200";

                        return (
                          <div
                            key={t._id}
                            className="group relative rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs transition hover:shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-gray-900 leading-snug">
                                {t.title}
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(t._id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 transition hover:text-red-600"
                                title="Delete task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {t.description && (
                              <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 line-clamp-3">
                                {t.description}
                              </p>
                            )}

                            {/* Status & Priority */}
                            <div className="mt-3 flex items-center justify-between gap-2">
                              <span
                                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityStyles}`}
                              >
                                {t.priority}
                              </span>

                              {/* Quick Move Selector */}
                              <select
                                value={t.status}
                                onChange={(e) =>
                                  handleStatusChange(t, e.target.value as TaskStatus)
                                }
                                className="rounded-lg border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600 outline-none hover:border-gray-300"
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                              </select>
                            </div>

                            {/* Footer */}
                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
                              <div className="flex items-center gap-1">
                                <UserIcon className="h-3 w-3" />
                                <span>{user?.displayName || user?.name || "Member"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(t.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {colTasks.length === 0 && (
                        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 text-center">
                          <p className="text-[11px] font-medium text-gray-400">No tasks in {col.title}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Board Modal */}
      {showNewBoardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900">Create New Board</h3>
              <button
                type="button"
                onClick={() => setShowNewBoardModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Board Title</label>
                <input
                  type="text"
                  required
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="e.g. Q4 Sprint, Marketing Campaign"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-[#0572B8]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  placeholder="Brief summary of this board's purpose..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-[#0572B8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewBoardModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBoard}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0572B8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0461a0] disabled:opacity-60"
                >
                  {creatingBoard && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Create Board</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900">Add Task to {currentBoard?.title}</h3>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement user settings"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-[#0572B8]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Provide any relevant context or requirements..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-[#0572B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Column</label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-[#0572B8]"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-[#0572B8]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTask}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
                >
                  {creatingTask && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Add Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}