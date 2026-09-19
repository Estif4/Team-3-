import { useMemo, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Search,
  Calendar,
  User,
} from "lucide-react";

type TaskStatus = "todo" | "in-progress" | "review" | "done";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "critical";
  assignedTo: string;
  dueDate: string;
};

type Board = {
  _id: string;
  title: string;
  description: string;
};

const mockBoards: Board[] = [
  {
    _id: "board-1",
    title: "Website Development",
    description: "Main website development tasks",
  },
  {
    _id: "board-2",
    title: "Mobile App",
    description: "Mobile application development",
  },
  {
    _id: "board-3",
    title: "Marketing",
    description: "Marketing and promotional tasks",
  },
];

const mockTasks: Task[] = [
  {
    _id: "task-1",
    title: "Create landing page",
    description: "Build the main landing page",
    status: "todo",
    priority: "high",
    assignedTo: "Betremariam",
    dueDate: "2026-09-25",
  },
  {
    _id: "task-2",
    title: "Setup authentication",
    description: "Implement login and registration",
    status: "in-progress",
    priority: "critical",
    assignedTo: "Abebe",
    dueDate: "2026-09-22",
  },
  {
    _id: "task-3",
    title: "Design dashboard",
    description: "Create dashboard UI",
    status: "review",
    priority: "medium",
    assignedTo: "Betremariam",
    dueDate: "2026-09-24",
  },
  {
    _id: "task-4",
    title: "Deploy application",
    description: "Deploy the application to production",
    status: "done",
    priority: "high",
    assignedTo: "Abebe",
    dueDate: "2026-09-20",
  },
  {
    _id: "task-5",
    title: "Create API documentation",
    description: "Document backend endpoints",
    status: "todo",
    priority: "low",
    assignedTo: "Daniel",
    dueDate: "2026-09-28",
  },
];

const columns: {
  id: TaskStatus;
  title: string;
}[] = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

export default function BoardPage() {
  const [selectedBoardId, setSelectedBoardId] = useState("board-1");
  const [search, setSearch] = useState("");

  const selectedBoard = mockBoards.find(
    (board) => board._id === selectedBoardId
  );

  const filteredTasks = useMemo(() => {
    return mockTasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Boards
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your projects and tasks
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          <Plus size={18} />
          New Board
        </button>
      </div>

      {/* Board selector */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Your Boards
          </h2>

          <span className="text-sm text-gray-500">
            {mockBoards.length} boards
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {mockBoards.map((board) => {
            const isSelected =
              board._id === selectedBoardId;

            return (
              <button
                key={board._id}
                onClick={() =>
                  setSelectedBoardId(board._id)
                }
                className={`min-w-[220px] rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-black bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {board.title}
                  </h3>

                  <MoreHorizontal size={18} />
                </div>

                <p
                  className={`mt-2 line-clamp-2 text-sm ${
                    isSelected
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  {board.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected board */}
      {selectedBoard && (
        <>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedBoard.title}
              </h2>

              <p className="text-sm text-gray-500">
                {selectedBoard.description}
              </p>
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search tasks..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Kanban */}
          <div className="grid gap-5 xl:grid-cols-4">
            {columns.map((column) => {
              const tasks = filteredTasks.filter(
                (task) => task.status === column.id
              );

              return (
                <div
                  key={column.id}
                  className="min-h-[500px] rounded-xl border border-gray-200 bg-gray-100 p-3"
                >
                  {/* Column header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {column.title}
                      </h3>

                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                        {tasks.length}
                      </span>
                    </div>

                    <button className="rounded-md p-1.5 hover:bg-gray-200">
                      <Plus size={17} />
                    </button>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task._id}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {task.title}
                          </h4>

                          <button className="text-gray-400 hover:text-gray-700">
                            <MoreHorizontal size={17} />
                          </button>
                        </div>

                        <p className="mb-4 text-xs leading-5 text-gray-500">
                          {task.description}
                        </p>

                        {/* Priority */}
                        <div className="mb-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              task.priority === "critical"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "high"
                                ? "bg-orange-100 text-orange-700"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <User size={14} />
                            {task.assignedTo}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar size={14} />
                            {task.dueDate}
                          </div>
                        </div>
                      </div>
                    ))}

                    {tasks.length === 0 && (
                      <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center">
                        <p className="text-xs text-gray-400">
                          No tasks
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}