
import type { ElementType } from "react";
import {
  LayoutDashboard,
  Kanban,
  KanbanSquare,
  Clock3,
  Star,
  Settings,
  CircleHelp,
  LogOut,
  User,
} from "lucide-react";

export type Page =
  | "dashboard"
  | "board"
  | "team-boards"
  | "recent"
  | "favorites"
  | "settings"
  | "help"
  | "profile";

type SidebarProps = {
  activePage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
};

type NavItem = {
  id: Page;
  label: string;
  icon: ElementType;
};

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "board",
    label: "Board",
    icon: KanbanSquare,
  },
  {
    id: "team-boards",
    label: "Team Members",
    icon: Kanban,
  },
  {
    id: "recent",
    label: "Recent",
    icon: Clock3,
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: Star,
  },
];

const bottomItems: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
  {
    id: "help",
    label: "Help",
    icon: CircleHelp,
  },
];

export default function Sidebar({
  activePage,
  onPageChange,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-5">
        <button
          type="button"
          onClick={() => onPageChange("dashboard")}
          className="flex items-center gap-2"
          aria-label="Go to dashboard"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0572B8]">
            <span className="text-sm font-bold text-white">S</span>
          </div>

          <span className="text-lg font-bold tracking-tight text-black">
          SwenetixBoard
          </span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-5">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPageChange(item.id)}
                className={[
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30",
                  isActive
                    ? "bg-[#EAF5FB] text-[#0572B8]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-5 w-5 shrink-0",
                    isActive
                      ? "text-[#0572B8]"
                      : "text-gray-500 group-hover:text-black",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 px-3 py-3">
        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPageChange(item.id)}
                className={[
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30",
                  isActive
                    ? "bg-[#EAF5FB] text-[#0572B8]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-5 w-5",
                    isActive
                      ? "text-[#0572B8]"
                      : "text-gray-500 group-hover:text-black",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <button
          type="button"
          onClick={() => onPageChange("profile")}
          className={[
            "mt-3 flex w-full items-center gap-3 rounded-lg border p-3 text-left",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30",
            activePage === "profile"
              ? "border-[#0572B8]/30 bg-[#EAF5FB]"
              : "border-gray-200 hover:bg-gray-50",
          ].join(" ")}
        >
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
            T
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-black">
              Tsi
            </p>

            <p className="truncate text-xs text-gray-500">
              Profile
            </p>
          </div>

          <User
            className="h-4 w-4 shrink-0 text-gray-400"
            strokeWidth={1.8}
          />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          <LogOut
            className="h-5 w-5"
            strokeWidth={1.8}
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
