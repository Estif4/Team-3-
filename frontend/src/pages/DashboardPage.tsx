import { useMemo } from "react";
import {
  KanbanSquare,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
  CircleDot,
  AlertCircle,
} from "lucide-react";

import { useAppSelector } from "../stores";
import { mockUsers } from "../components/data/users.mock";
import type { Page } from "../components/layout/Sidebar";

/* ─────────────────────────────────────── */
/* Props                                   */
/* ─────────────────────────────────────── */

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

/* ─────────────────────────────────────── */
/* Helpers                                 */
/* ─────────────────────────────────────── */

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const priorityMeta: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  critical: {
    label: "Critical",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
  },
  high: {
    label: "High",
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-200",
  },
  medium: {
    label: "Medium",
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
  },
  low: {
    label: "Low",
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
  },
};

const statusMeta: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  todo: {
    label: "To Do",
    icon: <CircleDot className="h-3.5 w-3.5" />,
    color: "text-gray-500",
  },
  "in-progress": {
    label: "In Progress",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-blue-500",
  },
  review: {
    label: "Review",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: "text-amber-500",
  },
  done: {
    label: "Done",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-green-500",
  },
};

/* ─────────────────────────────────────── */
/* Main Component                          */
/* ─────────────────────────────────────── */

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { tasks } = useAppSelector((s) => s.board);
  const { user } = useAppSelector((s) => s.auth);
  const userName = user?.displayName || user?.name || "there";

  /* ── stats ── */
  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      progress: tasks.filter((t) => t.status === "in-progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks]
  );

  const completion =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5),
    [tasks]
  );

  const onlineUsers = mockUsers.filter((u) => u.status === "online");
  const awayUsers = mockUsers.filter((u) => u.status === "away");

  return (
    <div className="space-y-6">
      {/* ── Hero greeting ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-7"
        style={{
          background:
            "linear-gradient(135deg, #0572B8 0%, #0490e8 50%, #06b6d4 100%)",
        }}
      >
        {/* decorative circles */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff, transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff, transparent)" }}
        />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">
              {formatDate()}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              {greeting()}, {userName} 👋
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              {stats.progress > 0
                ? `You have ${stats.progress} task${
                    stats.progress > 1 ? "s" : ""
                  } in progress.`
                : "Everything is up to date. Great work!"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              {completion}% complete
            </span>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={<KanbanSquare className="h-5 w-5" />}
          label="Total Tasks"
          value={stats.total}
          iconBg="bg-[#EAF5FB]"
          iconColor="text-[#0572B8]"
          sub="All tasks on the board"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="In Progress"
          value={stats.progress}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          sub={`${stats.todo} still to-do`}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Completed"
          value={stats.done}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          sub={`${completion}% of total`}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Team Online"
          value={onlineUsers.length}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          sub={`${awayUsers.length} away`}
        />
      </div>

      {/* ── Main content grid ── */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left col — 2 / 3 */}
        <div className="space-y-6 xl:col-span-2">
          {/* Quick Actions */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <QuickAction
                icon={<KanbanSquare className="h-6 w-6 text-[#0572B8]" />}
                title="Go to Board"
                description="View tasks and board overview"
                color="from-[#EAF5FB] to-white border-blue-100"
                onClick={() => onNavigate("board")}
              />
              <QuickAction
                icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
                title="View Progress"
                description="Check project completion stats"
                color="from-purple-50 to-white border-purple-100"
                onClick={() => onNavigate("board")}
              />
              <QuickAction
                icon={<Users className="h-6 w-6 text-green-500" />}
                title="Team Members"
                description="Manage collaborators"
                color="from-green-50 to-white border-green-100"
                onClick={() => onNavigate("team-boards")}
              />
            </div>
          </section>

          {/* Recent Tasks */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Recent Tasks
              </h2>
              <button
                type="button"
                onClick={() => onNavigate("board")}
                className="flex items-center gap-1 text-xs font-medium text-[#0572B8] transition hover:underline"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {recentTasks.length === 0 ? (
                <EmptyTasks onNavigate={onNavigate} />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentTasks.map((task) => {
                    const sm = statusMeta[task.status] ?? statusMeta["todo"];
                    const pm =
                      priorityMeta[task.priority] ?? priorityMeta["low"];
                    return (
                      <li
                        key={task._id}
                        className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-gray-50"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {task.title}
                          </p>
                          <div
                            className={`mt-0.5 flex items-center gap-1 text-xs ${sm.color}`}
                          >
                            {sm.icon}
                            <span>{sm.label}</span>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium ${pm.bg} ${pm.color}`}
                        >
                          {pm.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* Right col — 1 / 3 */}
        <div className="space-y-6">
          {/* Progress breakdown */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#0572B8]" />
              <h2 className="text-sm font-semibold text-gray-800">
                Progress Breakdown
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <ProgressRow
                label="To Do"
                count={stats.todo}
                total={stats.total}
                color="bg-gray-300"
              />
              <ProgressRow
                label="In Progress"
                count={stats.progress}
                total={stats.total}
                color="bg-blue-500"
              />
              <ProgressRow
                label="Review"
                count={stats.review}
                total={stats.total}
                color="bg-amber-400"
              />
              <ProgressRow
                label="Done"
                count={stats.done}
                total={stats.total}
                color="bg-green-500"
              />
            </div>
          </section>

          {/* Team Presence */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0572B8]" />
              <h2 className="text-sm font-semibold text-gray-800">
                Team Presence
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5">
              {mockUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0572B8] text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                          user.status === "online"
                            ? "bg-green-500"
                            : user.status === "away"
                            ? "bg-amber-400"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                      user.status === "online"
                        ? "bg-green-50 text-green-600"
                        : user.status === "away"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onNavigate("team-boards")}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Manage Team
              <ArrowRight className="h-3 w-3" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── */
/* Sub-components                          */
/* ─────────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  iconBg,
  iconColor,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconBg: string;
  iconColor: string;
  sub: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-700">{label}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full flex-col items-start gap-3 rounded-2xl border bg-gradient-to-br p-5 text-left transition hover:shadow-md ${color}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      <ArrowRight className="ml-auto h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#0572B8]" />
    </button>
  );
}

function ProgressRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-medium">
          {count} <span className="text-gray-400">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EmptyTasks({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF5FB]">
        <KanbanSquare className="h-6 w-6 text-[#0572B8]" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-800">
        No tasks yet
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Head to the Board to create your first task.
      </p>
      <button
        type="button"
        onClick={() => onNavigate("board")}
        className="mt-4 rounded-xl bg-[#0572B8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0461a0]"
      >
        Open Board
      </button>
    </div>
  );
}
